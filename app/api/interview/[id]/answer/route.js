import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import { chatCompletion } from "@/lib/openrouter";
import {
  buildInterviewSystemPrompt,
  buildOpeningPrompt,
  buildSummarySystemPrompt,
} from "@/lib/prompts";
import { rateLimit } from "@/lib/rateLimit";


function parseFeedbackJSON(text) {
  try {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) return JSON.parse(match[1]);
  } catch {}
  try {
    const match = text.match(/\{[\s\S]*"score"[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return {
    score: 60,
    strength: "You provided an answer to the question.",
    improvement: "Try to be more specific with examples and measurable outcomes.",
    tip: "Use the STAR method: Situation, Task, Action, Result.",
  };
}

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

const rl = rateLimit({
  key:    `answer:${session.user.id}`,
  limit:  30,
  window: 60 * 1000,
});

if (!rl.allowed) {
  return Response.json(
    { error: "Too many requests. Please slow down." },
    {
      status: 429,
      headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
    }
  );
}

    const { id } = await params;
    const { answer, question, questionNumber } = await req.json();

    if (!answer?.trim()) {
      return Response.json({ error: "Answer is required" }, { status: 400 });
    }

    await connectDB();

    const interviewSession = await InterviewSession.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!interviewSession) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    if (interviewSession.status !== "in-progress") {
      return Response.json({ error: "Session is not active" }, { status: 400 });
    }

    const { role, level, interviewType, exchanges, totalQuestions } = interviewSession;

    const systemPrompt = buildInterviewSystemPrompt({ role, level, interviewType });

    // Rebuild full conversation for context
    const messages = [
      {
        role: "user",
        content: buildOpeningPrompt({ role, level, interviewType }),
      },
    ];

    for (const ex of exchanges) {
      messages.push({ role: "assistant", content: ex.question });
      messages.push({ role: "user",      content: ex.answer });
    }

    // Add current Q&A
    messages.push({ role: "assistant", content: question });
    messages.push({ role: "user",      content: answer });

    const isLastQuestion = questionNumber >= totalQuestions;

    if (isLastQuestion) {
      messages.push({
        role: "user",
        content:
          "That was my final answer. Please give me feedback on this answer, then tell me the interview is complete.",
      });
    }

    // Get feedback from AI
    const feedbackResponse = await chatCompletion({ systemPrompt, messages });
    const feedback = parseFeedbackJSON(feedbackResponse);

    // Save exchange to DB
    interviewSession.exchanges.push({
      questionNumber,
      question,
      answer: answer.trim(),
      feedback,
    });

    if (isLastQuestion) {
      // Generate session summary
      const summaryMessages = [
        {
          role: "user",
          content: `Here is a completed ${interviewType} interview for a ${level} ${role} position. Analyze everything and produce the session summary JSON.`,
        },
      ];

      for (const ex of interviewSession.exchanges) {
        summaryMessages.push({
          role: "assistant",
          content: `Question ${ex.questionNumber}: ${ex.question}`,
        });
        summaryMessages.push({
          role: "user",
          content: `Answer: ${ex.answer} [Score: ${ex.feedback.score}]`,
        });
      }

      summaryMessages.push({
        role: "user",
        content: "Now produce the final session summary JSON.",
      });

      let report = null;
      try {
        const summaryText = await chatCompletion({
          systemPrompt: buildSummarySystemPrompt(),
          messages: summaryMessages,
          maxTokens: 800,
        });
        const clean = summaryText.replace(/```json|```/g, "").trim();
        report = JSON.parse(clean);
      } catch {
        // Fallback report
        const scores = interviewSession.exchanges.map((e) => e.feedback.score);
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        report = {
          overallScore: avg,
          verdict: avg >= 75 ? "Hire" : avg >= 55 ? "Almost Ready" : "Not Yet",
          topStrength: "You completed the full interview session.",
          topGrowthArea: "Review individual feedback for specific improvements.",
          readinessLevel: avg >= 75 ? "Ready" : "Needs Practice",
          actionPlan: [
            "Review each answer's feedback carefully",
            "Practice the STAR method for behavioral questions",
            "Schedule another session to track improvement",
          ],
        };
      }

      interviewSession.status    = "completed";
      interviewSession.report    = report;
      interviewSession.completedAt = new Date();
      interviewSession.durationSeconds = Math.floor(
        (new Date() - new Date(interviewSession.startedAt)) / 1000
      );
    }

    await interviewSession.save();

    return Response.json({
      success: true,
      feedback,
      feedbackRaw: feedbackResponse,
      isComplete: isLastQuestion,
      sessionId: id,
      report: isLastQuestion ? interviewSession.report : null,
    });
  } catch (error) {
    console.error("Submit answer error:", error);
    return Response.json(
      { error: "Failed to process answer" },
      { status: 500 }
    );
  }
}
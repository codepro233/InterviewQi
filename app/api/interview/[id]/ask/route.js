import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import { chatCompletion } from "@/lib/openrouter";
import { buildInterviewSystemPrompt, buildOpeningPrompt } from "@/lib/prompts";

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const { role, level, interviewType, exchanges } = interviewSession;

    const systemPrompt = buildInterviewSystemPrompt({ role, level, interviewType });

    // Build message history for context
    const messages = [];

    if (exchanges.length === 0) {
      // First question — use opening prompt
      messages.push({
        role: "user",
        content: buildOpeningPrompt({ role, level, interviewType }),
      });
    } else {
      // Rebuild full conversation history
      messages.push({
        role: "user",
        content: buildOpeningPrompt({ role, level, interviewType }),
      });

      for (const exchange of exchanges) {
        messages.push({ role: "assistant", content: exchange.question });
        messages.push({ role: "user",      content: exchange.answer });
      }

      // Ask for next question explicitly
      messages.push({
        role: "user",
        content: `Good. Now ask question ${exchanges.length + 1} of ${interviewSession.totalQuestions}.`,
      });
    }

    const aiResponse = await chatCompletion({ systemPrompt, messages });

    // Update currentQuestion counter
    interviewSession.currentQuestion = exchanges.length + 1;
    await interviewSession.save();

    return Response.json({
      success: true,
      question: aiResponse,
      questionNumber: exchanges.length + 1,
    });
  } catch (error) {
    console.error("Ask question error:", error);
    return Response.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
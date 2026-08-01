import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import User from "@/models/User";

const FREE_LIMIT = 5;

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, level, interviewType } = await req.json();

    // Validate inputs
    if (!role || !level || !interviewType) {
      return Response.json(
        { error: "Role, level, and interview type are required" },
        { status: 400 }
      );
    }

    const validLevels = ["Entry-level", "Mid-level", "Senior", "Lead / Manager"];
    const validTypes  = ["behavioral", "technical", "situational"];

    if (!validLevels.includes(level)) {
      return Response.json({ error: "Invalid level" }, { status: 400 });
    }
    if (!validTypes.includes(interviewType)) {
      return Response.json({ error: "Invalid interview type" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select(
      "plan freeSessionsUsed freeSessionsResetAt"
    );

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Reset monthly counter if it's a new month
    const now = new Date();
    const resetAt = new Date(user.freeSessionsResetAt);
    const isNewMonth =
      now.getMonth() !== resetAt.getMonth() ||
      now.getFullYear() !== resetAt.getFullYear();

    if (isNewMonth) {
      user.freeSessionsUsed = 0;
      user.freeSessionsResetAt = now;
      await user.save();
    }

    // Enforce free tier limit
    if (user.plan === "free" && user.freeSessionsUsed >= FREE_LIMIT) {
      return Response.json(
        {
          error: "Free session limit reached",
          code: "LIMIT_REACHED",
          upgradeUrl: "/upgrade",
        },
        { status: 403 }
      );
    }

    // Create the session in DB
    const interviewSession = await InterviewSession.create({
      userId: session.user.id,
      role: role.trim(),
      level,
      interviewType,
      status: "in-progress",
      totalQuestions: 5,
      currentQuestion: 0,
      exchanges: [],
      startedAt: now,
    });

    // Increment free usage counter
    if (user.plan === "free") {
      user.freeSessionsUsed += 1;
      await user.save();
    }

    return Response.json({
      success: true,
      sessionId: interviewSession._id.toString(),
    });
  } catch (error) {
    console.error("Create interview error:", error);
    return Response.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
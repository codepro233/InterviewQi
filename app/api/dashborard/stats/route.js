import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;

    // Get user for plan + free session count
    const user = await User.findById(userId).select(
      "plan freeSessionsUsed freeSessionsResetAt"
    );

    // Total completed sessions
    const totalSessions = await InterviewSession.countDocuments({
      userId,
      status: "completed",
    });

    // Sessions this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const sessionsThisMonth = await InterviewSession.countDocuments({
      userId,
      status: "completed",
      createdAt: { $gte: startOfMonth },
    });

    // Average score across all completed sessions
    const scoreAgg = await InterviewSession.aggregate([
      { $match: { userId: user._id, status: "completed" } },
      { $group: { _id: null, avgScore: { $avg: "$report.overallScore" } } },
    ]);

    const avgScore = scoreAgg[0]?.avgScore
      ? Math.round(scoreAgg[0].avgScore)
      : null;

    // Recent 3 sessions
    const recentSessions = await InterviewSession.find({
      userId,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("role level interviewType report.overallScore report.verdict createdAt");

    // Free tier limits
    const FREE_LIMIT = 3;
    const sessionsRemaining =
      user.plan === "free"
        ? Math.max(0, FREE_LIMIT - (user.freeSessionsUsed ?? 0))
        : null;

    return Response.json({
      success: true,
      stats: {
        totalSessions,
        sessionsThisMonth,
        avgScore,
        sessionsRemaining,
        plan: user.plan,
      },
      recentSessions,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return Response.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
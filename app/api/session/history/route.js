import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page    = parseInt(searchParams.get("page")  ?? "1");
    const limit   = parseInt(searchParams.get("limit") ?? "10");
    const type    = searchParams.get("type")   ?? "";
    const status  = searchParams.get("status") ?? "completed";
    const skip    = (page - 1) * limit;

    await connectDB();

    const query = {
      userId: session.user.id,
      status,
    };

    if (type) query.interviewType = type;

    const [sessions, total] = await Promise.all([
      InterviewSession.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "role level interviewType status report.overallScore report.verdict report.readinessLevel createdAt durationSeconds totalQuestions"
        ),
      InterviewSession.countDocuments(query),
    ]);

    return Response.json({
      success: true,
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + sessions.length < total,
      },
    });
  } catch (error) {
    console.error("History error:", error);
    return Response.json(
      { error: "Failed to load history" },
      { status: 500 }
    );
  }
}
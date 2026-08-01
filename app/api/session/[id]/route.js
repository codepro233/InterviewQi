import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";

export async function GET(req, { params }) {
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

    return Response.json({
      success: true,
      session: interviewSession,
    });
  } catch (error) {
    console.error("Get session report error:", error);
    return Response.json(
      { error: "Failed to load session" },
      { status: 500 }
    );
  }
}
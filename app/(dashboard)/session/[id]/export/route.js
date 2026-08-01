import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import User from "@/models/User";

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Pro plan
    await connectDB();
    const user = await User.findById(session.user.id).select("plan");

    if (!user || user.plan === "free") {
      return Response.json(
        { error: "PDF export requires a Pro plan", code: "UPGRADE_REQUIRED" },
        { status: 403 }
      );
    }

    const { id } = await params;

    await InterviewSession.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { pdfGeneratedAt: new Date() }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Export track error:", error);
    return Response.json({ error: "Failed to track export" }, { status: 500 });
  }
}
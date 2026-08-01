import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select(
      "plan freeSessionsUsed freeSessionsResetAt paystackCustomerCode"
    );

    const subscription = await Subscription.findOne({
      userId: session.user.id,
      status: { $in: ["active", "cancelled"] },
    }).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      plan:    user.plan,
      freeSessionsUsed:  user.freeSessionsUsed,
      freeSessionsResetAt: user.freeSessionsResetAt,
      subscription: subscription
        ? {
            status:           subscription.status,
            plan:             subscription.plan,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelledAt:      subscription.cancelledAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return Response.json(
      { error: "Failed to load subscription" },
      { status: 500 }
    );
  }
}
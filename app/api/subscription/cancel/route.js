import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import { cancelSubscription } from "@/lib/paystack";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const sub = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
    });

    if (!sub) {
      return Response.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    if (!sub.paystackSubscriptionCode) {
      return Response.json(
        { error: "Subscription code not found" },
        { status: 400 }
      );
    }

    // Cancel on Paystack
    await cancelSubscription(
      sub.paystackSubscriptionCode,
      sub.paystackCustomerCode
    );

    // Update local records
    await Subscription.findByIdAndUpdate(sub._id, {
      status:      "cancelled",
      cancelledAt: new Date(),
    });

    await User.findByIdAndUpdate(session.user.id, { plan: "free" });

    return Response.json({
      success: true,
      message: "Subscription cancelled. You'll keep Pro access until the end of the billing period.",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return Response.json(
      { error: error.message ?? "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
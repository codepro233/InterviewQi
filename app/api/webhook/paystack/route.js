import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import { verifyWebhookSignature } from "@/lib/paystack";

export async function POST(req) {
  try {
    const rawBody  = await req.text();
    const signature = req.headers.get("x-paystack-signature") ?? "";

    // Verify this is genuinely from Paystack
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn("Invalid Paystack webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    await connectDB();

    console.log("Paystack webhook event:", event.event);

    switch (event.event) {

      // ── Subscription created ───────────────────────────────────────────────
      case "subscription.create": {
        const { customer, plan, subscription_code, next_payment_date } = event.data;

        const user = await User.findOne({ email: customer.email });
        if (!user) break;

        const planName = plan.name.toLowerCase().includes("agency")
          ? "agency"
          : "pro";

        await User.findByIdAndUpdate(user._id, { plan: planName });

        await Subscription.findOneAndUpdate(
          { userId: user._id },
          {
            status:                   "active",
            paystackSubscriptionCode: subscription_code,
            paystackCustomerCode:     customer.customer_code,
            plan:                     planName,
            currentPeriodStart:       new Date(),
            currentPeriodEnd:         new Date(next_payment_date),
          },
          { upsert: true, new: true }
        );
        break;
      }

      // ── Successful charge (renewal) ────────────────────────────────────────
      case "charge.success": {
        const { customer, metadata } = event.data;
        if (!metadata?.plan) break;

        const user = await User.findOne({ email: customer.email });
        if (!user) break;

        await User.findByIdAndUpdate(user._id, {
          plan:              metadata.plan,
          freeSessionsUsed:  0,
        });

        await Subscription.findOneAndUpdate(
          { userId: user._id },
          {
            status:             "active",
            currentPeriodStart: new Date(),
            currentPeriodEnd:   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        );
        break;
      }

      // ── Subscription disabled / cancelled ─────────────────────────────────
      case "subscription.disable": {
        const { customer } = event.data;

        const user = await User.findOne({ email: customer.email });
        if (!user) break;

        await User.findByIdAndUpdate(user._id, { plan: "free" });

        await Subscription.findOneAndUpdate(
          { userId: user._id, status: "active" },
          {
            status:      "cancelled",
            cancelledAt: new Date(),
          }
        );
        break;
      }

      // ── Invoice failed (payment declined) ─────────────────────────────────
      case "invoice.payment_failed": {
        const { customer } = event.data;

        const user = await User.findOne({ email: customer.email });
        if (!user) break;

        await Subscription.findOneAndUpdate(
          { userId: user._id, status: "active" },
          { status: "expired" }
        );

        // Grace period — don't downgrade immediately
        // You could send an email here in a real app
        console.log(`Payment failed for ${customer.email} — grace period active`);
        break;
      }

      default:
        console.log("Unhandled Paystack event:", event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}


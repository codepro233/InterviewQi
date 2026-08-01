import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import { verifyTransaction } from "@/lib/paystack";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(
      new URL("/upgrade?error=missing_reference", process.env.NEXTAUTH_URL)
    );
  }

  try {
    await connectDB();

    const transaction = await verifyTransaction(reference);

    if (transaction.status !== "success") {
      return NextResponse.redirect(
        new URL("/upgrade?error=payment_failed", process.env.NEXTAUTH_URL)
      );
    }

    const { userId, plan } = transaction.metadata;

    // Upgrade user plan
    await User.findByIdAndUpdate(userId, {
      plan,
      freeSessionsUsed: 0,
    });

    // Update subscription record
    const sub = await Subscription.findOneAndUpdate(
      { paystackReference: reference },
      {
        status:               "active",
        paystackSubscriptionCode: transaction.subscription?.subscription_code ?? null,
        currentPeriodStart:   new Date(),
        currentPeriodEnd:     new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    return NextResponse.redirect(
      new URL("/dashboard?upgraded=true", process.env.NEXTAUTH_URL)
    );
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.redirect(
      new URL("/upgrade?error=verify_failed", process.env.NEXTAUTH_URL)
    );
  }
}
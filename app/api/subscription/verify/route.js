import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";

export async function GET(req) {
  const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(new URL("/upgrade?error=missing_reference", BASE_URL));
    }

    const transaction = await verifyTransaction(reference);

    if (transaction.status !== "success") {
      return NextResponse.redirect(new URL("/upgrade?error=payment_failed", BASE_URL));
    }

    await connectDB();

    const { email, metadata } = transaction.customer;
    const plan = transaction.metadata?.plan || metadata?.plan;

    if (!plan) {
      return NextResponse.redirect(new URL("/upgrade?error=verify_failed", BASE_URL));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.redirect(new URL("/upgrade?error=verify_failed", BASE_URL));
    }

    await User.findByIdAndUpdate(user._id, { plan });

    await Subscription.findOneAndUpdate(
      { userId: user._id },
      {
        status: "active",
        plan,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    return NextResponse.redirect(new URL("/dashboard?upgraded=true", BASE_URL));
  } catch (error) {
    console.error("Verify subscription error:", error);
    const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(new URL("/upgrade?error=verify_failed", BASE_URL));
  }
}

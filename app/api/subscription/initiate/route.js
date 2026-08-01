import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import { createCustomer, initializeTransaction } from "@/lib/paystack";

const PLAN_CONFIG = {
  pro: {
    code:   process.env.NEXT_PUBLIC_PRO_PLAN_CODE,
    name:   "Pro",
    amount: 300000, // ₦3,000 in kobo
  },
  agency: {
    code:   process.env.NEXT_PUBLIC_AGENCY_PLAN_CODE,
    name:   "Agency",
    amount: 800000, // ₦8,000 in kobo
  },
};

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!PLAN_CONFIG[plan]) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Already on this plan
    if (user.plan === plan) {
      return Response.json(
        { error: `You are already on the ${plan} plan` },
        { status: 400 }
      );
    }

    // Create Paystack customer if not already created
    let customerCode = user.paystackCustomerCode;
    if (!customerCode) {
      const customer = await createCustomer({
        email: user.email,
        name:  user.name,
      });
      customerCode = customer.customer_code;
      user.paystackCustomerCode = customerCode;
      await user.save();
    }

    // Initialize transaction with plan
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/subscription/verify`;

    const transaction = await initializeTransaction({
      email:       user.email,
      amount:      PLAN_CONFIG[plan].amount,
      plan:        PLAN_CONFIG[plan].code,
      callbackUrl,
      metadata: {
        userId:    user._id.toString(),
        plan,
        userName:  user.name,
      },
    });

    // Create a pending subscription record
    await Subscription.findOneAndUpdate(
      { userId: user._id, status: "pending" },
      {
        userId:               user._id,
        plan,
        status:               "pending",
        paystackCustomerCode: customerCode,
        paystackReference:    transaction.reference,
      },
      { upsert: true, new: true }
    );

    return Response.json({
      success:      true,
      authorizationUrl: transaction.authorization_url,
      reference:    transaction.reference,
    });
  } catch (error) {
    console.error("Subscription initiate error:", error);
    return Response.json(
      { error: error.message ?? "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
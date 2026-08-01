import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // null for OAuth users
    },
    image: {
      type: String,
      default: null,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "agency"],
      default: "free",
    },
    // Paystack customer code e.g. CUS_xxxxxxxxxx
    paystackCustomerCode: {
      type: String,
      default: null,
    },
    // Tracks monthly free sessions
    freeSessionsUsed: {
      type: Number,
      default: 0,
    },
    // Reset every month
    freeSessionsResetAt: {
      type: Date,
      default: () => new Date(),
    },
    emailVerified: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
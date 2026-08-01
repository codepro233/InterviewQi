import mongoose from "mongoose";

// Embedded schema for each Q&A exchange
const ExchangeSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    feedback: {
      score: { type: Number, default: 0 },
      strength: { type: String, default: "" },
      improvement: { type: String, default: "" },
      tip: { type: String, default: "" },
    },
  },
  { _id: false } // no separate _id for embedded docs
);

// Embedded schema for session report
const ReportSchema = new mongoose.Schema(
  {
    overallScore: { type: Number, default: 0 },
    verdict: { type: String, default: "" },
    topStrength: { type: String, default: "" },
    topGrowthArea: { type: String, default: "" },
    readinessLevel: { type: String, default: "" },
    actionPlan: [{ type: String }],
  },
  { _id: false }
);

const InterviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Interview config
    role: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["Entry-level", "Mid-level", "Senior", "Lead / Manager"],
      required: true,
    },
    interviewType: {
      type: String,
      enum: ["behavioral", "technical", "situational"],
      required: true,
    },
    // Progress
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
    totalQuestions: {
      type: Number,
      default: 5,
    },
    currentQuestion: {
      type: Number,
      default: 0,
    },
    // All exchanges
    exchanges: [ExchangeSchema],
    // Final report (populated when status = completed)
    report: ReportSchema,
    // PDF export tracking
    pdfGeneratedAt: {
      type: Date,
      default: null,
    },
    // Duration in seconds
    durationSeconds: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: () => new Date(),
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast user history queries
InterviewSessionSchema.index({ userId: 1, createdAt: -1 });
InterviewSessionSchema.index({ userId: 1, status: 1 });

export default mongoose.models.InterviewSession ||
  mongoose.model("InterviewSession", InterviewSessionSchema);
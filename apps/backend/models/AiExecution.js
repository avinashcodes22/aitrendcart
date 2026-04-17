import mongoose from "mongoose";

const aiExecutionSchema = new mongoose.Schema(
{
  decisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AiDecision",
    required: true
  },

  engine: String,
  action: String,

  status: {
    type: String,
    enum: ["pending", "running", "success", "failed"],
    default: "pending"
  },

  result: String,

  impact: {
    type: Object,
    default: {}
  },

  startedAt: Date,
  completedAt: Date

},
{
  timestamps: true
}
);

export default mongoose.model("AiExecution", aiExecutionSchema);
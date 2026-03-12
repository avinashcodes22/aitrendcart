import mongoose from "mongoose";

const aiActionSchema = new mongoose.Schema({

  type: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "pending"
  },

  payload: {
    type: Object
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

});

export default mongoose.model("AiAction", aiActionSchema);
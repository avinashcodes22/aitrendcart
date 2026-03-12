import mongoose from "mongoose";

const aiDecisionSchema = new mongoose.Schema(
{
  type:{
    type:String,
    required:true
  },

  entity:{
    type:String,
    required:true
  },

  entityId:{
    type:String
  },

  suggestion:{
    type:Object
  },

  reason:{
    type:String
  },

  status:{
    type:String,
    default:"pending"
  },

  /* ===============================
     APPROVAL INFO
  =============================== */

  approvedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  approvedAt:Date,

  rejectedAt:Date,

  /* ===============================
     EXECUTION INFO
  =============================== */

  executed:{
    type:Boolean,
    default:false
  },

  executedAt:Date

},
{
  timestamps:true
}
);

export default mongoose.model(
"AiDecision",
aiDecisionSchema
);
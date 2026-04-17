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

executedAt:Date,

/* ===============================
AI LEARNING PERFORMANCE
=============================== */

performance:{
totalSales:{
type:Number,
default:0
},

orderCount:{
  type:Number,
  default:0
},

successScore:{
  type:Number,
  default:0
},

evaluatedAt:Date

}

},
{
timestamps:true
}
);

export default mongoose.model(
"AiDecision",
aiDecisionSchema
);

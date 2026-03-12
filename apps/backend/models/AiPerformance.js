import mongoose from "mongoose";

const aiPerformanceSchema = new mongoose.Schema(
{
  engine:{
    type:String,
    required:true
  },

  status:{
    type:String,
    default:"success"
  },

  executionTime:{
    type:Number
  },

  error:{
    type:String
  }

},
{
  timestamps:true
}
);

export default mongoose.model(
"AiPerformance",
aiPerformanceSchema
);
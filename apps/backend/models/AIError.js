import mongoose from "mongoose";

const aiErrorSchema = new mongoose.Schema({

  engine:{
    type:String,
    required:true
  },

  message:{
    type:String
  },

  stack:{
    type:String
  },

  severity:{
    type:String,
    default:"error"
  },

  resolved:{
    type:Boolean,
    default:false
  },

  resolvedAt:Date

},{
  timestamps:true
});

export default mongoose.model(
  "AIError",
  aiErrorSchema
);
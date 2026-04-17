import mongoose from "mongoose";

const aiKnowledgeEdgeSchema = new mongoose.Schema({

from:{
type:mongoose.Schema.Types.ObjectId,
ref:"AiKnowledgeNode"
},

to:{
type:mongoose.Schema.Types.ObjectId,
ref:"AiKnowledgeNode"
},

relation:{
type:String
},

weight:{
type:Number,
default:1
}

},{
timestamps:true
});

export default mongoose.model(
"AiKnowledgeEdge",
aiKnowledgeEdgeSchema
);

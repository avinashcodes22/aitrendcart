import mongoose from "mongoose";

const aiKnowledgeNodeSchema = new mongoose.Schema({

type:{
type:String,
required:true
},

entityId:{
type:String
},

label:{
type:String
},

data:{
type:Object
}

},{
timestamps:true
});

export default mongoose.model(
"AiKnowledgeNode",
aiKnowledgeNodeSchema
);

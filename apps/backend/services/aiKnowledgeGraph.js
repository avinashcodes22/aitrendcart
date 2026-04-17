import AiKnowledgeNode from "../models/AiKnowledgeNode.js";
import AiKnowledgeEdge from "../models/AiKnowledgeEdge.js";

/* ===================================
CREATE NODE
=================================== */

export async function createNode(type,label,data={}){

return AiKnowledgeNode.create({
type,
label,
data
});

}

/* ===================================
LINK NODES
=================================== */

export async function linkNodes(from,to,relation){

return AiKnowledgeEdge.create({
from,
to,
relation
});

}

/* ===================================
GET RELATED NODES
=================================== */

export async function getRelated(nodeId){

return AiKnowledgeEdge.find({
from:nodeId
}).populate("to");

}

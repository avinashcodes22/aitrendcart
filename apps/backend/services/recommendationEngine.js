import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* =====================================================
   AI RECOMMENDATION ENGINE
===================================================== */

export async function generateRecommendations(productId){

  /* ======================================
     FIND ORDERS WITH THIS PRODUCT
  ====================================== */

  const orders = await Order.find({
    "items.productId": productId
  });

  const relatedMap = {};

  for(const order of orders){

    for(const item of order.items){

      const id = String(item.productId);

      if(id === String(productId)) continue;

      if(!relatedMap[id]){
        relatedMap[id] = 0;
      }

      relatedMap[id] += item.quantity;

    }

  }

  /* ======================================
     SORT RELATED PRODUCTS
  ====================================== */

  const sorted = Object.entries(relatedMap)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,6);

  const ids = sorted.map(r=>r[0]);

  const products = await Product.find({
    _id:{ $in: ids }
  });

  return products;

}
import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* =====================================================
   AI RECOMMENDATION ENGINE
   Frequently bought together products
===================================================== */

export async function generateRecommendations(productId){

  try{

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
       SORT RELATED PRODUCTS BY SCORE
    ====================================== */

    const sorted = Object.entries(relatedMap)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,6);

    const ids = sorted.map(r=>r[0]);

    if(ids.length === 0){
      return [];
    }

    /* ======================================
       FETCH PRODUCTS
    ====================================== */

    const products = await Product.find({
      _id:{ $in: ids }
    });

    /* ======================================
       RESTORE ORIGINAL ORDER
       (MongoDB does not guarantee order)
    ====================================== */

    const orderedProducts = ids
      .map(id =>
        products.find(p => String(p._id) === id)
      )
      .filter(Boolean);

    return orderedProducts;

  }
  catch(err){

    console.error("Recommendation Engine Error:",err);

    return [];

  }

}
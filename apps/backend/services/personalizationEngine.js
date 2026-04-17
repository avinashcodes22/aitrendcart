import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* =====================================================
   AI PERSONALIZATION ENGINE
===================================================== */

export async function generatePersonalizedFeed(userId, limit = 20) {

  try {

    /* ======================================
       ANALYZE USER PURCHASE HISTORY
    ====================================== */

    const orders = await Order.find({ userId }).select("items");

    const categoryMap = {};

    for (const order of orders) {

      for (const item of order.items) {

        const product = await Product.findById(item.productId);

        if (!product) continue;

        const category = product.category || "misc";

        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }

        categoryMap[category] += item.quantity;

      }

    }

    /* ======================================
       FIND TOP CATEGORY
    ====================================== */

    const sorted = Object.entries(categoryMap)
      .sort((a,b)=>b[1]-a[1]);

    const topCategory = sorted.length
      ? sorted[0][0]
      : null;

    /* ======================================
       PERSONALIZED PRODUCTS
    ====================================== */

    let personalized = [];

    if (topCategory) {

      personalized = await Product.find({
        category: topCategory,
        stock: { $gt: 0 }
      })
      .sort({ arViews: -1 })
      .limit(limit)
      .lean();

    }

    return personalized;

  }
  catch(err){

    console.error(
      "Personalization Engine Error:",
      err
    );

    return [];

  }

}
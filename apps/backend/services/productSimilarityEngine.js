import Product from "../models/Product.js";

/* =====================================================
   PRODUCT SIMILARITY ENGINE
   Finds similar products when purchase data is missing
===================================================== */

export async function findSimilarProducts(productId) {

  try {

    const product = await Product.findById(productId);

    if (!product) {
      return [];
    }

    const category = product.category;
    const price = product.price || 0;

    /* ======================================
       PRICE RANGE (+/- 30%)
    ====================================== */

    const minPrice = price * 0.7;
    const maxPrice = price * 1.3;

    /* ======================================
       FIND SIMILAR PRODUCTS
    ====================================== */

    const candidates = await Product.find({

      _id: { $ne: productId },

      category: category,

      price: {
        $gte: minPrice,
        $lte: maxPrice
      },

      stock: { $gt: 0 }

    })
    .sort({ arViews: -1 })   // popularity signal
    .limit(8)
    .lean();

    return candidates;

  }
  catch(err){

    console.error(
      "Product Similarity Engine Error:",
      err
    );

    return [];

  }

}
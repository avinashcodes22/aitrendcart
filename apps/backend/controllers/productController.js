import {
  fetchProducts,
  fetchProductBySlug,
  createProduct,
  updateProductBySlug,
  deleteProductBySlug,
  toggleARPermission
} from "../services/productService.js";

/* ===============================
   GET ALL PRODUCTS
=============================== */
export const getProducts = async (req, res) => {
  try {
    const { supplier, limit } = req.query;
    const products = await fetchProducts({ supplier, limit });
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/* ===============================
   GET PRODUCT BY SLUG
=============================== */
export const getProductBySlug = async (req, res) => {
  try {
    const product = await fetchProductBySlug(req.params.slug);

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

/* ===============================
   CREATE PRODUCT
=============================== */
export const createNewProduct = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

/* ===============================
   UPDATE PRODUCT
=============================== */
export const updateProduct = async (req, res) => {
  try {
    const product = await updateProductBySlug(
      req.params.slug,
      req.body
    );

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

/* ===============================
   DELETE PRODUCT
=============================== */
export const deleteProduct = async (req, res) => {
  try {
    await deleteProductBySlug(req.params.slug);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

/* ===============================
   TOGGLE AR
=============================== */
export const toggleAR = async (req, res) => {
  try {
    const { isARAllowed } = req.body;

    if (typeof isARAllowed !== "boolean")
      return res.status(400).json({
        error: "isARAllowed must be true or false"
      });

    const product = await toggleARPermission(
      req.params.slug,
      isARAllowed
    );

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("AR toggle error:", err);
    res.status(500).json({ error: "Failed to update AR setting" });
  }
};
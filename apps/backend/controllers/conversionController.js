import { request3DConversion } from "../services/productService.js";

/* ===============================
SECURE AI CONVERSION CONTROLLER
================================ */

export const convertProduct = async (req, res) => {

try {

const { slug } = req.params;

if (!slug) {
  return res.status(400).json({
    error: "Product slug required"
  });
}

const product = await request3DConversion(slug);

if (!product) {
  return res.status(404).json({
    error: "Product not found"
  });
}

return res.json({
  message: "AI conversion started",
  product
});

} catch (err) {

console.error("AI conversion error:", err.message);

return res.status(500).json({
  error: "AI conversion failed"
});

}

};

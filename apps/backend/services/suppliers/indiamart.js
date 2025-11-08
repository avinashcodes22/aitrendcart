import axios from "axios";
import { normalizeProduct } from "../adapter-base.js";

export async function fetchProducts(credentials) {
  const api = "https://mock.indiamart.com/items";
  const res = await axios.get(api);
  return res.data.map((p) => normalizeProduct(p, "indiamart"));
}

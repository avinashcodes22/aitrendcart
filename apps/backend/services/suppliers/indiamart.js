import axios from "axios";
import { normalizeProduct } from "../supplierAdapterBase.js";

export async function fetchProducts(credentials) {
  const api = "https://mock.indiamart.com/items";
  const res = await axios.get(api);
  return res.data.map((p) => normalizeProduct(p, "indiamart"));
}

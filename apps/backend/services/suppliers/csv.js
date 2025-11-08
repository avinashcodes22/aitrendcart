import fs from "fs";
import csv from "csv-parser";
import { normalizeProduct } from "../adapter-base.js";

export async function fetchProducts(credentials) {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(credentials.path)
      .pipe(csv())
      .on("data", (data) => results.push(normalizeProduct(data, "csv")))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

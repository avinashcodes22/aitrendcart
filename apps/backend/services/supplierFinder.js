import SupplierProduct from "../models/SupplierProduct.js";

/* ====================================
   SAMPLE SUPPLIER DATA
==================================== */

const suppliers = [

  {
    supplier:"Alibaba",
    source:"alibaba"
  },

  {
    supplier:"CJ Dropshipping",
    source:"cjdropshipping"
  },

  {
    supplier:"Meesho",
    source:"meesho"
  }

];

/* ====================================
   FIND SUPPLIERS
==================================== */

export async function findSuppliers(productName){

  console.log("🔎 Finding suppliers for:",productName);

  const results = [];

  for(const s of suppliers){

    const price = Math.floor(Math.random()*20)+5;

    const item = await SupplierProduct.create({

      productName,

      supplier:s.supplier,
      source:s.source,

      price,
      moq:50,

      rating:(Math.random()*1+4).toFixed(1),

      shippingDays:Math.floor(Math.random()*10)+5

    });

    results.push(item);

  }

  console.log("📦 Suppliers found:",results.length);

  return results;

}
import express from "express";
import { findSuppliers } from "../services/supplierFinder.js";

const router = express.Router();

/* ====================================
   DEV TEST ROUTE
==================================== */

router.get("/find-suppliers-test",async(req,res)=>{

  const { product } = req.query;

  const suppliers =
    await findSuppliers(product || "LED Sneakers");

  res.json({
    success:true,
    suppliers
  });

});

export default router;
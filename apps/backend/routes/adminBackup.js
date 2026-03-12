import express from "express";
import { runBackup } from "../services/backupService.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ===============================
   ADMIN BACKUP (SECURE)
=============================== */

router.post(
"/backup",
verifyToken,
requireRole("admin"),
(req,res)=>{

  runBackup();

  res.json({
    success:true,
    message:"Backup started"
  });

});

/* ===============================
   TEST BACKUP (DEV ONLY)
=============================== */

router.get("/backup-test",(req,res)=>{

  runBackup();

  res.json({
    success:true,
    message:"Backup started (dev test)"
  });

});

export default router;
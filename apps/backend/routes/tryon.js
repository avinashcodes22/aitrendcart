import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* ===============================
   STORAGE CONFIG
=============================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/tryon";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s/g, "_")
    );
  },
});

const upload = multer({ storage });

/* ===============================
   UPLOAD USER PHOTO
=============================== */
router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      ok: true,
      imageUrl: `http://localhost:5000/${req.file.path.replace(
        "\\",
        "/"
      )}`,
    });
  } catch (err) {
    console.error("TryOn upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;

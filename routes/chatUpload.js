//routes/chatUpload.js

const express = require("express");
const Chat = require("../models/chat");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");


const router = express.Router();

// Multer setup — save temporarily before upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp4|webm|mov/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});

// Upload endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "fake-drug-verification",
      resource_type: "auto", // auto-detect (images, videos, etc.)
    });

    // Safely delete local file after upload
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.warn("⚠️ Could not delete temp file:", err.message);
      }
    }

    // Return file URL
    res.json({
      message: "File uploaded successfully",
      file: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "File upload failed", details: err.message });
  }
});


//Get chat
router.get("/chat/messages/:chat", async (req, res) => {
  try {
    const messages = await Chat.find({ chat: req.params.chat }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;

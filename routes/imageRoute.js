// routes/upload.js
const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const { postImage } = require("../controllers/imageController");

const API_KEY = process.env.API_KEY;

// Route để upload ảnh
router.post(
  "/",
  (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (apiKey !== API_KEY) {
      return res.status(403).send("Forbidden");
    }
    next();
  },
  upload.single("image"),
  postImage
);

/**
 * @swagger
 * /image:
 *   post:
 *     summary: Upload an image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */

module.exports = router;

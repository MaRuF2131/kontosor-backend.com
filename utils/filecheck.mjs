import sharp from "sharp";
import { uploadToCloudinary } from "./CDN/cloudinaryUpload.mjs";

export const fileCheck = (folderName = "uploads") => {
  console.log("fileCheck middleware initialized for folder:", folderName);

  return async (req, res, next) => {
    try {
      let uploadedImages = [];

      // 🔥 Handle Single OR Multiple
      const files = req.files || (req.file ? [req.file] : []);

      if (!files.length) {
        return next();
      }

      for (const file of files) {
        if (!file.mimetype.startsWith("image/")) {
          return res
            .status(400)
            .json({ error: "Only image files are allowed!" });
        }

        let webpBuffer;

        try {
          //  Convert to WebP
          webpBuffer = await sharp(file.buffer)
            .resize({ width: 1200 })
            .webp({ quality: 80 })
            .toBuffer();

          const metadata = await sharp(webpBuffer).metadata();

          if (metadata.format !== "webp") {
            return res
              .status(400)
              .json({ error: "Image conversion to WebP failed" });
          }
        } catch (sharpError) {
          console.error("Sharp conversion failed:", sharpError.message);
          return res
            .status(400)
            .json({ error: "Invalid image format or conversion failed" });
        }

        if (!webpBuffer || webpBuffer.length === 0) {
          return res
            .status(400)
            .json({ error: "Image conversion failed, empty buffer" });
        }

        // ✅ Upload to Cloudinary
        let imageData;
        try {
          imageData = await uploadToCloudinary(webpBuffer, folderName);
        } catch (cloudError) {
          console.error("Cloudinary upload failed:", cloudError.message);
          return res
            .status(500)
            .json({ error: "Image upload to Cloudinary failed" });
        }

        if (!imageData?.secure_url) {
          return res
            .status(500)
            .json({ error: "Image upload failed (no secure URL)" });
        }

        uploadedImages.push({
          secure_url: imageData.secure_url,
          public_id: imageData.public_id,
        });
      }

      // 🔥 Important Part
      if (uploadedImages.length === 1) {
        req.imageData = uploadedImages[0]; // single
      } else {
        req.imageData = uploadedImages; // multiple
      }

      console.log("Images uploaded:", req.imageData);

      next();
    } catch (err) {
      console.error("fileCheck middleware error:", err.message);
      res.status(500).json({
        error: "Something went wrong in fileCheck",
      });
    }
  };
};
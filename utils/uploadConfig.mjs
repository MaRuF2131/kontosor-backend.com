// config/uploadConfig.js
import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 200 * 1024 * 1024, // 🔥 200MB limit (video এর জন্য)
  },

  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (isImage || isVideo) {
      cb(null, true); //  allow
    } else {
      cb(new Error("Only image and video files are allowed!"), false);
    }
  },
});
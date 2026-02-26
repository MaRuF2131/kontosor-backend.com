import { uploadVideoToCloudinary } from "./uploadVideoToCloudinary.mjs";

export const videoCheck = (folderName = "videos") => {
  return async (req, res, next) => {
    try {
      const files = req.files || (req.file ? [req.file] : []);

      if (!files.length) return next();

      let uploadedVideos = [];

      for (const file of files) {
        if (!file.mimetype.startsWith("video/")) {
          return res.status(400).json({
            error: "Only video files are allowed!",
          });
        }

        // Optional: Size limit (100MB example)
        if (file.size > 100 * 1024 * 1024) {
          return res.status(400).json({
            error: "Video size must be under 100MB",
          });
        }

        const videoData = await uploadVideoToCloudinary(
          file.buffer,
          folderName
        );

        uploadedVideos.push({
          secure_url: videoData.secure_url,
          public_id: videoData.public_id,
          duration: videoData.duration,
        });
      }

      if (uploadedVideos.length === 1) {
        req.videoData = uploadedVideos[0];
      } else {
        req.videoData = uploadedVideos;
      }

      next();
    } catch (err) {
      console.error("Video upload error:", err.message);
      res.status(500).json({
        error: "Video upload failed",
      });
    }
  };
};
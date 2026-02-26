import cloudinary from "../CDN/cloudinaryUpload.mjs";


export const uploadVideoToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "video",

        //  Video compression options
        quality: "auto:low",        // auto optimize
        video_codec: "h264",
        bit_rate: "500k",           // bitrate কমালে size কমবে
        format: "mp4"
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};
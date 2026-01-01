import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dbioeeoii",
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
import crypto from "crypto";

async function upload(file: File): Promise<any> {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

  // 1. Generate the signature
  // Note: The string to sign must be alphabetical by key
  const stringToSign = `timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

async function uploadMultiple(files: File[]): Promise<string[]> {
  const results = await Promise.allSettled(files.map((file) => upload(file)));

  const urls = results
    .map((result, index) => {
      if (result.status === "fulfilled" && result.value?.url) {
        return result.value.url;
      } else {
        console.error(`Failed: ${files[index].name}`, result);
        return null;
      }
    })
    .filter((url): url is string => url !== null);

  return urls;
}

async function deleteImage(publicId: string) {
  const deleteResult = await cloudinary.uploader
    .destroy(publicId)
    .catch((error: any) => {
      console.log(error);
    });
  return deleteResult;
}
const Cloudinary = {
  upload,
  uploadMultiple,
  deleteImage,
};
export default Cloudinary;

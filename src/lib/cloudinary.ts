import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an audio buffer to Cloudinary and returns the public URL + public_id.
 * Voice recordings are uploaded as "video" resource type, which is what
 * Cloudinary uses for all audio/video assets.
 */
export async function uploadVoiceRecording(
  buffer: Buffer,
  fileName: string
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // Cloudinary treats audio as "video" resource type
        folder: 'kurdamuz/voices',
        public_id: fileName.replace(/\.[^/.]+$/, ''), // strip extension, Cloudinary adds its own
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    ).end(buffer);
  });
}

/** Deletes a previously-uploaded voice recording from Cloudinary by its public_id. */
export async function deleteVoiceRecording(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
}

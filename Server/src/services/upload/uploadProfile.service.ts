import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../lib/prisma.lib.js";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  ...(process.env.NODE_ENV === "development" && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  }),
});

const BUCKET = process.env.AWS_S3_BUCKET!;

export const uploadProfilePicture = async (data: {
  userId: string;
  fileBuffer: Buffer;
  mimeType: string;
}) => {
  const { userId, fileBuffer, mimeType } = data;

  // Only allow images
  if (!mimeType.startsWith("image/")) {
    throw new Error("Only images allowed for profile picture.");
  }

  // Compress with sharp — WebP, 400x400, 80% quality
  const compressed = await sharp(fileBuffer)
    .resize(400, 400, { fit: "cover", position: "center" })
    .webp({ quality: 80 })
    .toBuffer();

  const key = `profiles/${userId}/${uuidv4()}.webp`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: compressed,
      ContentType: "image/webp",
    }),
  );

  const fileUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  // Save to DB
  await prisma.profile.update({
    where: { user_id: userId },
    data: {
      profile_picture: fileUrl,
      profile_picture_id: key,
    },
  });

  return { fileUrl, key };
};

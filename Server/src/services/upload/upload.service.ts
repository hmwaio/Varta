import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  // },
  ...(process.env.NODE_ENV === "development" && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  }),
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const EXPIRES_IN = 300; // 5 minutes

// ─── Allowed file types ───────────────────────────────────────
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "images",
  "image/png": "images",
  "image/webp": "images",
  "image/gif": "images",
  "video/mp4": "videos",
  "video/webm": "videos",
  "audio/mpeg": "audio",
  "audio/ogg": "audio",
  "audio/webm": "audio",
  "application/pdf": "docs",
  "application/msword": "docs",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docs",
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const generatePresignedUrl = async (data: {
  fileName: string;
  fileType: string;
  fileSize: number;
  folder?: string; // "chat" | "profile"
}) => {
  const { fileName, fileType, fileSize, folder = "chat" } = data;

  // Validate file type
  const category = ALLOWED_TYPES[fileType];
  if (!category) throw new Error("File type not allowed.");

  // Validate file size
  if (fileSize > MAX_FILE_SIZE) throw new Error("File too large. Max 50MB.");

  // Generate unique key
  const ext = fileName.split(".").pop();
  const key = `${folder}/${category}/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
  });

  const presignedUrl = await getSignedUrl(s3, command, {
    expiresIn: EXPIRES_IN,
  });

  return {
    presignedUrl,
    key,
    fileUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};

// ─── Delete file from S3 ──────────────────────────────────────
export const deleteFile = async (key: string) => {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
};

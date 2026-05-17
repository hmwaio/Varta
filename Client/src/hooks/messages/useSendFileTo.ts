import { useState } from "react";
import { uploadAPI } from "../../api/upload.api";
import type { SendFileType } from "../../types/message.type";

export const useSendFileTo = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onFileSend: (
    fileUrl: string,
    fileType: SendFileType,
    fileName: string,
    mimeType: string,
    fileSize: number,
  ) => void,
) => {
  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const sendFileUpload = async (
    file: File,
    type: SendFileType,
  ) => {
    try {
      setUploading(true);
      setOpen(false);

      const result =
        await uploadAPI.sendFileTo(
          file,
          "chat",
          (percent) => {
            setProgress(percent);
          },
        );

      onFileSend(
        result.url,
        type,
        result.name,
        result.type,
        result.size,
      );
    } catch (err: any) {
      alert(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploading,
    progress,
    sendFileUpload,
  };
};
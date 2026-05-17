import apiClient from "./client.api";

export const uploadAPI = {
  // Profile picture upload
  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return apiClient.post("/upload/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Generic upload via presigned URL
  sendFileTo: async (
    file: File,
    folder: "chat" | "profile" = "chat",
    onProgress?: (percent: number) => void
  ) => {
    // ✅ Frontend validation
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File too large (max 50MB)");
    }

    // 1️⃣ Get presigned URL
    const { data } = await apiClient.post("/upload/presigned-url", {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      folder,
    });

    const { presignedUrl, fileUrl, key } = data.data;

    // 2️⃣ Upload directly to S3
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", presignedUrl);

      xhr.setRequestHeader("Content-Type", file.type);

      // ✅ Upload progress
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;

        const percent = Math.round(
          (event.loaded * 100) / event.total
        );

        onProgress?.(percent);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error("S3 upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));

      xhr.send(file);
    });

    // 3️⃣ Return uploaded file data
    return {
      url: fileUrl,
      key,
      type: file.type,
      name: file.name,
      size: file.size,
    };
  },
};
import { useState } from "react";
import { userAPI } from "../../api/profile.api";
import { uploadAPI } from "../../api/upload.api";
import type { MyProfileSafe } from "../../types/profile.type";

export const useProfilePictureUpload = (
  setProfile: React.Dispatch<React.SetStateAction<MyProfileSafe | null>>,
  refetch: () => Promise<void>,
) => {
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const profilePictureUpload = async (file: File) => {
    setUploadingProfile(true);

    try {
      const response = await uploadAPI.uploadProfilePicture(file);

      await userAPI.updateProfile({
        profile_picture: response.data.url,
        profile_picture_id: response.data.public_id,
      });

      // instant UI update (nice UX)
      setProfile((prev: any) => ({
        ...prev,
        profile_picture: response.data.url,
      }));

      refetch();
      alert("Profile picture updated!");
    } catch (error) {
      console.log(error);
      alert("Failed to upload");
    } finally {
      setUploadingProfile(false);
    }
  };

  return { uploadingProfile, profilePictureUpload };
};

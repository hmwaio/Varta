export type Profile = {
  bio: string | null;
  profile_picture: string | null;
  profile_picture_id: string | null;
};

export type MyProfileSafe = {
  user_id: string;
  name: string;
  username: string;
  email: string;
  is_verified: boolean;
  is_deleted: boolean;
  created_at: string;
  profile: Profile;
};

export type User = {
  user_id: string;
  username: string;
  email: string;
  name: string;
  is_deleted?: boolean;
  profile?: {
    bio?: string | null;
    profile_picture?: string | null;
    profile_picture_id?: string | null;
  } | null;
};

export type OtherUser = {
  name: string;
  username: string;
  is_deleted?: boolean;
  profile: { profile_picture: string | null } | null;
};
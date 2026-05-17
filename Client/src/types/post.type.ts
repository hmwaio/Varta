export type FeedPostCardType = {
  post_id: number;
  author: {
    user_id: number;
    name: string;
    profile: {
      profile_picture: string;
    }
  };
  status: string;
  title: string;
  content: string;
  post_picture?: string | null;
  category: string | null;
  tags?: Array<{ name: string }>
  created_at: string;
  _count: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
  isSaved?: boolean;
};

export type CreatePostType = {
  title: string;
  content: string;
  post_picture: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
};
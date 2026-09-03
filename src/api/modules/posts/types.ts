export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags?: string[];
  category?: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  body: string;
  createdAt: string;
}

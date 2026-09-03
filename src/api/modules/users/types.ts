export interface Address {
  street: string;
  city: string;
  zipcode: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  website?: string;
  address?: Address;
}

export interface WorkInfo {
  role: string;
  company: string;
  department?: string;
  experienceYears?: number;
  availableForHire?: boolean;
}

export interface UserStats {
  postsCount: number;
  reviewsCount: number;
  todosCount: number;
  reputation: number;
}

export interface Profile {
  id: number;
  userId: number;
  displayName: string;
  username: string;
  avatar: string;
  headline: string;
  bio: string;
  work?: WorkInfo;
  skills?: string[];
  stats?: UserStats;
}

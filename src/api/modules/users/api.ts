import { api } from '@/api/client';
import { PaginatedResponse, PaginationParams } from '@/api/types';
import { User, Profile } from './types';

export const getUsers = (params?: PaginationParams) =>
  api.get<PaginatedResponse<User>>('users', { params });

export const getUser = (id: number) =>
  api.get<User>(`users/${id}`);

export const getUserProfile = async (userId: number): Promise<Profile | null> => {
  try {
    const res = await api.get<PaginatedResponse<Profile>>('profiles', {
      params: { userId, limit: 1 },
    });
    return res.results[0] ?? null;
  } catch {
    return null;
  }
};

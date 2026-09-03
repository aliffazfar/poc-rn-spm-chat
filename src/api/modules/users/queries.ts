import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getUsers, getUserProfile } from './api';
import { PaginationParams } from '@/api/types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (search?: string) => [...userKeys.lists(), { search: search || '' }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  profile: (userId: number) => [...userKeys.detail(userId), 'profile'] as const,
};

export function useInfiniteUsers(search?: string, limit = 15) {
  return useInfiniteQuery({
    queryKey: userKeys.list(search),
    queryFn: ({ pageParam = 0 }) =>
      getUsers({ limit, offset: pageParam, q: search || undefined }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
  });
}

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: userKeys.list(params?.q),
    queryFn: () => getUsers(params),
  });
}

export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
}

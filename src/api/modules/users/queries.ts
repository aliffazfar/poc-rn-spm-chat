import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getUsers, getUser, getUserProfile } from './api'
import { PaginationParams } from '@/api/types'
import { User } from './types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (search?: string) =>
    [...userKeys.lists(), { search: search || '' }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  profile: (userId: number) => [...userKeys.detail(userId), 'profile'] as const,
}

// instant 0ms lookup from infinite user list cache, falls back to GET users/:id for deep links
export function useUser(id: number) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    initialData: () => {
      const queries = queryClient.getQueriesData<any>({
        queryKey: userKeys.lists(),
      })
      for (const [, data] of queries) {
        const found = data?.pages
          ?.flatMap((p: any) => p.results)
          ?.find((u: User) => u.id === id)
        if (found) return found
      }
      return undefined
    },
    enabled: !!id,
  })
}

export function useInfiniteUsers(search?: string, limit = 15) {
  return useInfiniteQuery({
    queryKey: userKeys.list(search),
    queryFn: ({ pageParam = 0 }) =>
      getUsers({ limit, offset: pageParam, q: search || undefined }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
  })
}

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: userKeys.list(params?.q),
    queryFn: () => getUsers(params),
  })
}

export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  })
}

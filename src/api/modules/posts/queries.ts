import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPostComments, sendComment } from './api';
import { Comment } from './types';

export const postKeys = {
  all: ['posts'] as const,
  comments: (postId: number) => [...postKeys.all, postId, 'comments'] as const,
};

export function useComments(postId: number) {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: () => getPostComments(postId),
    enabled: !!postId,
  });
}

export function useSendComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => sendComment(postId, body),
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(
        postKeys.comments(postId),
        (old = []) => [...old, newComment],
      );
    },
  });
}

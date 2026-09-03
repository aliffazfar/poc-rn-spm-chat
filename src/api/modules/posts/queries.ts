import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPostComments, sendComment } from './api'
import { Comment } from './types'
import { buildEnhancedConversation } from '@/screens/chat/mock'
import { queryClient } from '@/utils/queryClient'

export const postKeys = {
  all: ['posts'] as const,
  comments: (postId: number) => [...postKeys.all, postId, 'comments'] as const,
}

// appends block/unblock system event pills directly to persisted conversation history
export function addSystemMessage(postId: number, body: string) {
  queryClient.setQueryData<Comment[]>(postKeys.comments(postId), (old = []) => [
    ...old,
    {
      id: Date.now(),
      postId,
      userId: 0,
      body,
      createdAt: new Date().toISOString(),
      isSystem: true,
    },
  ])
}

// strictly on-demand fetching when user opens the conversation
export function useComments(postId: number) {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: async () => {
      const data = await getPostComments(postId)
      return buildEnhancedConversation(postId, data)
    },
    enabled: !!postId,
  })
}

export function useSendComment(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: string) => sendComment(postId, body),
    onSuccess: (newComment) => {
      const sentMessage: Comment = {
        ...newComment,
        id: Date.now(),
        isMe: true,
      }
      queryClient.setQueryData<Comment[]>(
        postKeys.comments(postId),
        (old = []) => [...old, sentMessage],
      )
    },
  })
}

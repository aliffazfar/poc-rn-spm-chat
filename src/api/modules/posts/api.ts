import { api } from '@/api/client'
import { Comment } from './types'

export const getPostComments = (postId: number) =>
  api.get<Comment[]>(`posts/${postId}/comments`)

export const sendComment = (postId: number, body: string, userId = 1) =>
  api.post<Comment>(`posts/${postId}/comments`, { body, userId })

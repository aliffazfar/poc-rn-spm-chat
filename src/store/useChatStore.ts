import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from './storage'
import { addSystemMessage } from '@/api'

export type ChatFilter = 'all' | 'unread' | 'group'

interface ChatStore {
  activeFilter: ChatFilter
  setActiveFilter: (filter: ChatFilter) => void
  blockedUserIds: number[]
  blockUser: (userId: number) => void
  unblockUser: (userId: number) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      activeFilter: 'all',
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      blockedUserIds: [],
      blockUser: (userId: number) => {
        set((state) => ({
          blockedUserIds: state.blockedUserIds.includes(userId)
            ? state.blockedUserIds
            : [...state.blockedUserIds, userId],
        }))
        addSystemMessage(userId, 'You blocked this contact.')
      },
      unblockUser: (userId: number) => {
        set((state) => ({
          blockedUserIds: state.blockedUserIds.filter((id) => id !== userId),
        }))
        addSystemMessage(userId, 'You unblocked this contact.')
      },
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
)

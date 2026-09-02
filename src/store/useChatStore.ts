import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/storage';

export type ChatFilter = 'all' | 'unread' | 'group';

interface ChatStore {
  activeFilter: ChatFilter;
  setActiveFilter: (filter: ChatFilter) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      activeFilter: 'all',
      setActiveFilter: (filter) => set({ activeFilter: filter }),
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

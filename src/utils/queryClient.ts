import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { storage } from '@/store'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      gcTime: 1000 * 60 * 60 * 24, // 24 hours persisted in cache
      retry: 2,
    },
  },
})

export const clientPersister = createAsyncStoragePersister({
  storage: {
    setItem: (key, value) => {
      storage.set(key, value)
    },
    getItem: (key) => {
      const value = storage.getString(key)
      return value === undefined ? null : value
    },
    removeItem: (key) => {
      storage.remove(key)
    },
  },
})

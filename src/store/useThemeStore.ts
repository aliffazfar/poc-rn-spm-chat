import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Uniwind } from 'uniwind';
import { zustandStorage } from '@/storage';
import { ThemeMode } from '@/theme';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode: ThemeMode) => {
        Uniwind.setTheme(mode);
        set({ mode });
      },
      toggleTheme: () => {
        const current = get().mode;
        const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
        Uniwind.setTheme(next);
        set({ mode: next });
      },
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.mode) {
          Uniwind.setTheme(state.mode);
        }
      },
    }
  )
);

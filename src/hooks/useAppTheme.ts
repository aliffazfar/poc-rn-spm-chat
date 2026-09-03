import { useUniwind } from 'uniwind'
import { useThemeStore } from '@/store/useThemeStore'
import { colors } from '@/theme'

export function useAppTheme() {
  const { theme } = useUniwind()
  const isDark = theme === 'dark'
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return {
    theme,
    mode,
    isDark,
    colors: colors[isDark ? 'dark' : 'light'],
    setMode,
    toggleTheme,
  }
}

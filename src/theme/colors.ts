import { ThemeColors } from './types'

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceVariant: '#E5E5E5',
  card: '#FFFFFF',
  text: '#171717',
  textMuted: '#737373',
  textSubtle: '#A3A3A3',
  border: '#E5E5E5',
  input: '#F5F5F5',
  primary: '#171717',
  accent: '#10B981',
  danger: '#EF4444',
  chevron: '#C7C7CC',
}

export const darkColors: ThemeColors = {
  background: '#1E1E1E', // Matching splash screen
  surface: '#282828',
  surfaceVariant: '#333333',
  card: '#252525',
  text: '#FFFFFF',
  textMuted: '#A3A3A3',
  textSubtle: '#737373',
  border: '#333333',
  input: '#2A2A2A',
  primary: '#FFFFFF',
  accent: '#10B981',
  danger: '#EF4444',
  chevron: '#525252',
}

export const colors = {
  light: lightColors,
  dark: darkColors,
} as const

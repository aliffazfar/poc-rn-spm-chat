import { ThemeColors } from './types';

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceVariant: '#E5E5E5',
  card: '#FFFFFF',
  text: '#171717',
  textMuted: '#737373',
  border: '#E5E5E5',
  input: '#F5F5F5',
  primary: '#171717',
  accent: '#10B981',
};

export const darkColors: ThemeColors = {
  background: '#1E1E1E', // Matching splash screen
  surface: '#282828',
  surfaceVariant: '#333333',
  card: '#252525',
  text: '#FFFFFF',
  textMuted: '#A3A3A3',
  border: '#333333',
  input: '#2A2A2A',
  primary: '#FFFFFF',
  accent: '#10B981',
};

export const colors = {
  light: lightColors,
  dark: darkColors,
} as const;

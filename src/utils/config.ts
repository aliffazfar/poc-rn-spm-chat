import { API_BASE_URL, APP_NAME, ENABLE_ANIMATIONS, ENVIRONMENT } from '@env';
import { EnvItem } from '@/types';

export const getAppConfig = (): EnvItem[] => [
  { label: 'App Name', value: APP_NAME },
  { label: 'Environment', value: ENVIRONMENT },
  { label: 'API Base URL', value: API_BASE_URL },
  { label: 'Animations', value: ENABLE_ANIMATIONS },
];

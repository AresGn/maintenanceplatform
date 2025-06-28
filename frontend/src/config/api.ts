// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me'
    },
    USERS: '/users',
    EQUIPMENT: '/equipment',
    MAINTENANCE: '/maintenance',
    INVENTORY: '/inventory'
  },
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

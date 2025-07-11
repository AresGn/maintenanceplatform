// Configuration de l'API
const getBaseUrl = () => {
  // En production, utiliser l'URL du backend Railway
  if (import.meta.env.PROD) {
    return 'https://web-production-7357.up.railway.app';
  }
  // En développement, utiliser l'URL locale ou la variable d'environnement
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login-json',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      ME: '/api/auth/me'
    },
    USERS: '/users',
    EQUIPMENT: '/api/equipment',
    MAINTENANCE: '/maintenance',
    INVENTORY: '/inventory',
    DASHBOARD: '/api/dashboard',
    SITES: '/api/sites'
  },
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

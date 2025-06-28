// Utilitaires pour le stockage local
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'maintenance_auth_token',
  USER_DATA: 'maintenance_user_data',
  REFRESH_TOKEN: 'maintenance_refresh_token'
};

export const storage = {
  // Token d'authentification
  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Données utilisateur
  setUserData: (userData: any): void => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  },

  getUserData: (): any | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  removeUserData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Refresh token
  setRefreshToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // Nettoyer tout
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

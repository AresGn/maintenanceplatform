// Service d'authentification
import { apiService } from './api';
import { API_CONFIG } from '../config/api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';
import { storage } from '../utils/storage';

class AuthService {
  // Connexion
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Préparer les données pour l'API FastAPI (form-data)
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await apiService.postFormData<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        formData
      );

      // Stocker le token et les données utilisateur
      if (response.access_token) {
        storage.setToken(response.access_token);
        storage.setUserData(response.user);
      }

      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur de connexion';
      throw new Error(errorMessage);
    }
  }

  // Inscription
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );

      // Stocker le token et les données utilisateur
      if (response.access_token) {
        storage.setToken(response.access_token);
        storage.setUserData(response.user);
      }

      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de l\'inscription';
      throw new Error(errorMessage);
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      // Appeler l'API de déconnexion si nécessaire
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Ignorer les erreurs de déconnexion côté serveur
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      // Nettoyer le stockage local dans tous les cas
      storage.clearAll();
    }
  }

  // Obtenir les informations de l'utilisateur actuel
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>(API_CONFIG.ENDPOINTS.AUTH.ME);
      storage.setUserData(response);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la récupération des données utilisateur';
      throw new Error(errorMessage);
    }
  }

  // Rafraîchir le token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
      }

      const response = await apiService.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken }
      );

      // Mettre à jour le token
      if (response.access_token) {
        storage.setToken(response.access_token);
        storage.setUserData(response.user);
      }

      return response;
    } catch (error: any) {
      // En cas d'erreur, nettoyer le stockage et rediriger vers la connexion
      storage.clearAll();
      throw new Error('Session expirée');
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = storage.getToken();
    const userData = storage.getUserData();
    return !!(token && userData);
  }

  // Obtenir les données utilisateur depuis le stockage
  getCurrentUserFromStorage(): User | null {
    return storage.getUserData();
  }

  // Obtenir le token depuis le stockage
  getTokenFromStorage(): string | null {
    return storage.getToken();
  }
}

export const authService = new AuthService();

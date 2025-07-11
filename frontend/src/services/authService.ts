// Service d'authentification
import { apiService } from './api';
import { API_CONFIG } from '../config/api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';
import { storage } from '../utils/storage';

// Interface pour les données utilisateur du backend (snake_case)
interface BackendUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BackendAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: BackendUser;
}

class AuthService {
  // Transformer les données utilisateur du backend vers le frontend
  private transformUser(backendUser: BackendUser): User {
    return {
      id: backendUser.id,
      username: backendUser.username,
      email: backendUser.email,
      firstName: backendUser.first_name,
      lastName: backendUser.last_name,
      role: backendUser.role as 'admin' | 'supervisor' | 'technician',
      isActive: backendUser.is_active,
      createdAt: backendUser.created_at,
      updatedAt: backendUser.updated_at
    };
  }

  // Transformer la réponse d'authentification
  private transformAuthResponse(backendResponse: BackendAuthResponse): AuthResponse {
    return {
      access_token: backendResponse.access_token,
      token_type: backendResponse.token_type,
      expires_in: backendResponse.expires_in,
      user: this.transformUser(backendResponse.user)
    };
  }
  // Connexion
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Envoyer les données en JSON
      const backendResponse = await apiService.post<BackendAuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Transformer la réponse du backend
      const response = this.transformAuthResponse(backendResponse);

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
      // Transformer les données pour le backend (camelCase vers snake_case)
      const backendUserData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role
      };

      const backendResponse = await apiService.post<BackendAuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        backendUserData
      );

      // Transformer la réponse du backend
      const response = this.transformAuthResponse(backendResponse);

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
      const backendResponse = await apiService.get<BackendUser>(API_CONFIG.ENDPOINTS.AUTH.ME);
      const user = this.transformUser(backendResponse);
      storage.setUserData(user);
      return user;
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

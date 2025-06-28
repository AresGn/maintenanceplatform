// Contexte d'authentification
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, AuthContextType } from '../types/auth';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialiser l'état d'authentification au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = authService.getTokenFromStorage();
        const storedUser = authService.getCurrentUserFromStorage();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          // Optionnel: Vérifier la validité du token avec le serveur
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // Token invalide, nettoyer l'état
            await logout();
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      setToken(response.access_token);
      setUser(response.user);
      
      toast.success(`Bienvenue, ${response.user.firstName} !`);
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      setToken(response.access_token);
      setUser(response.user);
      
      toast.success('Inscription réussie ! Bienvenue sur la plateforme.');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setToken(null);
      setUser(null);
      toast.info('Vous avez été déconnecté.');
    }
  };

  // Calculer l'état d'authentification
  const isAuthenticated = !!(token && user);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

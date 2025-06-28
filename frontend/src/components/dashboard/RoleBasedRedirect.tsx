// Composant de redirection basé sur les rôles
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

export const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Afficher un spinner pendant le chargement
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Rediriger selon le rôle de l'utilisateur
  if (user) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/dashboard/admin" replace />;
      case 'supervisor':
        return <Navigate to="/dashboard/supervisor" replace />;
      case 'technician':
        return <Navigate to="/dashboard/technician" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // Si pas d'utilisateur, rediriger vers login
  return <Navigate to="/login" replace />;
};

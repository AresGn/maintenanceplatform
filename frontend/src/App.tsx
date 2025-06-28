
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ToastContainer } from 'react-toastify';
import frFR from 'antd/locale/fr_FR';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Components
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

// Styles
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ConfigProvider locale={frFR}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Routes publiques */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />

              {/* Routes protégées */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Redirection par défaut */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Route 404 */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Notifications toast */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;

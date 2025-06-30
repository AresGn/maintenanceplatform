

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

import { AdminDashboard, SupervisorDashboard, TechnicianDashboard } from './pages/dashboard';
import { RoleBasedRedirect } from './components/dashboard/RoleBasedRedirect';
import EquipmentListPage from './pages/EquipmentListPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import EquipmentCreatePage from './pages/EquipmentCreatePage';
import EquipmentEditPage from './pages/EquipmentEditPage';
import MaintenanceCalendarPage from './pages/MaintenanceCalendarPage';
import MaintenancePlanningPage from './pages/MaintenancePlanningPage';
import MaintenanceDetailPage from './pages/MaintenanceDetailPage';

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
                    <RoleBasedRedirect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/supervisor"
                element={
                  <ProtectedRoute requiredRoles={['supervisor']}>
                    <SupervisorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/technician"
                element={
                  <ProtectedRoute requiredRoles={['technician']}>
                    <TechnicianDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Routes des équipements */}
              <Route
                path="/equipments"
                element={
                  <ProtectedRoute>
                    <EquipmentListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/equipments/new"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'supervisor']}>
                    <EquipmentCreatePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/equipments/:id"
                element={
                  <ProtectedRoute>
                    <EquipmentDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/equipments/:id/edit"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'supervisor']}>
                    <EquipmentEditPage />
                  </ProtectedRoute>
                }
              />

              {/* Routes de maintenance */}
              <Route
                path="/maintenance/calendar"
                element={
                  <ProtectedRoute>
                    <MaintenanceCalendarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance/planning"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'supervisor']}>
                    <MaintenancePlanningPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance/interventions/:id"
                element={
                  <ProtectedRoute>
                    <MaintenanceDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance/scheduled/:id"
                element={
                  <ProtectedRoute>
                    <MaintenanceDetailPage />
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

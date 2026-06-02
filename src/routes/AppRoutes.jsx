import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ProtectedRoute from './ProtectedRoute';

/**
 * Placeholder for future dashboard routes — wire dashboards here in Phase 2+.
 * Example:
 * <Route path="/tenant" element={<ProtectedRoute><TenantLayout /></ProtectedRoute>} />
 */
const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
    </Route>

    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Future protected routes */}
    <Route
      path="/app"
      element={
        <ProtectedRoute>
          <Navigate to="/" replace />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;

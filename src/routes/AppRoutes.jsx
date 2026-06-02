import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';
import { getDashboardPath } from '../utils/roleRoutes';

import TenantDashboard from '../pages/tenant/TenantDashboard';
import AgentDashboard from '../pages/agent/AgentDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Profile from '../pages/Profile/Profile';
import ModulePlaceholder from '../pages/shared/ModulePlaceholder';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
    </Route>

    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Profile — any authenticated role */}
    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/profile" element={<Profile />} />
    </Route>

    {/* Tenant portal */}
    <Route
      path="/tenant"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['Tenant']}>
            <DashboardLayout />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<TenantDashboard />} />
      <Route path="browse" element={<ModulePlaceholder />} />
      <Route path="requests" element={<ModulePlaceholder />} />
      <Route path="leases" element={<ModulePlaceholder />} />
    </Route>

    {/* Agent portal */}
    <Route
      path="/agent"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['Agent']}>
            <DashboardLayout />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AgentDashboard />} />
      <Route path="properties" element={<ModulePlaceholder />} />
      <Route path="properties/new" element={<ModulePlaceholder />} />
      <Route path="requests" element={<ModulePlaceholder />} />
      <Route path="leases" element={<ModulePlaceholder />} />
    </Route>

    {/* Admin portal */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['Admin']}>
            <DashboardLayout />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<ModulePlaceholder />} />
      <Route path="properties" element={<ModulePlaceholder />} />
      <Route path="requests" element={<ModulePlaceholder />} />
      <Route path="leases" element={<ModulePlaceholder />} />
    </Route>

    {/* Legacy / convenience redirects */}
    <Route path="/app" element={<Navigate to="/" replace />} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export { getDashboardPath };
export default AppRoutes;

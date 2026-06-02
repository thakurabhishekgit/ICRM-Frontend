import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';

import TenantDashboard from '../pages/tenant/TenantDashboard';
import BrowseProperties from '../pages/tenant/BrowseProperties';
import PropertyDetails from '../pages/tenant/PropertyDetails';
import MyRequests from '../pages/tenant/MyRequests';
import MyLeases from '../pages/tenant/MyLeases';

import AgentDashboard from '../pages/agent/AgentDashboard';
import MyProperties from '../pages/agent/MyProperties';
import CreateProperty from '../pages/agent/CreateProperty';
import EditProperty from '../pages/agent/EditProperty';
import AgentLeaseRequests from '../pages/agent/AgentLeaseRequests';
import PropertyRequests from '../pages/agent/PropertyRequests';
import AgentLeases from '../pages/agent/AgentLeases';
import PropertyLeases from '../pages/agent/PropertyLeases';
import CreateLease from '../pages/agent/CreateLease';

import AdminDashboard from '../pages/admin/AdminDashboard';
import Profile from '../pages/Profile/Profile';
import LeaseDetails from '../pages/lease/LeaseDetails';
import ModulePlaceholder from '../pages/shared/ModulePlaceholder';

const dashboardShell = (allowedRoles) => (
  <ProtectedRoute>
    <RoleProtectedRoute allowedRoles={allowedRoles}>
      <DashboardLayout />
    </RoleProtectedRoute>
  </ProtectedRoute>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
    </Route>

    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Property details — any authenticated role */}
    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />
      <Route path="/lease/:id" element={<LeaseDetails />} />
    </Route>

    {/* Tenant + Admin property browsing */}
    <Route element={dashboardShell(['Tenant', 'Admin'])}>
      <Route path="/properties" element={<BrowseProperties />} />
    </Route>

    {/* Tenant portal */}
    <Route path="/tenant" element={dashboardShell(['Tenant'])}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<TenantDashboard />} />
      <Route path="browse" element={<Navigate to="/properties" replace />} />
      <Route path="requests" element={<MyRequests />} />
      <Route path="leases" element={<MyLeases />} />
    </Route>

    {/* Agent portal */}
    <Route path="/agent" element={dashboardShell(['Agent', 'Admin'])}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AgentDashboard />} />
      <Route path="properties" element={<MyProperties />} />
      <Route path="properties/create" element={<CreateProperty />} />
      <Route path="properties/new" element={<Navigate to="create" replace />} />
      <Route path="properties/edit/:id" element={<EditProperty />} />
      <Route path="requests" element={<AgentLeaseRequests />} />
      <Route path="property/:propertyId/requests" element={<PropertyRequests />} />
      <Route path="leases" element={<AgentLeases />} />
      <Route path="property/:propertyId/leases" element={<PropertyLeases />} />
      <Route path="create-lease/:leaseRequestId" element={<CreateLease />} />
    </Route>

    {/* Admin portal */}
    <Route path="/admin" element={dashboardShell(['Admin'])}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<ModulePlaceholder />} />
      <Route path="properties" element={<BrowseProperties />} />
      <Route path="requests" element={<AgentLeaseRequests />} />
      <Route path="leases" element={<AgentLeases />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;

import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';
import GuestRoute, { RootRedirect } from './GuestRoute';

import TenantDashboard from '../pages/tenant/TenantDashboard';
import BrowseProperties from '../pages/tenant/BrowseProperties';
import PropertyDetails from '../pages/tenant/PropertyDetails';
import MyRequests from '../pages/tenant/MyRequests';
import MyLeases from '../pages/tenant/MyLeases';
import TenantRecommendations from '../pages/tenant/TenantRecommendations';

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
import AdminUsers from '../pages/admin/AdminUsers';
import AdminUserDetails from '../pages/admin/AdminUserDetails';
import AdminProperties from '../pages/admin/AdminProperties';
import AdminPropertyDetails from '../pages/admin/AdminPropertyDetails';
import AdminLeaseRequests from '../pages/admin/AdminLeaseRequests';
import AdminLeases from '../pages/admin/AdminLeases';
import AdminAnalytics from '../pages/admin/AdminAnalytics';

import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Settings/Settings';
import LeaseDetails from '../pages/lease/LeaseDetails';

const dashboardShell = (allowedRoles) => (
  <ProtectedRoute>
    <RoleProtectedRoute allowedRoles={allowedRoles}>
      <DashboardLayout />
    </RoleProtectedRoute>
  </ProtectedRoute>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<GuestRoute><MainLayout /></GuestRoute>}>
      <Route path="/" element={<Home />} />
    </Route>

    <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />
      <Route path="/lease/:id" element={<LeaseDetails />} />
    </Route>

    <Route element={dashboardShell(['Tenant', 'Admin'])}>
      <Route path="/properties" element={<BrowseProperties />} />
    </Route>

    <Route path="/tenant" element={dashboardShell(['Tenant'])}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<TenantDashboard />} />
      <Route path="browse" element={<Navigate to="/properties" replace />} />
      <Route path="requests" element={<MyRequests />} />
      <Route path="leases" element={<MyLeases />} />
      <Route path="recommendations" element={<TenantRecommendations />} />
    </Route>

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
      <Route path="analytics" element={<AdminAnalytics />} />
    </Route>

    <Route path="/admin" element={dashboardShell(['Admin'])}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="users/:id" element={<AdminUserDetails />} />
      <Route path="properties" element={<AdminProperties />} />
      <Route path="properties/:id" element={<AdminPropertyDetails />} />
      <Route path="lease-requests" element={<AdminLeaseRequests />} />
      <Route path="requests" element={<Navigate to="/admin/lease-requests" replace />} />
      <Route path="leases" element={<AdminLeases />} />
      <Route path="analytics" element={<AdminAnalytics />} />
    </Route>

    <Route path="*" element={<RootRedirect />} />
  </Routes>
);

export default AppRoutes;

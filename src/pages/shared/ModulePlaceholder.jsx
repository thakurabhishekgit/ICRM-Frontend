import { useLocation } from 'react-router-dom';
import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/EmptyState';
import { getDashboardPath } from '../../utils/roleRoutes';
import useAuth from '../../hooks/useAuth';

const MODULE_COPY = {
  '/tenant/browse': {
    title: 'Browse Properties',
    description: 'Search and explore commercial properties. API integration arrives in Phase 3.',
  },
  '/tenant/requests': {
    title: 'My Requests',
    description: 'Track your lease requests and their approval status.',
  },
  '/tenant/leases': {
    title: 'My Leases',
    description: 'View and manage your active and historical leases.',
  },
  '/agent/properties': {
    title: 'My Properties',
    description: 'Manage your property listings and availability.',
  },
  '/agent/properties/new': {
    title: 'Add Property',
    description: 'Create new commercial property listings for tenants to discover.',
  },
  '/agent/requests': {
    title: 'Lease Requests',
    description: 'Review and process incoming tenant lease requests.',
  },
  '/agent/leases': {
    title: 'Leases',
    description: 'Manage active leases and lease documentation.',
  },
  '/admin/users': {
    title: 'Users',
    description: 'Manage platform users, roles, and access control.',
  },
  '/admin/properties': {
    title: 'Properties',
    description: 'Oversee all properties across the platform.',
  },
  '/admin/requests': {
    title: 'Lease Requests',
    description: 'Monitor and manage all lease requests system-wide.',
  },
  '/admin/leases': {
    title: 'Leases',
    description: 'View and administer all lease agreements.',
  },
};

const ModulePlaceholder = () => {
  const location = useLocation();
  const { user } = useAuth();
  const copy = MODULE_COPY[location.pathname] || {
    title: 'Module',
    description: 'This module will be connected to APIs in Phase 3.',
  };

  return (
    <>
      <PageHeader
        title={copy.title}
        subtitle={copy.description}
        breadcrumbs={[
          { label: 'Dashboard', to: getDashboardPath(user?.role) },
          { label: copy.title },
        ]}
      />
      <EmptyState
        title="Coming in Phase 3"
        description={copy.description}
        actionLabel="Back to Dashboard"
        onAction={() => window.location.assign(getDashboardPath(user?.role))}
      />
    </>
  );
};

export default ModulePlaceholder;

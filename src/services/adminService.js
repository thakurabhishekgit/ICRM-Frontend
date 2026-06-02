import propertyService from '../api/services/propertyService';
import userService from '../api/services/userService';
import leaseRequestService from '../api/services/leaseRequestService';
import leaseService from '../api/services/leaseService';

const dedupeById = (items) => {
  const map = new Map();
  items.forEach((item) => {
    if (item?.id) map.set(item.id, item);
  });
  return [...map.values()];
};

/** Aggregate lease requests across all properties (best available with current API surface). */
export const getAllLeaseRequests = async () => {
  const properties = await propertyService.getAllProperties();
  const batches = await Promise.all(
    properties.map((p) =>
      leaseRequestService.getRequestsByProperty(p.id).catch(() => [])
    )
  );
  const merged = dedupeById(batches.flat());
  if (merged.length > 0) return merged;
  return leaseRequestService.getAgentRequests().catch(() => []);
};

/** Aggregate leases across all properties. */
export const getAllLeases = async () => {
  const properties = await propertyService.getAllProperties();
  const batches = await Promise.all(
    properties.map((p) =>
      leaseService.getLeasesByProperty(p.id).catch(() => [])
    )
  );
  const merged = dedupeById(batches.flat());
  if (merged.length > 0) return merged;
  return leaseService.getAgentLeases().catch(() => []);
};

export const getAdminDashboardStats = async () => {
  const [users, properties, requests, leases] = await Promise.all([
    userService.getAllUsers(),
    propertyService.getAllProperties(),
    getAllLeaseRequests(),
    getAllLeases(),
  ]);

  const countRole = (role) =>
    users.filter((u) => String(u.role).toLowerCase() === role.toLowerCase()).length;

  const countRequestStatus = (status) =>
    requests.filter((r) => String(r.status).toLowerCase() === status.toLowerCase()).length;

  const countLeaseStatus = (status) =>
    leases.filter((l) => String(l.status).toLowerCase() === status.toLowerCase()).length;

  return {
    totalUsers: users.length,
    totalTenants: countRole('Tenant'),
    totalAgents: countRole('Agent'),
    totalProperties: properties.length,
    totalLeaseRequests: requests.length,
    approvedRequests: countRequestStatus('Approved'),
    rejectedRequests: countRequestStatus('Rejected'),
    pendingRequests: countRequestStatus('Pending'),
    totalLeases: leases.length,
    activeLeases: countLeaseStatus('Active'),
    expiredLeases: countLeaseStatus('Expired'),
    users,
    properties,
    requests,
    leases,
  };
};

export const getUserActivityStats = async (user) => {
  const role = String(user.role).toLowerCase();
  const [requests, leases, properties] = await Promise.all([
    getAllLeaseRequests(),
    getAllLeases(),
    propertyService.getAllProperties(),
  ]);

  if (role === 'tenant') {
    const tenantRequests = requests.filter((r) => r.tenant?.id === user.id);
    const tenantLeases = leases.filter((l) => l.tenant?.id === user.id);
    return {
      totalRequests: tenantRequests.length,
      activeLeases: tenantLeases.filter((l) => String(l.status).toLowerCase() === 'active').length,
    };
  }

  if (role === 'agent') {
    const agentProperties = properties.filter((p) => p.agent?.id === user.id);
    const agentRequests = requests.filter((r) => r.agent?.id === user.id);
    const agentLeases = leases.filter((l) => l.agent?.id === user.id);
    return {
      totalProperties: agentProperties.length,
      totalLeaseRequests: agentRequests.length,
      activeLeases: agentLeases.filter((l) => String(l.status).toLowerCase() === 'active').length,
    };
  }

  return {};
};

export default {
  getAllLeaseRequests,
  getAllLeases,
  getAdminDashboardStats,
  getUserActivityStats,
};

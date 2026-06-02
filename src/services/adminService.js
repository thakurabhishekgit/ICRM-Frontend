import propertyService from '../api/services/propertyService';
import userService from '../api/services/userService';
import leaseRequestService from '../api/services/leaseRequestService';
import leaseService from '../api/services/leaseService';
import { normalizeLeaseStatus, normalizeRequestStatus } from '../utils/formatters';

const dedupeById = (items) => {
  const map = new Map();
  items.forEach((item) => {
    if (item?.id) map.set(item.id, item);
  });
  return [...map.values()];
};

/** All lease requests — admin/agent endpoints return full data for Admin role. */
export const getAllLeaseRequests = async () => {
  try {
    return await leaseRequestService.getAgentRequests();
  } catch {
    const properties = await propertyService.getAllProperties();
    const batches = await Promise.all(
      properties.map((p) =>
        leaseRequestService.getRequestsByProperty(p.id).catch(() => [])
      )
    );
    return dedupeById(batches.flat());
  }
};

/** All leases — admin/agent endpoints return full data for Admin role. */
export const getAllLeases = async () => {
  try {
    return await leaseService.getAgentLeases();
  } catch {
    const properties = await propertyService.getAllProperties();
    const batches = await Promise.all(
      properties.map((p) =>
        leaseService.getLeasesByProperty(p.id).catch(() => [])
      )
    );
    return dedupeById(batches.flat());
  }
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
    requests.filter((r) => normalizeRequestStatus(r.status) === status).length;

  const countLeaseStatus = (status) =>
    leases.filter((l) => normalizeLeaseStatus(l.status) === status).length;

  return {
    totalUsers: users.length,
    totalTenants: countRole('Tenant'),
    totalAgents: countRole('Agent'),
    totalProperties: properties.length,
    totalLeaseRequests: requests.length,
    approvedRequests: countRequestStatus('approved'),
    rejectedRequests: countRequestStatus('rejected'),
    pendingRequests: countRequestStatus('pending'),
    totalLeases: leases.length,
    pendingLeases: countLeaseStatus('pending'),
    activeLeases: countLeaseStatus('active'),
    expiredLeases: countLeaseStatus('expired'),
    terminatedLeases: countLeaseStatus('terminated'),
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
      activeLeases: tenantLeases.filter((l) => normalizeLeaseStatus(l.status) === 'active').length,
    };
  }

  if (role === 'agent') {
    const agentProperties = properties.filter((p) => p.agent?.id === user.id);
    const agentRequests = requests.filter((r) => r.agent?.id === user.id);
    const agentLeases = leases.filter((l) => l.agent?.id === user.id);
    return {
      totalProperties: agentProperties.length,
      totalLeaseRequests: agentRequests.length,
      activeLeases: agentLeases.filter((l) => normalizeLeaseStatus(l.status) === 'active').length,
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

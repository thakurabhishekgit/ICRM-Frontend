export const ROLES = {
  TENANT: 'Tenant',
  AGENT: 'Agent',
  ADMIN: 'Admin',
};

export const normalizeRole = (role) => String(role ?? '').trim().toLowerCase();

export const getDashboardPath = (role) => {
  const r = normalizeRole(role);
  if (r === 'admin') return '/admin/dashboard';
  if (r === 'agent') return '/agent/dashboard';
  return '/tenant/dashboard';
};

export const getRoleBasePath = (role) => {
  const r = normalizeRole(role);
  if (r === 'admin') return '/admin';
  if (r === 'agent') return '/agent';
  return '/tenant';
};

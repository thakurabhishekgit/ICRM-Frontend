export const tenantDashboardData = {
  stats: {
    totalRequests: 12,
    approvedRequests: 7,
    rejectedRequests: 2,
    activeLeases: 3,
  },
  recentActivity: [
    { id: '1', property: 'Harbor View Office Park', action: 'Lease request submitted', date: '2026-05-28', status: 'Pending' },
    { id: '2', property: 'Metro Business Center', action: 'Lease request approved', date: '2026-05-22', status: 'Approved' },
    { id: '3', property: 'Skyline Tower Suite 420', action: 'Lease activated', date: '2026-05-15', status: 'Active' },
    { id: '4', property: 'Riverside Commerce Hub', action: 'Lease request rejected', date: '2026-05-10', status: 'Rejected' },
    { id: '5', property: 'Central Plaza Retail', action: 'Lease request submitted', date: '2026-05-05', status: 'Pending' },
  ],
};

export const agentDashboardData = {
  stats: {
    totalProperties: 24,
    pendingRequests: 8,
    activeLeases: 16,
    monthlyRevenue: 284500,
  },
  revenueOverview: [
    { month: 'Jan', amount: 198000 },
    { month: 'Feb', amount: 212000 },
    { month: 'Mar', amount: 225000 },
    { month: 'Apr', amount: 241000 },
    { month: 'May', amount: 268000 },
    { month: 'Jun', amount: 284500 },
  ],
  occupancyOverview: [
    { property: 'Harbor View', rate: 92 },
    { property: 'Metro Center', rate: 88 },
    { property: 'Skyline Tower', rate: 76 },
    { property: 'Riverside Hub', rate: 95 },
  ],
};

export const adminDashboardData = {
  stats: {
    totalUsers: 156,
    totalProperties: 89,
    totalLeaseRequests: 234,
    totalLeases: 67,
  },
  usersOverview: [
    { id: '1', name: 'Abhishek Singh', email: 'abhishek@gmail.com', role: 'Tenant', status: 'Active' },
    { id: '2', name: 'Maria Lopez', email: 'maria@ircm.com', role: 'Agent', status: 'Active' },
    { id: '3', name: 'James Chen', email: 'james@ircm.com', role: 'Admin', status: 'Active' },
    { id: '4', name: 'Priya Sharma', email: 'priya@gmail.com', role: 'Tenant', status: 'Active' },
  ],
  propertiesOverview: [
    { id: '1', title: 'Harbor View Office Park', location: 'San Francisco, CA', agent: 'Maria Lopez', status: 'Available' },
    { id: '2', title: 'Metro Business Center', location: 'Austin, TX', agent: 'Maria Lopez', status: 'Leased' },
    { id: '3', title: 'Skyline Tower', location: 'Seattle, WA', agent: 'David Kim', status: 'Available' },
  ],
  requestsOverview: [
    { id: '1', tenant: 'Abhishek Singh', property: 'Harbor View', submitted: '2026-05-28', status: 'Pending' },
    { id: '2', tenant: 'Priya Sharma', property: 'Central Plaza', submitted: '2026-05-27', status: 'Approved' },
    { id: '3', tenant: 'John Miller', property: 'Riverside Hub', submitted: '2026-05-26', status: 'Pending' },
  ],
};

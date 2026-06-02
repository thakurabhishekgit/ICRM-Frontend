import { useState, useEffect } from 'react';
import { Box, Alert, Paper, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArticleIcon from '@mui/icons-material/Article';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/Loader';
import ActivityTimeline from '../../components/enterprise/ActivityTimeline';
import ChartCard from '../../components/enterprise/ChartCard';
import {
  RevenueTrendChart, LeaseStatusChart, OccupancyChart, UserDistributionChart,
} from '../../components/enterprise/AdminCharts';
import { getAdminDashboardStats } from '../../services/adminService';
import { buildPlatformActivity } from '../../services/activityService';
import { colors } from '../../theme/theme';

const MOCK_REVENUE = [
  { month: 'Jan', revenue: 1200000 },
  { month: 'Feb', revenue: 1450000 },
  { month: 'Mar', revenue: 1380000 },
  { month: 'Apr', revenue: 1620000 },
  { month: 'May', revenue: 1780000 },
  { month: 'Jun', revenue: 1950000 },
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminDashboardStats()
      .then((data) => {
        setStats(data);
        setActivity(buildPlatformActivity(data));
      })
      .catch(() => setError('Failed to load dashboard metrics from API.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading admin dashboard..." fullScreen />;
  if (!stats) return <Alert severity="error">{error}</Alert>;

  const leaseStatusData = [
    { name: 'Pending', value: stats.pendingLeases || 0 },
    { name: 'Active', value: stats.activeLeases || 0 },
    { name: 'Expired', value: stats.expiredLeases || 0 },
    { name: 'Terminated', value: stats.terminatedLeases || 0 },
  ].filter((d) => d.value > 0);

  const occupancyData = stats.properties.slice(0, 5).map((p) => ({
    name: p.title?.slice(0, 14) || 'Property',
    occupancy: p.totalUnits ? Math.round((p.occupiedUnits / p.totalUnits) * 100) : 0,
  }));

  const userDist = [
    { role: 'Tenants', count: stats.totalTenants },
    { role: 'Agents', count: stats.totalAgents },
    { role: 'Admins', count: stats.totalUsers - stats.totalTenants - stats.totalAgents },
  ];

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Complete system visibility and platform health overview." />
      {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2, mb: 4 }}>
        <StatCard title="Total Users" value={stats.totalUsers} icon={PeopleIcon} />
        <StatCard title="Tenants" value={stats.totalTenants} icon={PersonIcon} accent="#22c55e" />
        <StatCard title="Agents" value={stats.totalAgents} icon={SupportAgentIcon} accent="#8b5cf6" />
        <StatCard title="Properties" value={stats.totalProperties} icon={HomeWorkIcon} accent="#f59e0b" />
        <StatCard title="Lease Requests" value={stats.totalLeaseRequests} icon={ListAltIcon} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        <StatCard title="Approved" value={stats.approvedRequests} icon={CheckCircleIcon} accent="#22c55e" />
        <StatCard title="Rejected" value={stats.rejectedRequests} icon={CancelIcon} accent="#ef4444" />
        <StatCard title="Active Leases" value={stats.activeLeases} icon={ArticleIcon} accent="#3b82f6" />
        <StatCard title="Expired Leases" value={stats.expiredLeases} icon={ArticleIcon} accent="#64748b" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 3 }}>
        <ChartCard title="Revenue Trend" subtitle="Mock data — API integration later">
          <RevenueTrendChart data={MOCK_REVENUE} />
        </ChartCard>
        <ChartCard title="Lease Status Distribution" subtitle="From live lease data">
          <LeaseStatusChart data={leaseStatusData.length ? leaseStatusData : [{ name: 'No Data', value: 1 }]} />
        </ChartCard>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
        <ChartCard title="Property Occupancy" subtitle="Top properties by occupancy">
          <OccupancyChart data={occupancyData.length ? occupancyData : [{ name: 'N/A', occupancy: 0 }]} />
        </ChartCard>
        <ChartCard title="User Distribution">
          <UserDistributionChart data={userDist} />
        </ChartCard>
        <Paper sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>System Summary</Typography>
          {[
            ['Pending Requests', stats.pendingRequests],
            ['Total Leases', stats.totalLeases],
            ['Portfolio Size', stats.totalProperties],
            ['Platform Users', stats.totalUsers],
          ].map(([label, val]) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25, borderBottom: `1px solid ${colors.border}` }}>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>{label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{val}</Typography>
            </Box>
          ))}
        </Paper>
      </Box>

      <ActivityTimeline items={activity} emptyMessage="Platform activity will appear here as users, properties, and leases are created." />
    </>
  );
};

export default AdminDashboard;

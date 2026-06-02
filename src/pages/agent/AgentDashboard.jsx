import { useState, useEffect } from 'react';
import { Box, Alert } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArticleIcon from '@mui/icons-material/Article';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/Loader';
import propertyService from '../../api/services/propertyService';
import leaseRequestService from '../../api/services/leaseRequestService';
import leaseService from '../../api/services/leaseService';
import { formatCurrency } from '../../utils/formatters';
import { colors } from '../../theme/theme';

const AgentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ properties: 0, pending: 0, leases: 0, revenue: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      propertyService.getMyProperties(),
      leaseRequestService.getAgentRequests(),
      leaseService.getAgentLeases(),
    ])
      .then(([properties, requests, leases]) => {
        const pending = requests.filter((r) => String(r.status).toLowerCase() === 'pending').length;
        const revenue = properties.reduce((sum, p) => sum + (parseFloat(p.monthlyRevenue) || 0), 0);
        setStats({ properties: properties.length, pending, leases: leases.length, revenue });
        setRevenueData(properties.slice(0, 6).map((p) => ({ label: p.title?.slice(0, 12), amount: parseFloat(p.monthlyRevenue) || 0 })));
        setOccupancyData(
          properties.slice(0, 4).map((p) => ({
            property: p.title?.slice(0, 20) || 'Property',
            rate: p.totalUnits ? Math.round((p.occupiedUnits / p.totalUnits) * 100) : 0,
          }))
        );
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading dashboard..." />;

  const maxRevenue = Math.max(...revenueData.map((r) => r.amount), 1);

  return (
    <>
      <PageHeader title="Agent Dashboard" subtitle="Portfolio performance and lease pipeline." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <StatCard title="Total Properties" value={stats.properties} icon={HomeWorkIcon} accent="#3b82f6" />
        <StatCard title="Pending Requests" value={stats.pending} icon={PendingActionsIcon} accent="#f59e0b" />
        <StatCard title="Active Leases" value={stats.leases} icon={ArticleIcon} accent="#22c55e" />
        <StatCard title="Monthly Revenue" value={formatCurrency(stats.revenue)} icon={AttachMoneyIcon} accent="#8b5cf6" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' }, gap: 3 }}>
        <Box sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
          <Box component="span" sx={{ fontWeight: 700, display: 'block', mb: 3 }}>Revenue Overview</Box>
          {revenueData.length === 0 ? (
            <Box sx={{ color: colors.textSecondary }}>No property revenue data.</Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 200 }}>
              {revenueData.map((item) => (
                <Box key={item.label} sx={{ flex: 1, textAlign: 'center' }}>
                  <Box sx={{ height: `${(item.amount / maxRevenue) * 160}px`, minHeight: 8, borderRadius: '8px 8px 0 0', bgcolor: colors.primary, mb: 1 }} />
                  <Box component="span" sx={{ fontSize: '0.65rem', color: colors.textSecondary, display: 'block' }}>{item.label}</Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
          <Box component="span" sx={{ fontWeight: 700, display: 'block', mb: 3 }}>Occupancy Overview</Box>
          {occupancyData.map((item) => (
            <Box key={item.property} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Box component="span" sx={{ fontSize: '0.875rem' }}>{item.property}</Box>
                <Box component="span" sx={{ fontWeight: 700, color: colors.primaryLight }}>{item.rate}%</Box>
              </Box>
              <Box sx={{ height: 8, borderRadius: 4, bgcolor: colors.border }}>
                <Box sx={{ height: '100%', width: `${item.rate}%`, borderRadius: 4, bgcolor: colors.primary }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default AgentDashboard;

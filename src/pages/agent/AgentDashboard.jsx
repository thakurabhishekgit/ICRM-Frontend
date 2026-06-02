import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  alpha,
} from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArticleIcon from '@mui/icons-material/Article';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import { agentDashboardData } from '../../data/dummyDashboardData';
import { colors } from '../../theme/theme';

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const AgentDashboard = () => {
  const { stats, revenueOverview, occupancyOverview } = agentDashboardData;
  const maxRevenue = Math.max(...revenueOverview.map((r) => r.amount));

  return (
    <>
      <PageHeader
        title="Agent Dashboard"
        subtitle="Portfolio performance, lease pipeline, and revenue at a glance."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard title="Total Properties" value={stats.totalProperties} icon={HomeWorkIcon} accent="#3b82f6" />
        <StatCard title="Pending Requests" value={stats.pendingRequests} icon={PendingActionsIcon} accent="#f59e0b" />
        <StatCard title="Active Leases" value={stats.activeLeases} icon={ArticleIcon} accent="#22c55e" />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={AttachMoneyIcon}
          accent="#8b5cf6"
          trend="+12.4% vs last month"
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
          gap: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Revenue Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 220 }}>
            {revenueOverview.map((item) => (
              <Box key={item.month} sx={{ flex: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    height: `${(item.amount / maxRevenue) * 180}px`,
                    minHeight: 8,
                    borderRadius: '8px 8px 0 0',
                    background: `linear-gradient(180deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`,
                    mb: 1,
                    transition: 'height 0.3s ease',
                  }}
                />
                <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block' }}>
                  {item.month}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                  {(item.amount / 1000).toFixed(0)}k
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Occupancy Overview
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {occupancyOverview.map((item) => (
              <Box key={item.property}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                    {item.property}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.primaryLight, fontWeight: 700 }}>
                    {item.rate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.rate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(colors.border, 0.8),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default AgentDashboard;

import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArticleIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import { tenantDashboardData } from '../../data/dummyDashboardData';
import { colors } from '../../theme/theme';

const statusColor = (status) => {
  const s = status.toLowerCase();
  if (s === 'approved' || s === 'active') return 'success';
  if (s === 'rejected') return 'error';
  return 'warning';
};

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { stats, recentActivity } = tenantDashboardData;

  return (
    <>
      <PageHeader
        title="Tenant Dashboard"
        subtitle="Overview of your lease requests, approvals, and active leases."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard title="Total Requests" value={stats.totalRequests} icon={ListAltIcon} accent="#3b82f6" />
        <StatCard title="Approved Requests" value={stats.approvedRequests} icon={CheckCircleIcon} accent="#22c55e" />
        <StatCard title="Rejected Requests" value={stats.rejectedRequests} icon={CancelIcon} accent="#ef4444" />
        <StatCard title="Active Leases" value={stats.activeLeases} icon={ArticleIcon} accent="#8b5cf6" />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            bgcolor: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3, borderBottom: `1px solid ${colors.border}` }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Activity
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, borderColor: colors.border }}>
                    Property
                  </TableCell>
                  <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, borderColor: colors.border }}>
                    Action
                  </TableCell>
                  <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, borderColor: colors.border }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, borderColor: colors.border }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivity.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ color: colors.textPrimary, borderColor: colors.border }}>
                      {row.property}
                    </TableCell>
                    <TableCell sx={{ color: colors.textSecondary, borderColor: colors.border }}>
                      {row.action}
                    </TableCell>
                    <TableCell sx={{ color: colors.textSecondary, borderColor: colors.border }}>
                      {row.date}
                    </TableCell>
                    <TableCell sx={{ borderColor: colors.border }}>
                      <Chip label={row.status} size="small" color={statusColor(row.status)} variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/tenant/browse')}
              fullWidth
            >
              Browse Properties
            </Button>
            <Button
              variant="outlined"
              startIcon={<ListAltIcon />}
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/tenant/requests')}
              fullWidth
            >
              View Requests
            </Button>
          </Box>
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(colors.primary, 0.08),
              border: `1px solid ${alpha(colors.primary, 0.2)}`,
            }}
          >
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              Phase 3 will connect live lease request and property APIs to this dashboard.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default TenantDashboard;

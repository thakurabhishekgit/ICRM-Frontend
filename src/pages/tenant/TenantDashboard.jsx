import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Alert } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArticleIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/Loader';
import leaseRequestService from '../../api/services/leaseRequestService';
import leaseService from '../../api/services/leaseService';
import { formatDate, getLeaseRequestStatusProps } from '../../utils/formatters';
import { colors } from '../../theme/theme';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [leases, setLeases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([leaseRequestService.getMyRequests(), leaseService.getMyLeases()])
      .then(([reqs, les]) => {
        setRequests(reqs);
        setLeases(les);
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading dashboard..." />;

  const approved = requests.filter((r) => String(r.status).toLowerCase() === 'approved').length;
  const rejected = requests.filter((r) => String(r.status).toLowerCase() === 'rejected').length;
  const activeLeases = leases.filter((l) => String(l.status).toLowerCase() === 'active').length;
  const recent = requests.slice(0, 5);

  return (
    <>
      <PageHeader title="Tenant Dashboard" subtitle="Overview of your lease requests and active leases." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <StatCard title="Total Requests" value={requests.length} icon={ListAltIcon} accent="#3b82f6" />
        <StatCard title="Approved Requests" value={approved} icon={CheckCircleIcon} accent="#22c55e" />
        <StatCard title="Rejected Requests" value={rejected} icon={CancelIcon} accent="#ef4444" />
        <StatCard title="Active Leases" value={activeLeases} icon={ArticleIcon} accent="#8b5cf6" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        <Paper sx={{ bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, borderBottom: `1px solid ${colors.border}` }}>
            <Box component="span" sx={{ fontWeight: 700 }}>Recent Activity</Box>
          </Box>
          {recent.length === 0 ? (
            <Box sx={{ p: 3, color: colors.textSecondary }}>No recent activity.</Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Property', 'Date', 'Status'].map((h) => (
                    <TableCell key={h} sx={{ color: colors.textSecondary, borderColor: colors.border }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {recent.map((row) => {
                  const s = getLeaseRequestStatusProps(row.status);
                  return (
                    <TableRow key={row.id}>
                      <TableCell sx={{ borderColor: colors.border }}>{row.property?.title}</TableCell>
                      <TableCell sx={{ borderColor: colors.border, color: colors.textSecondary }}>{formatDate(row.requestedAt)}</TableCell>
                      <TableCell sx={{ borderColor: colors.border }}><Chip label={s.label} color={s.color} size="small" variant="outlined" /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Paper>

        <Paper sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
          <Box component="span" sx={{ fontWeight: 700, display: 'block', mb: 2 }}>Quick Actions</Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="contained" startIcon={<SearchIcon />} endIcon={<ArrowForwardIcon />} onClick={() => navigate('/properties')}>Browse Properties</Button>
            <Button variant="outlined" startIcon={<ListAltIcon />} endIcon={<ArrowForwardIcon />} onClick={() => navigate('/tenant/requests')}>View Requests</Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default TenantDashboard;

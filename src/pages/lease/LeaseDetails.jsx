import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Chip, Button, Alert, Divider, Skeleton, alpha,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import PageHeader from '../../components/dashboard/PageHeader';
import leaseService from '../../api/services/leaseService';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate, getLeaseStatusProps, isLeasePending, isLeaseActive } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { normalizeRole } from '../../utils/roleRoutes';
import { colors } from '../../theme/theme';

const LeaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const role = normalizeRole(user?.role);
  const canManage = role === 'agent' || role === 'admin';

  const [loading, setLoading] = useState(true);
  const [lease, setLease] = useState(null);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState({ open: false, action: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLease = async () => {
    try {
      const data = await leaseService.getLeaseById(id);
      setLease(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLease(); }, [id]);

  const handleAction = async () => {
    setActionLoading(true);
    try {
      if (dialog.action === 'activate') await leaseService.activateLease(id);
      if (dialog.action === 'expire') await leaseService.expireLease(id);
      if (dialog.action === 'terminate') await leaseService.terminateLease(id);
      showToast(`Lease ${dialog.action}d successfully`);
      setDialog({ open: false, action: '' });
      fetchLease();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Skeleton variant="rounded" height={400} />;
  if (error || !lease) return <Alert severity="error">{error || 'Lease not found.'}</Alert>;

  const statusProps = getLeaseStatusProps(lease.status);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <PageHeader title="Lease Details" subtitle={lease.property?.title} />

      <Paper sx={{ p: 4, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
        <Chip label={statusProps.label} color={statusProps.color} sx={{ mb: 3 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
          {[
            ['Property', lease.property?.title],
            ['Location', lease.property?.location],
            ['Tenant', lease.tenant?.fullName],
            ['Agent', lease.agent?.fullName],
            ['Monthly Rent', formatCurrency(lease.monthlyRent)],
            ['Security Deposit', formatCurrency(lease.securityDeposit)],
            ['Start Date', formatDate(lease.startDate)],
            ['End Date', formatDate(lease.endDate)],
          ].map(([label, value]) => (
            <Box key={label} sx={{ p: 2, borderRadius: 2, bgcolor: alpha(colors.surface, 0.6), border: `1px solid ${colors.border}` }}>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>{label}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{value || '—'}</Typography>
            </Box>
          ))}
        </Box>

        {canManage && (
          <>
            <Divider sx={{ my: 3, borderColor: colors.border }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {isLeasePending(lease.status) && (
                <Button variant="contained" color="success" onClick={() => setDialog({ open: true, action: 'activate' })}>Activate</Button>
              )}
              {isLeaseActive(lease.status) && (
                <>
                  <Button variant="outlined" onClick={() => setDialog({ open: true, action: 'expire' })}>Expire</Button>
                  <Button variant="outlined" color="error" onClick={() => setDialog({ open: true, action: 'terminate' })}>Terminate</Button>
                </>
              )}
            </Box>
          </>
        )}
      </Paper>

      <ConfirmationDialog
        open={dialog.open}
        title={`${dialog.action?.charAt(0).toUpperCase()}${dialog.action?.slice(1)} Lease?`}
        message="Confirm this lease status change."
        confirmColor={dialog.action === 'terminate' ? 'error' : 'primary'}
        loading={actionLoading}
        onConfirm={handleAction}
        onClose={() => !actionLoading && setDialog({ open: false, action: '' })}
      />
    </Box>
  );
};

export default LeaseDetails;

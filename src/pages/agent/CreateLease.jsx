import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, TextField, Button, Alert, Box, Grid, alpha } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../../components/dashboard/PageHeader';
import Loader from '../../components/Loader';
import leaseRequestService from '../../api/services/leaseRequestService';
import leaseService from '../../api/services/leaseService';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { colors } from '../../theme/theme';

const CreateLease = () => {
  const { leaseRequestId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [request, setRequest] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [formData, setFormData] = useState({ monthlyRent: '', securityDeposit: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    leaseRequestService
      .getAgentRequests()
      .then((requests) => {
        const found = requests.find((r) => String(r.id) === String(leaseRequestId));
        setRequest(found || null);
        const today = new Date().toISOString().substring(0, 10);
        const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().substring(0, 10);
        setFormData((f) => ({ ...f, startDate: today, endDate: nextYear, monthlyRent: found?.property?.price ? String(found.property.price) : '' }));
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoadingRequest(false));
  }, [leaseRequestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request) return;
    setLoading(true);
    setError('');
    try {
      await leaseService.createLease({
        propertyId: request.property.id,
        tenantId: request.tenant.id,
        leaseRequestId: request.id,
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      showToast('Lease created successfully');
      navigate('/agent/leases');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loadingRequest) return <Loader message="Loading request details..." />;
  if (!request) return <Alert severity="error">Approved lease request not found.</Alert>;

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/requests')} sx={{ mb: 2 }}>Back</Button>
      <PageHeader title="Create Lease" subtitle="Draft a lease from an approved request." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Paper sx={{ p: 4, maxWidth: 640, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: alpha(colors.surface, 0.6), border: `1px solid ${colors.border}` }}>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>Property</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>{request.property?.title}</Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>Tenant</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>{request.tenant?.fullName}</Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField required fullWidth label="Monthly Rent" name="monthlyRent" type="number" value={formData.monthlyRent} onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })} disabled={loading} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField required fullWidth label="Security Deposit" name="securityDeposit" type="number" value={formData.securityDeposit} onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })} disabled={loading} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField required fullWidth label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} InputLabelProps={{ shrink: true }} disabled={loading} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField required fullWidth label="End Date" name="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} InputLabelProps={{ shrink: true }} disabled={loading} />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => navigate('/agent/requests')} disabled={loading}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Creating...' : 'Create Lease'}</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default CreateLease;

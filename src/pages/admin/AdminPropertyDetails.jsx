import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Alert, Paper, Typography, Grid, alpha, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PageHeader from '../../components/dashboard/PageHeader';
import Loader from '../../components/Loader';
import propertyService from '../../api/services/propertyService';
import leaseRequestService from '../../api/services/leaseRequestService';
import leaseService from '../../api/services/leaseService';
import aiService from '../../api/services/aiService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, getPropertyTypeName, getOccupancyRate } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import PropertyThumbnail from '../../components/properties/PropertyThumbnail';
import { colors } from '../../theme/theme';

const AdminPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [leaseCount, setLeaseCount] = useState(0);
  const [error, setError] = useState('');
  const [roiLoading, setRoiLoading] = useState(false);
  const [roiResult, setRoiResult] = useState(null);

  useEffect(() => {
    Promise.all([
      propertyService.getPropertyById(id),
      leaseRequestService.getRequestsByProperty(id).catch(() => []),
      leaseService.getLeasesByProperty(id).catch(() => []),
    ])
      .then(([prop, reqs, leases]) => {
        setProperty(prop);
        setRequestCount(reqs.length);
        setLeaseCount(leases.length);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRoiAnalysis = async () => {
    setRoiLoading(true);
    setError('');
    try {
      const data = await aiService.analyzeRoi(id);
      setRoiResult(data);
      showToast('ROI analysis complete');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setRoiLoading(false);
    }
  };

  if (loading) return <Loader message="Loading property..." />;
  if (!property) return <Alert severity="error">{error || 'Not found'}</Alert>;

  const occupancy = getOccupancyRate(property.occupiedUnits, property.totalUnits);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/properties')} sx={{ mb: 2 }}>Back</Button>
      <PageHeader title={property.title} subtitle={property.location} />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={roiLoading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />} onClick={handleRoiAnalysis} disabled={roiLoading}>
          Analyze ROI with AI
        </Button>
      </Box>

      {roiResult && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: colors.surface, border: `1px solid ${colors.primary}`, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>ROI Score: {roiResult.roiScore}/10</Typography>
          <Typography sx={{ color: colors.textSecondary, mb: 2 }}>{roiResult.analysis}</Typography>
          {roiResult.recommendations?.length > 0 && (
            <List dense>
              {roiResult.recommendations.map((r) => (
                <ListItem key={r} sx={{ py: 0 }}><ListItemText primary={r} /></ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
        <PropertyThumbnail thumbnailUrl={property.thumbnailUrl} seed={property.id || property.title} alt={property.title} maxHeight={320} />
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Property Information</Typography>
            <Typography sx={{ color: colors.textSecondary, mb: 2 }}>{property.description}</Typography>
            <Grid container spacing={2}>
              {[
                ['Type', getPropertyTypeName(property.propertyType)],
                ['Price', formatCurrency(property.price)],
                ['Amenities', property.amenities],
                ['Maintenance', formatCurrency(property.monthlyMaintenanceCost)],
              ].map(([l, v]) => (
                <Grid key={l} size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>{l}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{v}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
          {property.agent && (
            <Paper sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Agent Information</Typography>
              <Typography>{property.agent.fullName}</Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>{property.agent.email}</Typography>
            </Paper>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Statistics</Typography>
            {[
              ['Occupancy', `${occupancy.percentage}%`],
              ['Monthly Revenue', formatCurrency(property.monthlyRevenue)],
              ['ROI', `${property.roi}%`],
              ['Lease Requests', requestCount],
              ['Active Leases', leaseCount],
            ].map(([l, v]) => (
              <Box key={l} sx={{ p: 2, mb: 1.5, borderRadius: 2, bgcolor: alpha(colors.surface, 0.6), border: `1px solid ${colors.border}` }}>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>{l}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{v}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPropertyDetails;

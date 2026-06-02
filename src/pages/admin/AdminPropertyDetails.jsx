import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Alert, Paper, Typography, Grid, alpha } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../../components/dashboard/PageHeader';
import Loader from '../../components/Loader';
import propertyService from '../../api/services/propertyService';
import leaseRequestService from '../../api/services/leaseRequestService';
import leaseService from '../../api/services/leaseService';
import { formatCurrency, getPropertyTypeName, getOccupancyRate } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { colors } from '../../theme/theme';

const AdminPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [leaseCount, setLeaseCount] = useState(0);
  const [error, setError] = useState('');

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

  if (loading) return <Loader message="Loading property..." />;
  if (!property) return <Alert severity="error">{error || 'Not found'}</Alert>;

  const occupancy = getOccupancyRate(property.occupiedUnits, property.totalUnits);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/properties')} sx={{ mb: 2 }}>Back</Button>
      <PageHeader title={property.title} subtitle={property.location} />

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

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Chip, TextField, Alert, Divider, Skeleton, alpha,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import propertyService from '../../api/services/propertyService';
import leaseRequestService from '../../api/services/leaseRequestService';
import PageHeader from '../../components/dashboard/PageHeader';
import LeaseRequestModal from '../../components/properties/LeaseRequestModal';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { formatCurrency, getPropertyTypeName, getOccupancyRate } from '../../utils/formatters';
import { normalizeRole } from '../../utils/roleRoutes';
import PropertyThumbnail from '../../components/properties/PropertyThumbnail';
import { colors } from '../../theme/theme';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isTenant = normalizeRole(user?.role) === 'tenant';

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    propertyService
      .getPropertyById(id)
      .then(setProperty)
      .catch((err) => setError(getApiErrorMessage(err, 'Property not found.')))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitRequest = async () => {
    if (!message.trim()) {
      setSubmitError('Please enter a message.');
      return;
    }
    setSubmitLoading(true);
    setSubmitError('');
    try {
      await leaseRequestService.createLeaseRequest(property.id, message);
      showToast('Lease Request Submitted Successfully');
      setModalOpen(false);
      navigate('/tenant/requests');
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={320} sx={{ mb: 3 }} />
        <Skeleton variant="text" height={48} />
        <Skeleton variant="text" />
      </Box>
    );
  }

  if (error || !property) {
    return <Alert severity="error">{error || 'Property not found.'}</Alert>;
  }

  const occupancy = getOccupancyRate(property.occupiedUnits, property.totalUnits);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: colors.card, border: `1px solid ${colors.border}` }}>
        <PropertyThumbnail thumbnailUrl={property.thumbnailUrl} seed={property.id || property.title} alt={property.title} maxHeight={400} />
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label={getPropertyTypeName(property.propertyType)} color="primary" size="small" />
            <Chip label={`${occupancy.percentage}% Occupied`} size="small" variant="outlined" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{property.title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 0.5, color: colors.textSecondary }} />
            <Typography sx={{ color: colors.textSecondary }}>{property.location}</Typography>
          </Box>
          <Typography variant="h5" sx={{ color: colors.success, fontWeight: 800, mb: 3 }}>
            {formatCurrency(property.price)} / month
          </Typography>

          <Divider sx={{ my: 3, borderColor: colors.border }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Description</Typography>
          <Typography sx={{ color: colors.textSecondary, mb: 3, lineHeight: 1.8 }}>{property.description}</Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            {[
              ['Total Units', property.totalUnits],
              ['Occupied', property.occupiedUnits],
              ['Maintenance', formatCurrency(property.monthlyMaintenanceCost)],
              ['ROI', `${property.roi}%`],
            ].map(([label, val]) => (
              <Paper key={label} sx={{ p: 2, bgcolor: alpha(colors.surface, 0.6), border: `1px solid ${colors.border}` }}>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>{label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{val}</Typography>
              </Paper>
            ))}
          </Box>

          {property.amenities && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Amenities</Typography>
              <Typography sx={{ color: colors.textSecondary, mb: 3 }}>{property.amenities}</Typography>
            </>
          )}

          {property.agent && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Listing Agent</Typography>
              <Typography sx={{ color: colors.textSecondary, mb: 3 }}>
                {property.agent.fullName} — {property.agent.email}
              </Typography>
            </>
          )}

          {isTenant && (
            <Button variant="contained" size="large" onClick={() => { setMessage(`I am interested in ${property.title}.`); setModalOpen(true); }}>
              Show Interest
            </Button>
          )}
        </Box>
      </Paper>

      <LeaseRequestModal
        open={modalOpen}
        property={property}
        message={message}
        loading={submitLoading}
        error={submitError}
        onClose={() => !submitLoading && setModalOpen(false)}
        onChange={setMessage}
        onSubmit={handleSubmitRequest}
      />
    </Box>
  );
};

export default PropertyDetails;

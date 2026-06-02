import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Paper, Box, Button, Chip, TextField, Alert, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HandymanIcon from '@mui/icons-material/Handyman';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import propertyService from '../../api/services/propertyService';
import leaseRequestService from '../../api/services/leaseRequestService';
import Loader from '../../components/Loader';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, getPropertyTypeName } from '../../utils/formatters';

const DEFAULT_REAL_ESTATE_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');

  // Request Submission State
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve property details. It may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleBack = () => {
    if (isAuthenticated) {
      if (user.role === 'Agent') {
        navigate('/agent/properties');
      } else if (user.role === 'Admin') {
        navigate('/admin/properties');
      } else {
        navigate('/tenant/browse');
      }
    } else {
      navigate('/browse');
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/tenant/properties/${id}` } } });
      return;
    }

    if (!message.trim()) {
      setSubmitError('Please include a message for the property agent.');
      return;
    }

    setSubmitError('');
    setSubmitSuccess('');
    setSubmitting(true);

    try {
      await leaseRequestService.createLeaseRequest(property.id, message);
      setSubmitSuccess('Lease request successfully submitted to the agent.');
      setMessage('');
      setTimeout(() => {
        navigate('/tenant/requests');
      }, 1500);
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || err.response?.data || 'Failed to submit lease request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching property details..." />;
  }

  if (error || !property) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error || 'Property not found.'}</Alert>
        <Button variant="contained" onClick={handleBack}>
          Back to Listings
        </Button>
      </Container>
    );
  }

  const {
    title,
    description,
    location,
    price,
    propertyType,
    totalUnits,
    occupiedUnits,
    monthlyMaintenanceCost,
    monthlyRevenue,
    roi,
    amenities,
    thumbnailUrl,
  } = property;

  const imageUrl = thumbnailUrl && thumbnailUrl.startsWith('http') 
    ? thumbnailUrl 
    : DEFAULT_REAL_ESTATE_IMAGE;

  // Convert amenities to list
  const amenitiesList = amenities 
    ? amenities.split(',').map((a) => a.trim()).filter((a) => a !== '') 
    : [];

  return (
    <Box sx={{ width: '100%' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 4 }}>
        Back to Listings
      </Button>

      <Grid container spacing={4}>
        {/* Left Side: Images & Detailed Specs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ overflow: 'hidden', mb: 4, border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2 }}>
            <Box
              sx={{
                width: '100%',
                height: 380,
                backgroundImage: `url("${imageUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={getPropertyTypeName(propertyType)} color="primary" icon={<BusinessIcon />} sx={{ fontWeight: 600 }} />
                <Chip label={`Occupied: ${occupiedUnits}/${totalUnits} Units`} variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                {title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 3 }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{location}</Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Description
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                {description}
              </Typography>

              {amenitiesList.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Property Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {amenitiesList.map((amenity, i) => (
                      <Chip key={i} label={amenity} sx={{ bgcolor: '#f1f5f9', fontWeight: 500 }} />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Paper>

          {/* Metric Specifications Panel */}
          <Paper sx={{ p: 4, border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Financial & Operations Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                    Monthly Price
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2e7d32' }}>
                    {formatCurrency(price)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                    Maintenance Cost
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#d32f2f' }}>
                    {formatCurrency(monthlyMaintenanceCost)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1976d2' }}>
                    {formatCurrency(monthlyRevenue)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                    Target ROI
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#ed6c02' }}>
                    {roi ? `${roi}%` : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Side: Action Submission Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, position: 'sticky', top: 90, border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 1, letterSpacing: '0.5px' }}>
              Base Rent Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e7d32', mr: 1 }}>
                {formatCurrency(price)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                / month
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* If Tenant or Public, show Lease Request box */}
            {(!isAuthenticated || user.role === 'Tenant') ? (
              <Box component="form" onSubmit={handleRequestSubmit}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Create Lease Request
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Interested in this property? Submit an application to begin discussions with the agent.
                </Typography>

                {submitSuccess && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    {submitSuccess}
                  </Alert>
                )}

                {submitError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {submitError}
                  </Alert>
                )}

                <TextField
                  label="Introduce your business"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={submitting}
                  placeholder="State your preferred lease duration, business type, and target start date..."
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Broker Information
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  This property is currently managed by you or another broker on the IRCM Platform.
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/agent/properties')}
                  sx={{ mt: 2 }}
                >
                  Manage My Inventory
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyDetails;

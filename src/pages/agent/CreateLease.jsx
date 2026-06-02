import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paper, Typography, Box, Grid, TextField, Button, Alert, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import leaseService from '../../api/services/leaseService';

export const CreateLease = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract variables passed from requests pipeline
  const [params, setParams] = useState({
    requestId: '',
    propertyId: '',
    tenantId: '',
    propertyName: '',
    tenantName: '',
  });

  const [formData, setFormData] = useState({
    monthlyRent: '',
    securityDeposit: '',
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const requestId = searchParams.get('requestId') || '';
    const propertyId = searchParams.get('propertyId') || '';
    const tenantId = searchParams.get('tenantId') || '';
    const propertyName = searchParams.get('propertyName') || '';
    const tenantName = searchParams.get('tenantName') || '';

    setParams({ requestId, propertyId, tenantId, propertyName, tenantName });

    // Try setting standard defaults if available
    setFormData((prev) => ({
      ...prev,
      monthlyRent: '',
      securityDeposit: '',
      startDate: new Date().toISOString().substring(0, 10), // default to today
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().substring(0, 10), // default to 1 year later
    }));
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { monthlyRent, securityDeposit, startDate, endDate } = formData;
    if (!monthlyRent || !securityDeposit || !startDate || !endDate) {
      setError('Please complete all contract parameters.');
      return;
    }

    setLoading(true);

    const payload = {
      propertyId: params.propertyId,
      tenantId: params.tenantId,
      leaseRequestId: params.requestId,
      monthlyRent: parseFloat(monthlyRent),
      securityDeposit: parseFloat(securityDeposit),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };

    try {
      await leaseService.createLease(payload);
      setSuccess('Lease contract drafted successfully! Redirecting...');
      setTimeout(() => {
        navigate('/agent/leases');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to generate lease contract. Ensure the Dates format is correct.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/requests')} sx={{ mb: 4 }}>
        Back to Pipeline
      </Button>

      <Paper sx={{ p: 4, border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2, maxWidth: 650 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Draft Lease Contract
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Set rates and timelines for approved applicant.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Meta Read Only Panel */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', boxShadow: 'none' }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block' }}>
                  Target Property
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 1.5 }}>
                  {params.propertyName || 'Property Reference: ' + params.propertyId}
                </Typography>

                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block' }}>
                  Approved Applicant (Tenant)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                  {params.tenantName || 'Tenant Reference: ' + params.tenantId}
                </Typography>
              </Paper>
            </Grid>

            {/* Monthly Rent */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Monthly Rent ($)"
                name="monthlyRent"
                type="number"
                value={formData.monthlyRent}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            {/* Security Deposit */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Security Deposit Lock ($)"
                name="securityDeposit"
                type="number"
                value={formData.securityDeposit}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Lease Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Lease End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Submit buttons */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button onClick={() => navigate('/agent/requests')} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Contract'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateLease;

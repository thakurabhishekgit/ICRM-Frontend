import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Grid, TextField, Button, FormControl,
  InputLabel, Select, MenuItem, Alert, InputAdornment, FormHelperText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import propertyService from '../../api/services/propertyService';

export const AddProperty = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    propertyType: 0, // Default to 0 (Office Space)
    totalUnits: '',
    occupiedUnits: 0,
    monthlyMaintenanceCost: '',
    monthlyRevenue: '',
    roi: '',
    amenities: '',
    thumbnailUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Media upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      propertyType: parseInt(e.target.value, 10),
    });
  };

  // Automated assistant: compute monthly revenue & ROI estimation based on rent * units
  const handleAutoEstimate = () => {
    const rent = parseFloat(formData.price) || 0;
    const totalU = parseFloat(formData.totalUnits) || 0;
    const maint = parseFloat(formData.monthlyMaintenanceCost) || 0;

    const estimatedRevenue = rent * totalU;
    
    // Simple ROI calculation: (Annual Net Revenue / Annual Cost) * 100
    // Annual Net Revenue = (Monthly Revenue - Monthly Maintenance) * 12
    const monthlyNet = estimatedRevenue - maint;
    const annualNet = monthlyNet * 12;
    const annualCost = maint * 12 || 1; // avoid divide by zero
    const estimatedRoi = Math.round((annualNet / (rent * totalU * 10 || 100000)) * 100); 

    setFormData({
      ...formData,
      monthlyRevenue: estimatedRevenue.toFixed(2),
      roi: estimatedRoi > 0 ? estimatedRoi.toString() : '8.5', // standard default
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    try {
      const response = await propertyService.uploadThumbnail(file);
      // Backend may return direct URL string or object like { url: '...' }
      const fileUrl = typeof response === 'string' ? response : response.url || response.filePath || '';
      
      if (fileUrl) {
        setFormData((prev) => ({
          ...prev,
          thumbnailUrl: fileUrl,
        }));
      } else {
        setUploadError('Failed to capture uploaded file URL.');
      }
    } catch (err) {
      console.error(err);
      setUploadError('File upload failed. Ensure the format is an image and is small (under 5MB).');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field audits
    if (!formData.title || !formData.description || !formData.location || !formData.price || !formData.totalUnits || !formData.thumbnailUrl) {
      setError('Please complete all required fields and upload/set a thumbnail image.');
      return;
    }

    setLoading(true);

    // Normalize numerical types before serialization
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      totalUnits: parseInt(formData.totalUnits, 10),
      occupiedUnits: parseInt(formData.occupiedUnits, 10),
      monthlyMaintenanceCost: parseFloat(formData.monthlyMaintenanceCost || 0),
      monthlyRevenue: parseFloat(formData.monthlyRevenue || 0),
      roi: parseFloat(formData.roi || 0),
    };

    try {
      await propertyService.createProperty(payload);
      setSuccess('Property listed successfully!');
      setTimeout(() => {
        navigate('/agent/properties');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to save building listing details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/properties')} sx={{ mb: 4 }}>
        Back to Portfolio
      </Button>

      <Paper sx={{ p: 4, border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            List Commercial Property
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Set rent prices, unit spaces, amenities, and operational estimations.
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
            {/* Title */}
            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="Property Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            {/* Property Type */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel id="property-type-select-label">Property Type</InputLabel>
                <Select
                  labelId="property-type-select-label"
                  id="property-type-select"
                  value={formData.propertyType}
                  label="Property Type"
                  onChange={handleTypeChange}
                  disabled={loading}
                >
                  <MenuItem value={0}>Office Space</MenuItem>
                  <MenuItem value={1}>Retail Storefront</MenuItem>
                  <MenuItem value={2}>Industrial Plant</MenuItem>
                  <MenuItem value={3}>Logistic Warehouse</MenuItem>
                  <MenuItem value={4}>Commercial Complex</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Property Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Property Location (Address)"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g. 100 Pine St, Suite 500, San Francisco, CA"
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Target Monthly Rent ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            {/* Total Units */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Total Sub-Units"
                name="totalUnits"
                type="number"
                value={formData.totalUnits}
                onChange={handleChange}
                disabled={loading}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            {/* Occupied Units */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Occupied Units"
                name="occupiedUnits"
                type="number"
                value={formData.occupiedUnits}
                onChange={handleChange}
                disabled={loading}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Maintenance Cost */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Monthly Maintenance Cost ($)"
                name="monthlyMaintenanceCost"
                type="number"
                value={formData.monthlyMaintenanceCost}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            {/* Estimated Revenue */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Monthly Revenue Yield ($)"
                name="monthlyRevenue"
                type="number"
                value={formData.monthlyRevenue}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
                helperText="Estimated yield from rental occupancies"
              />
            </Grid>

            {/* ROI */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Annual ROI Rate (%)"
                name="roi"
                type="number"
                value={formData.roi}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { min: 0 }
                }}
                helperText="Estimated yield percent"
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <Button size="small" variant="text" onClick={handleAutoEstimate} disabled={loading}>
                Estimate Yield & ROI Automatically
              </Button>
            </Grid>

            {/* Amenities */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Amenities (Comma-separated)"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                disabled={loading}
                placeholder="Elevator, High-speed Fiber, Loading Dock, Security Staff, Garage Parking"
              />
            </Grid>

            {/* Thumbnail URL / Upload */}
            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="Thumbnail Image URL"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                disabled={loading}
                helperText="Paste a URL or upload a file directly"
              />
            </Grid>

            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={uploading || loading}
                fullWidth
                sx={{ height: 56 }}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
              </Button>
            </Grid>

            {uploadError && (
              <Grid item xs={12}>
                <FormHelperText error>{uploadError}</FormHelperText>
              </Grid>
            )}

            {/* Submit */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button onClick={() => navigate('/agent/properties')} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Saving...' : 'List Commercial Property'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddProperty;

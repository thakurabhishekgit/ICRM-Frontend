import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material';

import PropertyCard from '../../components/PropertyCard';
import SearchBar from '../../components/SearchBar';
import FilterPanel from '../../components/FilterPanel';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

import propertyService from '../../api/services/propertyService';
import leaseRequestService from '../../api/services/leaseRequestService';
import useAuth from '../../hooks/useAuth';

export const BrowseProperties = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyType: 'all',
    maxPrice: '',
    location: '',
  });

  // Modal dialog state
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getAllProperties();
      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch commercial property directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Perform client-side filter computation based on active search and filter panel settings
  useEffect(() => {
    let result = [...properties];

    // Search Query Filter (Title/Description/Location)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.location?.toLowerCase().includes(query)
      );
    }

    // Property Type Filter
    if (filters.propertyType !== 'all') {
      result = result.filter(
        (p) => String(p.propertyType) === String(filters.propertyType)
      );
    }

    // Max Price Filter
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    // Location Keyword Filter
    if (filters.location) {
      const locQuery = filters.location.toLowerCase();
      result = result.filter((p) => p.location?.toLowerCase().includes(locQuery));
    }

    setFilteredProperties(result);
  }, [searchQuery, filters, properties]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleResetFilters = () => {
    setFilters({
      propertyType: 'all',
      maxPrice: '',
      location: '',
    });
    setSearchQuery('');
  };

  const handleViewDetails = (id) => {
    const targetPath = isAuthenticated ? `/tenant/properties/${id}` : `/properties/${id}`;
    navigate(targetPath);
  };

  const handleShowInterestClick = (property) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/tenant/browse' } } });
      return;
    }
    setSelectedProperty(property);
    setRequestMessage(`Hi, I am interested in leasing ${property.title} located at ${property.location}. Please let me know the availability.`);
    setSubmitError('');
    setSubmitSuccess('');
    setInterestModalOpen(true);
  };

  const handleSendLeaseRequest = async () => {
    if (!requestMessage.trim()) {
      setSubmitError('Please include a brief message introducing yourself.');
      return;
    }

    setSubmitError('');
    setSubmitSuccess('');
    setSubmitLoading(true);

    try {
      await leaseRequestService.createLeaseRequest(selectedProperty.id, requestMessage);
      setSubmitSuccess('Lease request successfully submitted to the agent.');
      setTimeout(() => {
        setInterestModalOpen(false);
        navigate('/tenant/requests');
      }, 1500);
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || err.response?.data || 'Failed to submit lease request.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Commercial Real Estate Directory
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Discover premium retail slots, corporate offices, and logistical spaces.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Input Bar */}
      <Box sx={{ mb: 3 }}>
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>

      {/* Filters Form Panel */}
      <FilterPanel filters={filters} onChange={setFilters} onReset={handleResetFilters} />

      {loading ? (
        <Loader message="Querying real estate directories..." />
      ) : filteredProperties.length === 0 ? (
        <EmptyState
          title="No commercial properties found"
          description="Try broadening your filters or looking in a different location."
          actionText="Clear All Filters"
          onActionClick={handleResetFilters}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <PropertyCard
                property={property}
                onViewDetails={handleViewDetails}
                onShowInterest={handleShowInterestClick}
                actionsType="tenant"
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Lease Request Modal Dialog */}
      <Dialog open={interestModalOpen} onClose={() => !submitLoading && setInterestModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Express Lease Interest
        </DialogTitle>
        <DialogContent>
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
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, fontWeight: 500 }}>
            Property: <strong style={{ color: '#0f172a' }}>{selectedProperty?.title}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Introduction Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            disabled={submitLoading}
            placeholder="Introduce your business operations, timeline, and occupancy goals..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setInterestModalOpen(false)} disabled={submitLoading} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSendLeaseRequest} disabled={submitLoading} variant="contained" color="primary">
            {submitLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BrowseProperties;

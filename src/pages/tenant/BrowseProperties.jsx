import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert, Skeleton } from '@mui/material';
import PropertyCard from '../../components/PropertyCard';
import SearchBar from '../../components/SearchBar';
import FilterPanel from '../../components/FilterPanel';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/dashboard/PageHeader';
import LeaseRequestModal from '../../components/properties/LeaseRequestModal';
import propertyService from '../../api/services/propertyService';
import leaseRequestService from '../../api/services/leaseRequestService';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { normalizeRole } from '../../utils/roleRoutes';

const PropertyGridSkeleton = () => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} variant="rounded" height={420} animation="wave" />
    ))}
  </Box>
);

const BrowseProperties = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const isTenant = normalizeRole(user?.role) === 'tenant';

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ propertyType: 'all', maxPrice: '', location: '' });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    propertyService
      .getAllProperties()
      .then(setProperties)
      .catch((err) => setError(getApiErrorMessage(err, 'Failed to load properties.')))
      .finally(() => setLoading(false));
  }, []);

  const filteredProperties = useMemo(() => {
    let result = [...properties];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }
    if (filters.propertyType !== 'all') {
      result = result.filter((p) => String(p.propertyType) === String(filters.propertyType));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter((p) => p.location?.toLowerCase().includes(loc));
    }
    return result;
  }, [properties, searchQuery, filters]);

  const handleShowInterest = (property) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/properties' } } });
      return;
    }
    if (!isTenant) {
      showToast('Only tenants can submit lease requests.', 'warning');
      return;
    }
    setSelectedProperty(property);
    setRequestMessage(`I am interested in leasing ${property.title} at ${property.location}.`);
    setSubmitError('');
    setModalOpen(true);
  };

  const handleSubmitRequest = async () => {
    if (!requestMessage.trim()) {
      setSubmitError('Please enter a message.');
      return;
    }
    setSubmitLoading(true);
    setSubmitError('');
    try {
      await leaseRequestService.createLeaseRequest(selectedProperty.id, requestMessage);
      showToast('Lease Request Submitted Successfully');
      setModalOpen(false);
      navigate('/tenant/requests');
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Failed to submit request.'));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader title="Browse Properties" subtitle="Search and explore commercial properties." />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
        <SearchBar onSearch={setSearchQuery} onClear={() => setSearchQuery('')} />
      </Box>
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        onReset={() => { setFilters({ propertyType: 'all', maxPrice: '', location: '' }); setSearchQuery(''); }}
      />

      {loading ? (
        <PropertyGridSkeleton />
      ) : filteredProperties.length === 0 ? (
        <EmptyState title="No properties found" description="Try adjusting your search or filters." />
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onViewDetails={(id) => navigate(`/properties/${id}`)}
              onShowInterest={isTenant ? handleShowInterest : undefined}
              actionsType="tenant"
            />
          ))}
        </Box>
      )}

      <LeaseRequestModal
        open={modalOpen}
        property={selectedProperty}
        message={requestMessage}
        loading={submitLoading}
        error={submitError}
        onClose={() => !submitLoading && setModalOpen(false)}
        onChange={setRequestMessage}
        onSubmit={handleSubmitRequest}
      />
    </Box>
  );
};

export default BrowseProperties;

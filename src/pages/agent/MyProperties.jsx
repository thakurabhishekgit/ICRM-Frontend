import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PropertyCard from '../../components/PropertyCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import PageHeader from '../../components/dashboard/PageHeader';
import propertyService from '../../api/services/propertyService';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiHelpers';

const MyProperties = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertyService.getMyProperties();
      setProperties(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await propertyService.deleteProperty(deleteId);
      showToast('Property deleted successfully');
      setDeleteId(null);
      fetchProperties();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <PageHeader title="My Properties" subtitle="Manage your commercial property listings." />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/agent/properties/create')}>
          Add Property
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Loader message="Loading properties..." />
      ) : properties.length === 0 ? (
        <EmptyState
          title="No properties yet"
          description="Create your first listing to start receiving lease requests."
          actionLabel="Add Property"
          onAction={() => navigate('/agent/properties/create')}
        />
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              actionsType="agent"
              onViewDetails={(id) => navigate(`/properties/${id}`)}
              onEdit={(p) => navigate(`/agent/properties/edit/${p.id}`)}
              onDelete={setDeleteId}
              onViewRequests={(id) => navigate(`/agent/property/${id}/requests`)}
              onViewLeases={(id) => navigate(`/agent/property/${id}/leases`)}
            />
          ))}
        </Box>
      )}

      <ConfirmationDialog
        open={Boolean(deleteId)}
        title="Delete Property?"
        message="This will permanently remove the property listing."
        confirmText="Delete"
        confirmColor="error"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => !deleteLoading && setDeleteId(null)}
      />
    </Box>
  );
};

export default MyProperties;

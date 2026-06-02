import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import PropertyCard from '../../components/PropertyCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import propertyService from '../../api/services/propertyService';

export const MyProperties = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  
  // Deletion state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getMyProperties();
      setProperties(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch your properties inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/tenant/properties/${id}`);
  };

  const handleEditClick = (property) => {
    navigate(`/agent/properties/edit/${property.id}`);
  };

  const handleDeleteClick = (id) => {
    setPropertyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;
    setDeleteLoading(true);
    try {
      await propertyService.deleteProperty(propertyToDelete);
      setProperties(properties.filter(p => p.id !== propertyToDelete));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to delete the property. It may have associated active leases.');
    } finally {
      setDeleteLoading(false);
      setPropertyToDelete(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            My Managed Properties
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage details, upload media files, and monitor tenant request hooks.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/agent/properties/new')}
        >
          Add Property
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader message="Loading property portfolio..." />
      ) : properties.length === 0 ? (
        <EmptyState
          title="No properties in portfolio"
          description="List your first commercial real estate space to start receiving lease requests."
          actionText="Add A Property"
          onActionClick={() => navigate('/agent/properties/new')}
        />
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <PropertyCard
                property={property}
                onViewDetails={handleViewDetails}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                actionsType="agent"
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Commercial Property?"
        message="This action will remove the property listing permanently from the public directory. Properties under active leases cannot be deleted."
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default MyProperties;

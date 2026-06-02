import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-svg';
import { Typography, Box, Chip, Button, Alert } from '@mui/material';
import { useNavigate as useNav } from 'react-router-dom';

import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import propertyService from '../../api/services/propertyService';
import { formatCurrency, getPropertyTypeName, getOccupancyRate } from '../../utils/formatters';

export const AdminProperties = () => {
  const navigate = useNav();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');

  // Deletion Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getAllProperties();
      setProperties(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch platform property records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedPropertyId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPropertyId) return;
    setDeleteLoading(true);
    setError('');

    try {
      await propertyService.deleteProperty(selectedPropertyId);
      setProperties(properties.filter(p => p.id !== selectedPropertyId));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to remove property listing from directory.');
    } finally {
      setDeleteLoading(false);
      setSelectedPropertyId(null);
    }
  };

  const columns = [
    {
      id: 'title',
      label: 'Title',
      render: (row) => (
        <strong style={{ color: '#1e293b', cursor: 'pointer' }} onClick={() => navigate(`/tenant/properties/${row.id}`)}>
          {row.title}
        </strong>
      ),
    },
    {
      id: 'propertyType',
      label: 'Type',
      render: (row) => getPropertyTypeName(row.propertyType),
    },
    {
      id: 'location',
      label: 'Location',
    },
    {
      id: 'price',
      label: 'Monthly Rent',
      render: (row) => formatCurrency(row.price),
    },
    {
      id: 'occupancy',
      label: 'Occupancy Level',
      render: (row) => {
        const occ = getOccupancyRate(row.occupiedUnits, row.totalUnits);
        return occ.label;
      },
    },
    {
      id: 'roi',
      label: 'Annual ROI',
      render: (row) => (row.roi ? `${row.roi}%` : '—'),
    },
    {
      id: 'actions',
      label: 'Audit Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" onClick={() => navigate(`/tenant/properties/${row.id}`)}>
            Inspect
          </Button>
          <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(row.id)}>
            Remove
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Platform Properties Audit
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Review listed properties across all agents, audit financial metrics, or delete unauthorized listings.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader message="Loading property databases..." />
      ) : (
        <DataTable
          columns={columns}
          rows={properties}
          emptyTitle="No platform properties listed"
          emptyDescription="Properties added by agents will display in this audit log."
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Remove Listing Administratively?"
        message="This action will delete the property listing from the platform directories. Leased properties cannot be removed."
        confirmText={deleteLoading ? 'Removing...' : 'Remove'}
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default AdminProperties;

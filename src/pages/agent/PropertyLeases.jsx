import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Chip, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import leaseService from '../../api/services/leaseService';
import { formatCurrency, formatDate, getLeaseStatusProps } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';

const PropertyLeases = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leases, setLeases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    leaseService
      .getLeasesByProperty(propertyId)
      .then(setLeases)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [propertyId]);

  const columns = [
    { id: 'tenant', label: 'Tenant', render: (row) => row.tenant?.fullName || '—' },
    { id: 'rent', label: 'Monthly Rent', render: (row) => formatCurrency(row.monthlyRent) },
    { id: 'status', label: 'Status', render: (row) => { const s = getLeaseStatusProps(row.status); return <Chip label={s.label} color={s.color} size="small" variant="outlined" />; } },
    { id: 'start', label: 'Start', render: (row) => formatDate(row.startDate) },
    { id: 'end', label: 'End', render: (row) => formatDate(row.endDate) },
  ];

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/properties')} sx={{ mb: 2 }}>Back</Button>
      <PageHeader title="Property Leases" subtitle="All leases for this property." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <DataTable columns={columns} rows={leases} loading={loading} onRowClick={(row) => navigate(`/lease/${row.id}`)} />
    </Box>
  );
};

export default PropertyLeases;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Alert } from '@mui/material';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import leaseService from '../../api/services/leaseService';
import { formatDate, formatCurrency, getLeaseStatusProps } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';

const MyLeases = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leases, setLeases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    leaseService
      .getMyLeases()
      .then(setLeases)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { id: 'property', label: 'Property', render: (row) => row.property?.title || '—' },
    { id: 'rent', label: 'Monthly Rent', render: (row) => formatCurrency(row.monthlyRent) },
    { id: 'deposit', label: 'Deposit', render: (row) => formatCurrency(row.securityDeposit) },
    {
      id: 'status',
      label: 'Status',
      render: (row) => {
        const { color, label } = getLeaseStatusProps(row.status);
        return <Chip label={label} color={color} size="small" variant="outlined" />;
      },
    },
    { id: 'start', label: 'Start Date', render: (row) => formatDate(row.startDate) },
    { id: 'end', label: 'End Date', render: (row) => formatDate(row.endDate) },
    { id: 'agent', label: 'Agent', render: (row) => row.agent?.fullName || '—' },
  ];

  return (
    <Box>
      <PageHeader title="My Leases" subtitle="View your active and historical lease agreements." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <DataTable
        columns={columns}
        rows={leases}
        loading={loading}
        onRowClick={(row) => navigate(`/lease/${row.id}`)}
        emptyTitle="No leases found"
        emptyDescription="Approved lease agreements will appear here."
      />
    </Box>
  );
};

export default MyLeases;

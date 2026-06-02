import { useState, useEffect } from 'react';
import { Box, Chip, Alert } from '@mui/material';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import leaseRequestService from '../../api/services/leaseRequestService';
import { formatDate, getLeaseRequestStatusProps } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';

const MyRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    leaseRequestService
      .getMyRequests()
      .then(setRequests)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { id: 'property', label: 'Property', render: (row) => row.property?.title || '—' },
    { id: 'agent', label: 'Agent', render: (row) => row.agent?.fullName || '—' },
    { id: 'message', label: 'Message', render: (row) => row.message || '—' },
    {
      id: 'status',
      label: 'Status',
      render: (row) => {
        const { color, label } = getLeaseRequestStatusProps(row.status);
        return <Chip label={label} color={color} size="small" variant="outlined" />;
      },
    },
    { id: 'date', label: 'Requested Date', render: (row) => formatDate(row.requestedAt) },
  ];

  return (
    <Box>
      <PageHeader title="My Requests" subtitle="Track your lease request statuses." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <DataTable
        columns={columns}
        rows={requests}
        loading={loading}
        emptyTitle="No lease requests"
        emptyDescription="Browse properties and submit a lease request to get started."
      />
    </Box>
  );
};

export default MyRequests;

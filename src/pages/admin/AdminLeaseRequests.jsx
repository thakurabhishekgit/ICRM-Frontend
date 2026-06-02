import { useState, useEffect } from 'react';
import { Box, Chip, Alert } from '@mui/material';
import PageHeader from '../../components/dashboard/PageHeader';
import AdminDataTable from '../../components/enterprise/AdminDataTable';
import { getAllLeaseRequests } from '../../services/adminService';
import { formatDate, getLeaseRequestStatusProps } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { useToast } from '../../context/ToastContext';

const AdminLeaseRequests = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllLeaseRequests()
      .then(setRequests)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const rows = requests.map((r) => ({
    id: r.id,
    property: r.property?.title,
    tenant: r.tenant?.fullName,
    agent: r.agent?.fullName,
    status: r.status,
    requestedAt: r.requestedAt,
  }));

  const columns = [
    { id: 'property', label: 'Property', sortable: true },
    { id: 'tenant', label: 'Tenant' },
    { id: 'agent', label: 'Agent' },
    { id: 'status', label: 'Status', render: (row) => { const s = getLeaseRequestStatusProps(row.status); return <Chip label={s.label} color={s.color} size="small" variant="outlined" />; } },
    { id: 'requestedAt', label: 'Requested Date', render: (row) => formatDate(row.requestedAt), sortable: true },
  ];

  return (
    <Box>
      <PageHeader title="Lease Request Management" subtitle="All lease requests across the platform." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <AdminDataTable
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={['property', 'tenant', 'agent']}
        statusKey="status"
        searchPlaceholder="Search requests..."
        emptyTitle="No lease requests"
        onExport={() => showToast('Export coming soon', 'info')}
      />
    </Box>
  );
};

export default AdminLeaseRequests;

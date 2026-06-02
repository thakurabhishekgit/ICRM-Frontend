import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Button, Alert } from '@mui/material';
import PageHeader from '../../components/dashboard/PageHeader';
import AdminDataTable from '../../components/enterprise/AdminDataTable';
import { getAllLeases } from '../../services/adminService';
import { formatCurrency, formatDate, getLeaseStatusProps } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { useToast } from '../../context/ToastContext';

const AdminLeases = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leases, setLeases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllLeases()
      .then(setLeases)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const rows = leases.map((l) => ({
    id: l.id,
    property: l.property?.title,
    tenant: l.tenant?.fullName,
    agent: l.agent?.fullName,
    monthlyRent: l.monthlyRent,
    status: l.status,
    startDate: l.startDate,
    endDate: l.endDate,
  }));

  const columns = [
    { id: 'property', label: 'Property', sortable: true },
    { id: 'tenant', label: 'Tenant' },
    { id: 'agent', label: 'Agent' },
    { id: 'monthlyRent', label: 'Monthly Rent', render: (r) => formatCurrency(r.monthlyRent) },
    { id: 'status', label: 'Status', render: (r) => { const s = getLeaseStatusProps(r.status); return <Chip label={s.label} color={s.color} size="small" variant="outlined" />; } },
    { id: 'startDate', label: 'Start', render: (r) => formatDate(r.startDate) },
    { id: 'endDate', label: 'End', render: (r) => formatDate(r.endDate) },
    { id: 'actions', label: '', render: (r) => <Button size="small" onClick={() => navigate(`/lease/${r.id}`)}>View</Button> },
  ];

  return (
    <Box>
      <PageHeader title="Lease Management" subtitle="All lease contracts across the platform." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <AdminDataTable
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={['property', 'tenant', 'agent']}
        statusKey="status"
        searchPlaceholder="Search leases..."
        emptyTitle="No leases found"
        onExport={() => showToast('Export coming soon', 'info')}
      />
    </Box>
  );
};

export default AdminLeases;

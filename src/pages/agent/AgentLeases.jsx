import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Button, Alert } from '@mui/material';
import DataTable from '../../components/DataTable';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import PageHeader from '../../components/dashboard/PageHeader';
import leaseService from '../../api/services/leaseService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate, getLeaseStatusProps, isLeasePending, isLeaseActive } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';

const AgentLeases = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leases, setLeases] = useState([]);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState({ open: false, leaseId: null, action: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const data = await leaseService.getAgentLeases();
      setLeases(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeases(); }, []);

  const handleConfirm = async () => {
    const { leaseId, action } = dialog;
    setActionLoading(true);
    try {
      if (action === 'activate') await leaseService.activateLease(leaseId);
      if (action === 'expire') await leaseService.expireLease(leaseId);
      if (action === 'terminate') await leaseService.terminateLease(leaseId);
      showToast(`Lease ${action}d successfully`);
      setDialog({ open: false, leaseId: null, action: '' });
      fetchLeases();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const dialogCopy = {
    activate: { title: 'Activate Lease?', message: 'Mark this lease as active and begin occupancy tracking.' },
    expire: { title: 'Expire Lease?', message: 'Mark this lease as naturally expired.' },
    terminate: { title: 'Terminate Lease?', message: 'Immediately terminate this active lease.' },
  };

  const columns = [
    { id: 'property', label: 'Property', render: (row) => row.property?.title || '—' },
    { id: 'tenant', label: 'Tenant', render: (row) => row.tenant?.fullName || '—' },
    { id: 'rent', label: 'Monthly Rent', render: (row) => formatCurrency(row.monthlyRent) },
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
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" onClick={() => navigate(`/lease/${row.id}`)}>View</Button>
          {isLeasePending(row.status) && (
            <Button size="small" variant="contained" color="success" onClick={() => setDialog({ open: true, leaseId: row.id, action: 'activate' })}>Activate</Button>
          )}
          {isLeaseActive(row.status) && (
            <>
              <Button size="small" variant="outlined" onClick={() => setDialog({ open: true, leaseId: row.id, action: 'expire' })}>Expire</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => setDialog({ open: true, leaseId: row.id, action: 'terminate' })}>Terminate</Button>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title="Leases" subtitle="Manage lease contracts and lifecycle status." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <DataTable columns={columns} rows={leases} loading={loading} emptyTitle="No leases" emptyDescription="Create leases from approved requests." />
      <ConfirmationDialog
        open={dialog.open}
        title={dialogCopy[dialog.action]?.title}
        message={dialogCopy[dialog.action]?.message}
        confirmColor={dialog.action === 'terminate' ? 'error' : 'primary'}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onClose={() => !actionLoading && setDialog({ open: false, leaseId: null, action: '' })}
      />
    </Box>
  );
};

export default AgentLeases;

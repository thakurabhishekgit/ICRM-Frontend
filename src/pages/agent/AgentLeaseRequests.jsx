import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Button, Alert } from '@mui/material';
import DataTable from '../../components/DataTable';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import PageHeader from '../../components/dashboard/PageHeader';
import leaseRequestService from '../../api/services/leaseRequestService';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate, getLeaseRequestStatusProps, isLeaseRequestPending, isLeaseRequestApproved } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';

const AgentLeaseRequests = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { refreshNotifications } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState({ open: false, type: '', row: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await leaseRequestService.getAgentRequests();
      setRequests(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleConfirm = async () => {
    const { type, row } = dialog;
    if (!row) return;
    setActionLoading(true);
    try {
      if (type === 'approve') {
        await leaseRequestService.approveRequest(row.id);
        showToast('Lease request approved');
        refreshNotifications();
        setDialog({ open: false, type: '', row: null });
        navigate(`/agent/create-lease/${row.id}`);
      } else if (type === 'reject') {
        await leaseRequestService.rejectRequest(row.id);
        showToast('Lease request rejected');
        refreshNotifications();
        setDialog({ open: false, type: '', row: null });
        fetchRequests();
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { id: 'property', label: 'Property', render: (row) => row.property?.title || '—' },
    { id: 'tenant', label: 'Tenant', render: (row) => row.tenant?.fullName || '—' },
    { id: 'message', label: 'Message', render: (row) => row.message || '—' },
    {
      id: 'status',
      label: 'Status',
      render: (row) => {
        const { color, label } = getLeaseRequestStatusProps(row.status);
        return <Chip label={label} color={color} size="small" variant="outlined" />;
      },
    },
    { id: 'date', label: 'Date', render: (row) => formatDate(row.requestedAt) },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => {
        if (isLeaseRequestPending(row.status)) {
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="contained" color="success" onClick={() => setDialog({ open: true, type: 'approve', row })}>Approve</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => setDialog({ open: true, type: 'reject', row })}>Reject</Button>
            </Box>
          );
        }
        if (isLeaseRequestApproved(row.status)) {
          return (
            <Button size="small" variant="contained" onClick={() => navigate(`/agent/create-lease/${row.id}`)}>
              Create Lease
            </Button>
          );
        }
        return '—';
      },
    },
  ];

  return (
    <Box>
      <PageHeader title="Lease Requests" subtitle="Review and process tenant lease applications." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <DataTable columns={columns} rows={requests} loading={loading} emptyTitle="No requests" emptyDescription="Tenant requests for your properties will appear here." />
      <ConfirmationDialog
        open={dialog.open}
        title={dialog.type === 'approve' ? 'Approve Request?' : 'Reject Request?'}
        message={dialog.type === 'approve' ? 'Approve this lease request and proceed to create a lease?' : 'Reject this lease request? This cannot be undone.'}
        confirmText={dialog.type === 'approve' ? 'Approve' : 'Reject'}
        confirmColor={dialog.type === 'reject' ? 'error' : 'success'}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onClose={() => !actionLoading && setDialog({ open: false, type: '', row: null })}
      />
    </Box>
  );
};

export default AgentLeaseRequests;

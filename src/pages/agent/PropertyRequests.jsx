import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Chip, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DataTable from '../../components/DataTable';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import PageHeader from '../../components/dashboard/PageHeader';
import leaseRequestService from '../../api/services/leaseRequestService';
import { useToast } from '../../context/ToastContext';
import { formatDate, getLeaseRequestStatusProps, isLeaseRequestPending, isLeaseRequestApproved } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';

const PropertyRequests = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState({ open: false, type: '', row: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await leaseRequestService.getRequestsByProperty(propertyId);
      setRequests(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [propertyId]);

  const handleConfirm = async () => {
    const { type, row } = dialog;
    setActionLoading(true);
    try {
      if (type === 'approve') {
        await leaseRequestService.approveRequest(row.id);
        showToast('Request approved');
        navigate(`/agent/create-lease/${row.id}`);
      } else {
        await leaseRequestService.rejectRequest(row.id);
        showToast('Request rejected');
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
    { id: 'tenant', label: 'Tenant', render: (row) => row.tenant?.fullName || '—' },
    { id: 'message', label: 'Message', render: (row) => row.message || '—' },
    { id: 'status', label: 'Status', render: (row) => { const s = getLeaseRequestStatusProps(row.status); return <Chip label={s.label} color={s.color} size="small" variant="outlined" />; } },
    { id: 'date', label: 'Date', render: (row) => formatDate(row.requestedAt) },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => isLeaseRequestPending(row.status) ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="contained" color="success" onClick={() => setDialog({ open: true, type: 'approve', row })}>Approve</Button>
          <Button size="small" variant="outlined" color="error" onClick={() => setDialog({ open: true, type: 'reject', row })}>Reject</Button>
        </Box>
      ) : isLeaseRequestApproved(row.status) ? (
        <Button size="small" onClick={() => navigate(`/agent/create-lease/${row.id}`)}>Create Lease</Button>
      ) : '—',
    },
  ];

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/properties')} sx={{ mb: 2 }}>Back</Button>
      <PageHeader title="Property Requests" subtitle="All lease requests for this property." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <DataTable columns={columns} rows={requests} loading={loading} />
      <ConfirmationDialog open={dialog.open} title={dialog.type === 'approve' ? 'Approve?' : 'Reject?'} message="Confirm this action." confirmColor={dialog.type === 'reject' ? 'error' : 'success'} loading={actionLoading} onConfirm={handleConfirm} onClose={() => !actionLoading && setDialog({ open: false, type: '', row: null })} />
    </Box>
  );
};

export default PropertyRequests;

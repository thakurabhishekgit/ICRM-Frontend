import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Chip, Button, Alert } from '@mui/material';

import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import leaseRequestService from '../../api/services/leaseRequestService';
import { formatDate } from '../../utils/formatters';

export const AgentLeaseRequests = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await leaseRequestService.getAgentRequests();
      setRequests(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch assigned tenant requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (row) => {
    setError('');
    try {
      await leaseRequestService.approveRequest(row.id);
      
      // Redirect directly to lease drafting page, passing parameters
      navigate(
        `/agent/leases/create?requestId=${row.id}&propertyId=${row.propertyId}&tenantId=${row.tenantId || row.tenant?.id}&propertyName=${encodeURIComponent(row.property?.title || '')}&tenantName=${encodeURIComponent(row.tenant?.fullName || row.tenant?.email || '')}`
      );
    } catch (err) {
      console.error(err);
      setError('Failed to approve request. Ensure backend connectivity.');
    }
  };

  const handleReject = async (id) => {
    setError('');
    try {
      await leaseRequestService.rejectRequest(id);
      // Refresh list
      fetchRequests();
    } catch (err) {
      console.error(err);
      setError('Failed to reject request.');
    }
  };

  const columns = [
    {
      id: 'propertyName',
      label: 'Property Title',
      render: (row) => row.property?.title || 'Unknown Property',
    },
    {
      id: 'tenantName',
      label: 'Tenant Name',
      render: (row) => row.tenant?.fullName || row.tenant?.email || '—',
    },
    {
      id: 'message',
      label: 'Tenant Message',
      render: (row) => row.message || '—',
    },
    {
      id: 'status',
      label: 'Request Status',
      render: (row) => {
        const status = String(row.status).toLowerCase();
        let color = 'warning';
        let label = 'Pending';
        if (status === 'approved' || status === '1') {
          color = 'success';
          label = 'Approved';
        } else if (status === 'rejected' || status === '2') {
          color = 'error';
          label = 'Rejected';
        }
        return <Chip label={label} color={color} size="small" sx={{ fontWeight: 600 }} />;
      },
    },
    {
      id: 'createdAt',
      label: 'Date Submitted',
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: 'actions',
      label: 'Pipeline Actions',
      render: (row) => {
        const isPending = String(row.status).toLowerCase() === 'pending' || String(row.status) === '0';
        if (!isPending) return <Typography variant="caption" color="textSecondary">Processed</Typography>;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => handleApprove(row)}
            >
              Approve & Draft Lease
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleReject(row.id)}
            >
              Reject
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Lease Request Pipeline
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Review introduction messages and approve requests to transition to lease contract drafting.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader message="Loading requests pipeline..." />
      ) : (
        <DataTable
          columns={columns}
          rows={requests}
          emptyTitle="No tenant applications found"
          emptyDescription="When tenants show interest in your properties, applications will appear here."
        />
      )}
    </Box>
  );
};

export default AgentLeaseRequests;

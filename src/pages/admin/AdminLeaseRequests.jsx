import React, { useState, useEffect } from 'react';
import { Typography, Box, Chip, Alert } from '@mui/material';

import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import leaseRequestService from '../../api/services/leaseRequestService';
import { formatDate } from '../../utils/formatters';

export const AdminLeaseRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await leaseRequestService.getAgentRequests();
        setRequests(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch platform lease request logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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
      label: 'Request Message',
      render: (row) => row.message || '—',
    },
    {
      id: 'status',
      label: 'Status',
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
      label: 'Submitted Date',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Platform Lease Requests Log
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Review application request activity and processing status logs on the platform.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader message="Loading request logs..." />
      ) : (
        <DataTable
          columns={columns}
          rows={requests}
          emptyTitle="No lease requests recorded"
          emptyDescription="Applications submitted by tenants will display here."
        />
      )}
    </Box>
  );
};

export default AdminLeaseRequests;

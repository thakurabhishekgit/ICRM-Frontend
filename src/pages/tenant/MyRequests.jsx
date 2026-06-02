import React, { useState, useEffect } from 'react';
import { Typography, Box, Chip } from '@mui/material';

import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import leaseRequestService from '../../api/services/leaseRequestService';
import { formatDate } from '../../utils/formatters';

export const MyRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await leaseRequestService.getMyRequests();
        setRequests(data || []);
      } catch (err) {
        console.error('Failed to retrieve lease requests:', err);
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
      id: 'location',
      label: 'Location',
      render: (row) => row.property?.location || '—',
    },
    {
      id: 'message',
      label: 'Intro Message',
      render: (row) => row.message || '—',
    },
    {
      id: 'status',
      label: 'Request Status',
      render: (row) => {
        const statusStr = String(row.status).toLowerCase();
        let color = 'warning';
        let label = 'Pending Agent Review';
        
        if (statusStr === 'approved' || statusStr === '1') {
          color = 'success';
          label = 'Approved';
        } else if (statusStr === 'rejected' || statusStr === '2') {
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
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          My Lease Requests
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Track the approval statuses of properties you expressed interest in.
        </Typography>
      </Box>

      {loading ? (
        <Loader message="Fetching requests directory..." />
      ) : (
        <DataTable
          columns={columns}
          rows={requests}
          emptyTitle="No submitted lease requests"
          emptyDescription="Browse commercial listings and select 'Show Interest' or 'Submit Request' to apply."
        />
      )}
    </Box>
  );
};

export default MyRequests;

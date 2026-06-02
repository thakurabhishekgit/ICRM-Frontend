import React, { useState, useEffect } from 'react';
import { Typography, Box, Chip } from '@mui/material';

import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import leaseService from '../../api/services/leaseService';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const MyLeases = () => {
  const [loading, setLoading] = useState(true);
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const data = await leaseService.getMyLeases();
        setLeases(data || []);
      } catch (err) {
        console.error('Failed to retrieve leases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeases();
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
      id: 'monthlyRent',
      label: 'Monthly Rent',
      render: (row) => formatCurrency(row.monthlyRent),
    },
    {
      id: 'securityDeposit',
      label: 'Security Deposit',
      render: (row) => formatCurrency(row.securityDeposit),
    },
    {
      id: 'status',
      label: 'Lease Status',
      render: (row) => {
        const statusStr = String(row.status).toLowerCase();
        let color = 'warning';
        let label = 'Draft';

        if (statusStr === 'active' || statusStr === '1') {
          color = 'success';
          label = 'Active';
        } else if (statusStr === 'expired' || statusStr === '2') {
          color = 'secondary';
          label = 'Expired';
        } else if (statusStr === 'terminated' || statusStr === '3') {
          color = 'error';
          label = 'Terminated';
        }
        return <Chip label={label} color={color} size="small" sx={{ fontWeight: 600 }} />;
      },
    },
    {
      id: 'startDate',
      label: 'Start Date',
      render: (row) => formatDate(row.startDate),
    },
    {
      id: 'endDate',
      label: 'End Date',
      render: (row) => formatDate(row.endDate),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          My Commercial Leases
        </Typography>
        <Typography variant="body2" color="textSecondary">
          View rental rates, safety deposit locks, and lease timelines.
        </Typography>
      </Box>

      {loading ? (
        <Loader message="Fetching lease contracts..." />
      ) : (
        <DataTable
          columns={columns}
          rows={leases}
          emptyTitle="No active leases found"
          emptyDescription="Once a broker approves your request and generates a contract, your lease will display here."
        />
      )}
    </Box>
  );
};

export default MyLeases;

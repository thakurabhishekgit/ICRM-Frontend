import React, { useState, useEffect } from 'react';
import { Typography, Box, Chip, Button, Alert } from '@mui/material';

import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import leaseService from '../../api/services/leaseService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminLeases = () => {
  const [loading, setLoading] = useState(true);
  const [leases, setLeases] = useState([]);
  const [error, setError] = useState('');

  // Termination dialog
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [leaseToTerminate, setLeaseToTerminate] = useState(null);
  const [termLoading, setTermLoading] = useState(false);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const data = await leaseService.getAllLeases();
      setLeases(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch platform lease logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const handleTerminateClick = (id) => {
    setLeaseToTerminate(id);
    setTerminateOpen(true);
  };

  const handleConfirmTerminate = async () => {
    if (!leaseToTerminate) return;
    setTermLoading(true);
    setError('');

    try {
      await leaseService.terminateLease(leaseToTerminate);
      setTerminateOpen(false);
      fetchLeases(); // Refresh list
    } catch (err) {
      console.error(err);
      setError('Failed to terminate lease contract.');
    } finally {
      setTermLoading(false);
      setLeaseToTerminate(null);
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
      label: 'Status',
      render: (row) => {
        const status = String(row.status).toLowerCase();
        let color = 'warning';
        let label = 'Draft';
        if (status === 'active' || status === '1') {
          color = 'success';
          label = 'Active';
        } else if (status === 'expired' || status === '2') {
          color = 'secondary';
          label = 'Expired';
        } else if (status === 'terminated' || status === '3') {
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
    {
      id: 'actions',
      label: 'Audit Action',
      render: (row) => {
        const status = String(row.status).toLowerCase();
        const isActive = status === 'active' || status === '1';
        if (!isActive) return <Typography variant="caption" color="textSecondary">No Actions</Typography>;
        return (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleTerminateClick(row.id)}
          >
            Force Terminate
          </Button>
        );
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Lease Contracts Audit Log
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Review financial parameters, lock status, and execute force terminations on active leases.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader message="Loading contract audits..." />
      ) : (
        <DataTable
          columns={columns}
          rows={leases}
          emptyTitle="No platform lease records"
          emptyDescription="Active lease contracts drafted by agents will display here."
        />
      )}

      {/* Force Terminate Dialog */}
      <ConfirmationDialog
        open={terminateOpen}
        title="Force Terminate Lease Agreement?"
        message="Warning: Force termination is a critical administrative override. This will update the contract status to Terminated immediately."
        confirmText={termLoading ? 'Terminating...' : 'Force Terminate'}
        confirmColor="error"
        onConfirm={handleConfirmTerminate}
        onClose={() => !termLoading && setTerminateOpen(false)}
      />
    </Box>
  );
};

export default AdminLeases;

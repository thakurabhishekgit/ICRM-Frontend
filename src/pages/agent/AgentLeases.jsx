import React, { useState, useEffect } from 'react';
import { Typography, Box, Chip, Button, Alert } from '@mui/material';

import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import leaseService from '../../api/services/leaseService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AgentLeases = () => {
  const [loading, setLoading] = useState(true);
  const [leases, setLeases] = useState([]);
  const [error, setError] = useState('');

  // Dialog State
  const [actionDialog, setActionDialog] = useState({
    open: false,
    leaseId: null,
    actionType: '', // 'activate' | 'expire' | 'terminate'
    title: '',
    message: '',
  });

  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const data = await leaseService.getAgentLeases();
      setLeases(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch assigned leases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const triggerAction = (id, type) => {
    let title = '';
    let message = '';
    
    if (type === 'activate') {
      title = 'Activate Lease Contract?';
      message = 'This will set the lease contract state to Active, indicating the tenant has taken occupancy and rent cycles are starting.';
    } else if (type === 'expire') {
      title = 'Expire Lease Contract?';
      message = 'This will mark the contract as Expired, indicating the contract term has concluded naturally.';
    } else if (type === 'terminate') {
      title = 'Terminate Lease Contract?';
      message = 'Warning: This will terminate the active lease immediately. This action should only be triggered in cases of breach or mutual contract exit.';
    }

    setActionDialog({
      open: true,
      leaseId: id,
      actionType: type,
      title,
      message,
    });
  };

  const handleConfirmAction = async () => {
    const { leaseId, actionType } = actionDialog;
    if (!leaseId) return;

    setError('');
    setActionLoading(true);

    try {
      if (actionType === 'activate') {
        await leaseService.activateLease(leaseId);
      } else if (actionType === 'expire') {
        await leaseService.expireLease(leaseId);
      } else if (actionType === 'terminate') {
        await leaseService.terminateLease(leaseId);
      }
      
      setActionDialog({ open: false, leaseId: null, actionType: '', title: '', message: '' });
      fetchLeases(); // Refresh list
    } catch (err) {
      console.error(err);
      setError(`Failed to perform '${actionType}' operation on the selected lease.`);
    } finally {
      setActionLoading(false);
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
      label: 'Actions',
      render: (row) => {
        const status = String(row.status).toLowerCase();
        
        // Draft state or 0
        if (status === 'draft' || status === '0') {
          return (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => triggerAction(row.id, 'activate')}
            >
              Activate
            </Button>
          );
        }

        // Active state or 1
        if (status === 'active' || status === '1') {
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={() => triggerAction(row.id, 'expire')}
              >
                Expire
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => triggerAction(row.id, 'terminate')}
              >
                Terminate
              </Button>
            </Box>
          );
        }

        // Expired/Terminated (no actions)
        return <Typography variant="caption" color="textSecondary">No Actions</Typography>;
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Lease Contracts Manager
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Track leasing states and transition drafts to active occupancies or run premature terminations.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader message="Loading leases catalogue..." />
      ) : (
        <DataTable
          columns={columns}
          rows={leases}
          emptyTitle="No leases registered"
          emptyDescription="Listings under lease agreements will show here. Check the request pipeline to begin."
        />
      )}

      {/* Confirmation Lifecycle Modals */}
      <ConfirmationDialog
        open={actionDialog.open}
        title={actionDialog.title}
        message={actionDialog.message}
        confirmText={actionLoading ? 'Processing...' : 'Confirm'}
        confirmColor={actionDialog.actionType === 'terminate' ? 'error' : 'primary'}
        onConfirm={handleConfirmAction}
        onClose={() => !actionLoading && setActionDialog({ ...actionDialog, open: false })}
      />
    </Box>
  );
};

export default AgentLeases;

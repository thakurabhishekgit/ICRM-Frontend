import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, Alert, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import userService from '../../api/services/userService';
import authService from '../../api/services/authService'; // We can import authService or write context link
import { getRoleLabel } from '../../utils/formatters';

export const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit User Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: '',
  });
  const [editLoading, setEditLoading] = useState(false);

  // Create Admin Agent State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch the registered user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'Tenant',
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        id: selectedUser.id,
        fullName: editForm.fullName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        role: editForm.role,
        createdAt: selectedUser.createdAt || new Date().toISOString(),
      };

      await userService.updateUser(selectedUser.id, payload);
      setSuccess('User details successfully updated.');
      setEditDialogOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to update user configurations.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, phoneNumber } = createForm;
    if (!fullName || !email || !password || !phoneNumber) {
      setError('All fields are required to register an admin agent.');
      return;
    }

    setCreateLoading(true);
    setError('');
    setSuccess('');

    try {
      // Call endpoint to register an admin agent
      // Typically: /api/Auth/create-agent-with-admin-role
      await userService.updateUser; // verify endpoints
      // Let's call /api/Auth/create-agent-with-admin-role directly via axios or authService
      const authInstance = (await import('../../api/axiosConfig')).default;
      await authInstance.post('/api/Auth/create-agent-with-admin-role', {
        fullName,
        email,
        password,
        phoneNumber,
        role: 2, // admin
      });

      setSuccess('Admin Agent successfully registered!');
      setCreateDialogOpen(false);
      setCreateForm({ fullName: '', email: '', password: '', phoneNumber: '' });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to create Admin Agent.');
    } finally {
      setCreateLoading(false);
    }
  };

  const columns = [
    {
      id: 'fullName',
      label: 'Full Name',
      render: (row) => row.fullName || '—',
    },
    {
      id: 'email',
      label: 'Email Address',
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      render: (row) => row.phoneNumber || '—',
    },
    {
      id: 'role',
      label: 'Platform Role',
      render: (row) => {
        const roleStr = String(row.role).toLowerCase();
        let color = 'primary';
        if (roleStr === 'admin' || roleStr === '2') {
          color = 'error';
        } else if (roleStr === 'agent' || roleStr === '1') {
          color = 'secondary';
        }
        return <Chip label={getRoleLabel(row.role)} color={color} size="small" sx={{ fontWeight: 600 }} />;
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button size="small" variant="outlined" onClick={() => handleEditClick(row)}>
          Configure
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            User Directory Control
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Audit platform registration lists and adjust credentials.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Admin Agent
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Loader message="Loading registered users directory..." />
      ) : (
        <DataTable
          columns={columns}
          rows={users}
          emptyTitle="No platform users found"
          emptyDescription="User listings registered on the platform will display here."
        />
      )}

      {/* Edit User Modal */}
      <Dialog open={editDialogOpen} onClose={() => !editLoading && setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Configure User Credentials</DialogTitle>
        <Box component="form" onSubmit={handleEditSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              required
              fullWidth
              label="Full Name"
              value={editForm.fullName}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              disabled={editLoading}
            />
            <TextField
              required
              fullWidth
              label="Email Address"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              disabled={editLoading}
            />
            <TextField
              required
              fullWidth
              label="Phone Number"
              value={editForm.phoneNumber}
              onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
              disabled={editLoading}
            />
            <FormControl fullWidth required>
              <InputLabel id="edit-role-label">System Role</InputLabel>
              <Select
                labelId="edit-role-label"
                id="edit-role"
                value={editForm.role}
                label="System Role"
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                disabled={editLoading}
              >
                <MenuItem value="Tenant">Tenant</MenuItem>
                <MenuItem value="Agent">Property Agent</MenuItem>
                <MenuItem value="Admin">System Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setEditDialogOpen(false)} disabled={editLoading} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Update Details'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Create Admin Agent Modal */}
      <Dialog open={createDialogOpen} onClose={() => !createLoading && setCreateDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Register Admin Agent</DialogTitle>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              required
              fullWidth
              label="Full Name"
              value={createForm.fullName}
              onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
              disabled={createLoading}
            />
            <TextField
              required
              fullWidth
              label="Email Address"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              disabled={createLoading}
            />
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              disabled={createLoading}
              helperText="Min 6 characters"
            />
            <TextField
              required
              fullWidth
              label="Phone Number"
              value={createForm.phoneNumber}
              onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
              disabled={createLoading}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setCreateDialogOpen(false)} disabled={createLoading} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="error" disabled={createLoading}>
              {createLoading ? 'Registering...' : 'Register Admin'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, IconButton, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TimelineIcon from '@mui/icons-material/Timeline';
import PageHeader from '../../components/dashboard/PageHeader';
import AdminDataTable from '../../components/enterprise/AdminDataTable';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import userService from '../../api/services/userService';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    userService.getAllUsers()
      .then(setUsers)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const tableRows = users.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phoneNumber: u.phoneNumber,
    role: u.role,
    createdAt: u.createdAt,
  }));

  const columns = [
    { id: 'fullName', label: 'Full Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'phoneNumber', label: 'Phone Number' },
    { id: 'role', label: 'Role', render: (row) => <Chip label={row.role} size="small" variant="outlined" /> },
    { id: 'createdAt', label: 'Created Date', render: (row) => formatDate(row.createdAt), sortable: true },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => navigate(`/admin/users/${row.id}`)} title="View"><VisibilityIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => navigate(`/admin/users/${row.id}?edit=1`)} title="Edit"><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)} title="Delete"><DeleteIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => navigate(`/admin/users/${row.id}`)} title="Activity"><TimelineIcon fontSize="small" /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title="User Management" subtitle="Manage platform users, roles, and access." />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <AdminDataTable
        columns={columns}
        rows={tableRows}
        loading={loading}
        searchKeys={['fullName', 'email', 'role']}
        searchPlaceholder="Search users..."
        emptyTitle="No users found"
        emptyDescription="Registered users will appear here."
        onExport={() => showToast('Export will be available in a future release', 'info')}
      />
      <ConfirmationDialog
        open={Boolean(deleteId)}
        title="Delete User?"
        message="The backend does not expose DELETE /api/User yet. This action is not available."
        confirmText="Understood"
        onConfirm={() => { setDeleteId(null); showToast('Delete user API not available yet', 'warning'); }}
        onClose={() => setDeleteId(null)}
      />
    </Box>
  );
};

export default AdminUsers;

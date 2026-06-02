import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Button, Alert, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../../components/dashboard/PageHeader';
import UserProfileCard from '../../components/enterprise/UserProfileCard';
import ActivityTimeline from '../../components/enterprise/ActivityTimeline';
import Loader from '../../components/Loader';
import userService from '../../api/services/userService';
import propertyService from '../../api/services/propertyService';
import { getUserActivityStats, getAllLeaseRequests, getAllLeases } from '../../services/adminService';
import { buildUserActivity } from '../../services/activityService';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { colors } from '../../theme/theme';

const AdminUserDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const editMode = searchParams.get('edit') === '1';

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      userService.getUserById(id),
      getAllLeaseRequests(),
      getAllLeases(),
      propertyService.getAllProperties(),
    ])
      .then(async ([u, requests, leases, properties]) => {
        setUser(u);
        setForm({ fullName: u.fullName, email: u.email, phoneNumber: u.phoneNumber, role: u.role, createdAt: u.createdAt, id: u.id });
        const activityStats = await getUserActivityStats(u);
        setStats(activityStats);
        setActivity(buildUserActivity(u, { requests, leases, properties }));
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateUser(id, form);
      showToast('User updated successfully');
      navigate(`/admin/users/${id}`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading user..." />;
  if (!user) return <Alert severity="error">{error || 'User not found'}</Alert>;

  const statLabels = Object.fromEntries(
    Object.entries(stats).map(([k, v]) => [
      k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      v,
    ])
  );

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/users')} sx={{ mb: 2 }}>Back to Users</Button>
      <PageHeader title={user.fullName} subtitle={`${user.role} · ${user.email}`} />
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {editMode ? (
        <Paper sx={{ p: 3, maxWidth: 560, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Phone" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} /></Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <MenuItem value="Tenant">Tenant</MenuItem>
                  <MenuItem value="Agent">Agent</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              <Button onClick={() => navigate(`/admin/users/${id}`)}>Cancel</Button>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Box sx={{ mb: 3 }}><UserProfileCard user={user} stats={statLabels} /></Box>
      )}

      <ActivityTimeline items={activity} title="User Activity" emptyMessage="No activity recorded for this user yet." />
    </Box>
  );
};

export default AdminUserDetails;

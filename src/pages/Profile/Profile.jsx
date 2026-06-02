import { useState, useEffect } from 'react';
import {
  Avatar, Box, Button, Chip, Divider, Paper, TextField, Typography, alpha, Grid, Alert,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PageHeader from '../../components/dashboard/PageHeader';
import Loader from '../../components/Loader';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { getDashboardPath } from '../../utils/roleRoutes';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import { colors } from '../../theme/theme';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  useEffect(() => {
    setForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
  }, [user]);

  const initials = user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateUser(form);
      showToast('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update profile.'));
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <Loader message="Loading profile..." />;

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Manage your account information."
        breadcrumbs={[{ label: 'Dashboard', to: getDashboardPath(user?.role) }, { label: 'Profile' }]}
      />

      <Paper sx={{ maxWidth: 720, p: { xs: 3, md: 4 }, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar sx={{ width: 72, height: 72, fontSize: '1.5rem', fontWeight: 700, bgcolor: colors.primary }}>{initials}</Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{user?.fullName}</Typography>
            <Chip label={user?.role} size="small" sx={{ mt: 1 }} color="primary" variant="outlined" />
          </Box>
        </Box>

        <Divider sx={{ borderColor: colors.border, mb: 3 }} />

        {editing ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} disabled={saving} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={saving} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} disabled={saving} /></Grid>
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              <Button onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              ['Full Name', user?.fullName],
              ['Email', user?.email],
              ['Phone Number', user?.phoneNumber || '—'],
              ['Role', user?.role],
            ].map(([label, value]) => (
              <Box key={label} sx={{ p: 2, borderRadius: 2, bgcolor: alpha(colors.surface, 0.6), border: `1px solid ${colors.border}` }}>
                <Typography variant="caption" sx={{ color: colors.textSecondary, textTransform: 'uppercase' }}>{label}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
              </Box>
            ))}
            <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => setEditing(true)} sx={{ alignSelf: 'flex-start', mt: 1 }}>
              Edit Profile
            </Button>
          </Box>
        )}

        <Divider sx={{ borderColor: colors.border, my: 4 }} />

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Change Password</Typography>
        {showPassword ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}><TextField fullWidth type="password" label="Current Password" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth type="password" label="New Password" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth type="password" label="Confirm Password" /></Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="contained" onClick={() => { showToast('Change password API not available yet', 'info'); setShowPassword(false); }}>Update Password</Button>
              <Button sx={{ ml: 1 }} onClick={() => setShowPassword(false)}>Cancel</Button>
            </Grid>
          </Grid>
        ) : (
          <Button variant="outlined" startIcon={<LockOutlinedIcon />} onClick={() => setShowPassword(true)}>Change Password</Button>
        )}
      </Paper>
    </>
  );
};

export default Profile;

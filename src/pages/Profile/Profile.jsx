import { useState } from 'react';
import {
  Avatar, Box, Button, Chip, Divider, Paper, TextField, Typography, alpha, Grid,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PageHeader from '../../components/dashboard/PageHeader';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { getDashboardPath } from '../../utils/roleRoutes';
import { colors } from '../../theme/theme';

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const initials = user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSave = () => {
    showToast('Profile update API coming soon — changes saved locally for preview', 'info');
    setEditing(false);
  };

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Manage your account information."
        breadcrumbs={[{ label: 'Dashboard', to: getDashboardPath(user?.role) }, { label: 'Profile' }]}
      />

      <Paper sx={{ maxWidth: 720, p: { xs: 3, md: 4 }, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
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
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} /></Grid>
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSave}>Save</Button>
              <Button onClick={() => setEditing(false)}>Cancel</Button>
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

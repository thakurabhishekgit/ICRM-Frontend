import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, TextField, Button, Alert, Avatar, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';

import useAuth from '../hooks/useAuth';
import userService from '../api/services/userService';
import Loader from '../components/Loader';
import { getRoleLabel } from '../utils/formatters';

export const Profile = () => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: '',
    createdAt: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const data = await userService.getUserById(user.id);
        if (data) {
          setProfile({
            fullName: data.fullName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            role: data.role || '',
            createdAt: data.createdAt || '',
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile details from server.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.fullName || !profile.email || !profile.phoneNumber) {
      setError('Please complete all profile details.');
      return;
    }

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = {
        id: user.id,
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        role: profile.role,
        createdAt: profile.createdAt || new Date().toISOString(),
      };

      await userService.updateUser(user.id, payload);
      setSuccess('Your profile was updated successfully.');
      
      // Update local storage session values
      const sessionUser = JSON.parse(localStorage.getItem('ircm_user') || '{}');
      sessionUser.fullName = profile.fullName;
      sessionUser.email = profile.email;
      localStorage.setItem('ircm_user', JSON.stringify(sessionUser));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching profile details..." />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Account Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Info Left Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2 }}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 80, height: 80, mx: 'auto', mb: 2, fontSize: '2rem', fontWeight: 600 }}>
              {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {profile.fullName}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              {getRoleLabel(profile.role)}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'left', mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <BadgeIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>User ID: {user?.id.substring(0, 8)}...</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <MailOutlineIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{profile.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{profile.phoneNumber || 'No phone listed'}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Form Right Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Personal Credentials
            </Typography>

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

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    disabled={saving}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={saving}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    value={profile.phoneNumber}
                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    disabled={saving}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Platform Role"
                    value={getRoleLabel(profile.role)}
                    disabled
                    helperText="Platform roles cannot be changed by the user."
                  />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button type="submit" variant="contained" disabled={saving} size="large">
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

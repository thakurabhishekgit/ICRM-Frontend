import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Paper, Box, Typography, TextField, Button, Alert,
  CircularProgress, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import useAuth from '../hooks/useAuth';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Tenant'); // Default: Tenant
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !phoneNumber || !role) {
      setError('Please fill in all registration fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(fullName, email, password, phoneNumber, role);
      navigate('/login?registered=true');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed. This email may already be in use.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#1976d210', color: '#1976d2', mb: 2 }}>
            <BusinessIcon fontSize="large" />
          </Box>
          <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#0f172a' }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Join the IRCM Commercial Platform
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-select-label">Register As</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label="Register As"
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="Tenant">Commercial Tenant (Browse & Lease Units)</MenuItem>
              <MenuItem value="Agent">Property Broker/Agent (Manage & Draft Leases)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, height: 48 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 600, color: '#1976d2' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;

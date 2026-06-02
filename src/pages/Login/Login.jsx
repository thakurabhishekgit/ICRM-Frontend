import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link,
  alpha,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/theme';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setError('Your session has expired. Please sign in again.');
    }
    if (params.get('registered') === 'true') {
      setSuccessMsg('Registration successful! Please sign in with your credentials.');
    }
  }, [location.search]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, location.state]);

  const emailError = touched.email && !emailRegex.test(email) ? 'Enter a valid email address' : '';
  const passwordError = touched.password && password.length < 6 ? 'Password must be at least 6 characters' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError('');
    setSuccessMsg('');

    if (!emailRegex.test(email) || password.length < 6) {
      setError('Please fix the errors below.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password. Please try again.';
      setError(typeof message === 'string' ? message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 440,
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        bgcolor: alpha(colors.card, 0.8),
        backdropFilter: 'blur(12px)',
        border: `1px solid ${colors.border}`,
        boxShadow: `0 24px 48px ${alpha('#000', 0.35)}`,
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, mb: 0.5, color: colors.textPrimary }}
      >
        Welcome back
      </Typography>
      <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
        Sign in to your IRCM account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        error={Boolean(emailError)}
        helperText={emailError}
        margin="normal"
        autoComplete="email"
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        error={Boolean(passwordError)}
        helperText={passwordError}
        margin="normal"
        autoComplete="current-password"
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </Button>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: colors.textSecondary }}>
        Don&apos;t have an account?{' '}
        <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
          Create Account
        </Link>
      </Typography>
    </Paper>
  );
};

export default Login;

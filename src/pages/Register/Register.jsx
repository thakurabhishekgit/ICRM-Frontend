import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
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
import { getDashboardPath } from '../../utils/roleRoutes';
import { colors } from '../../theme/theme';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[\d\s-]{10,15}$/;

const Register = () => {
  const { register, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const errors = {
    fullName: touched.fullName && form.fullName.trim().length < 2 ? 'Enter your full name' : '',
    email: touched.email && !emailRegex.test(form.email) ? 'Enter a valid email address' : '',
    phoneNumber: touched.phoneNumber && !phoneRegex.test(form.phoneNumber.replace(/\s/g, ''))
      ? 'Enter a valid phone number (10–15 digits)'
      : '',
    password:
      touched.password && form.password.length < 8
        ? 'Password must be at least 8 characters'
        : touched.password && !/(?=.*[A-Z])(?=.*\d)/.test(form.password)
          ? 'Include at least one uppercase letter and one number'
          : '',
  };

  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { fullName: true, email: true, phoneNumber: true, password: true };
    setTouched(allTouched);
    setError('');

    const hasError =
      form.fullName.trim().length < 2 ||
      !emailRegex.test(form.email) ||
      !phoneRegex.test(form.phoneNumber.replace(/\s/g, '')) ||
      form.password.length < 8 ||
      !/(?=.*[A-Z])(?=.*\d)/.test(form.password);

    if (hasError) {
      setError('Please fix the errors below.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber.replace(/\s/g, ''),
      });
      navigate('/login?registered=true', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setError(typeof message === 'string' ? message : 'Registration failed. Please try again.');
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
        Create account
      </Typography>
      <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
        Start managing commercial real estate with IRCM
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Full Name"
        value={form.fullName}
        onChange={setField('fullName')}
        onBlur={handleBlur('fullName')}
        error={Boolean(errors.fullName)}
        helperText={errors.fullName}
        margin="normal"
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={form.email}
        onChange={setField('email')}
        onBlur={handleBlur('email')}
        error={Boolean(errors.email)}
        helperText={errors.email}
        margin="normal"
        autoComplete="email"
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Phone Number"
        value={form.phoneNumber}
        onChange={setField('phoneNumber')}
        onBlur={handleBlur('phoneNumber')}
        error={Boolean(errors.phoneNumber)}
        helperText={errors.phoneNumber}
        margin="normal"
        autoComplete="tel"
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={form.password}
        onChange={setField('password')}
        onBlur={handleBlur('password')}
        error={Boolean(errors.password)}
        helperText={errors.password || 'Min. 8 characters with uppercase and number'}
        margin="normal"
        autoComplete="new-password"
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
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
      </Button>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: colors.textSecondary }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
          Login
        </Link>
      </Typography>
    </Paper>
  );
};

export default Register;

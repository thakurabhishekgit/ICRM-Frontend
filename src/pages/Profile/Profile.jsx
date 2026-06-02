import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
  alpha,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PageHeader from '../../components/dashboard/PageHeader';
import useAuth from '../../hooks/useAuth';
import { getDashboardPath } from '../../utils/roleRoutes';
import { colors } from '../../theme/theme';

const Profile = () => {
  const { user } = useAuth();

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Your account information and role on the IRCM platform."
        breadcrumbs={[
          { label: 'Dashboard', to: getDashboardPath(user?.role) },
          { label: 'Profile' },
        ]}
      />

      <Paper
        elevation={0}
        sx={{
          maxWidth: 640,
          p: { xs: 3, md: 4 },
          bgcolor: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              fontSize: '1.5rem',
              fontWeight: 700,
              bgcolor: colors.primary,
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
              {user?.fullName || '—'}
            </Typography>
            <Chip label={user?.role || '—'} size="small" sx={{ mt: 1 }} color="primary" variant="outlined" />
          </Box>
        </Box>

        <Divider sx={{ borderColor: colors.border, mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <ProfileRow icon={BadgeOutlinedIcon} label="Full Name" value={user?.fullName} />
          <ProfileRow icon={EmailOutlinedIcon} label="Email" value={user?.email} />
          <ProfileRow icon={PhoneOutlinedIcon} label="Phone Number" value={user?.phoneNumber || '—'} />
          <ProfileRow icon={BadgeOutlinedIcon} label="Role" value={user?.role} />
        </Box>

        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          sx={{ mt: 4 }}
          disabled
          title="Edit profile will be available in a future phase"
        >
          Edit Profile
        </Button>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: colors.textSecondary }}>
          Profile editing UI only — API integration coming later.
        </Typography>
      </Paper>
    </>
  );
};

const ProfileRow = ({ icon: Icon, label, value }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      borderRadius: 2,
      bgcolor: alpha(colors.surface, 0.6),
      border: `1px solid ${colors.border}`,
    }}
  >
    <Icon sx={{ color: colors.primaryLight }} />
    <Box>
      <Typography variant="caption" sx={{ color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Box>
  </Box>
);

export default Profile;

import { Avatar, Box, Chip, Paper, Typography, alpha } from '@mui/material';
import { colors } from '../../theme/theme';
import { formatDate } from '../../utils/formatters';

const UserProfileCard = ({ user, stats = {} }) => {
  const initials = user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <Paper sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: colors.primary, fontWeight: 700, fontSize: '1.25rem' }}>{initials}</Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>{user.fullName}</Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>{user.email}</Typography>
          <Chip label={user.role} size="small" sx={{ mt: 1 }} color="primary" variant="outlined" />
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Info label="Phone" value={user.phoneNumber || '—'} />
        <Info label="Joined" value={formatDate(user.createdAt)} />
        {Object.entries(stats).map(([k, v]) => (
          <Info key={k} label={k.replace(/([A-Z])/g, ' $1')} value={v} />
        ))}
      </Box>
    </Paper>
  );
};

const Info = ({ label, value }) => (
  <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(colors.surface, 0.6), border: `1px solid ${colors.border}` }}>
    <Typography variant="caption" sx={{ color: colors.textSecondary, textTransform: 'uppercase' }}>{label}</Typography>
    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>{value}</Typography>
  </Box>
);

export default UserProfileCard;

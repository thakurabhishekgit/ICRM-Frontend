import { Box, Typography, alpha } from '@mui/material';
import GlassCard from '../ui/GlassCard';
import { colors } from '../../theme/theme';

const StatCard = ({ title, value, icon: Icon, accent = colors.primary, trend }) => (
  <GlassCard sx={{ p: 3, height: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography
          variant="overline"
          sx={{ color: colors.textSecondary, fontWeight: 600, letterSpacing: '0.08em' }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: colors.textPrimary, mt: 0.5, fontFamily: '"Outfit", sans-serif' }}
        >
          {value}
        </Typography>
        {trend && (
          <Typography variant="caption" sx={{ color: colors.success, mt: 1, display: 'block' }}>
            {trend}
          </Typography>
        )}
      </Box>
      {Icon && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(accent, 0.12),
            color: accent,
            border: `1px solid ${alpha(accent, 0.25)}`,
          }}
        >
          <Icon />
        </Box>
      )}
    </Box>
  </GlassCard>
);

export default StatCard;

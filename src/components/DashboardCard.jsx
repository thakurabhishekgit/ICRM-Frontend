import { Box, Typography, alpha } from '@mui/material';
import GlassCard from './ui/GlassCard';
import { colors } from '../theme/theme';

const DashboardCard = ({ title, value, icon: Icon, accent = colors.primary, description, children }) => (
  <GlassCard sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: children ? 2 : 0 }}>
      <Box>
        <Typography
          variant="overline"
          sx={{ color: colors.textSecondary, fontWeight: 600, letterSpacing: '0.08em' }}
        >
          {title}
        </Typography>
        {value !== undefined && (
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: colors.textPrimary, mt: 0.5, fontFamily: '"Outfit", sans-serif' }}
          >
            {value}
          </Typography>
        )}
        {description && (
          <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 1, display: 'block' }}>
            {description}
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
    {children && <Box sx={{ flexGrow: 1 }}>{children}</Box>}
  </GlassCard>
);

export default DashboardCard;

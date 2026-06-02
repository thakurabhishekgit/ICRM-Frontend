import { Box, Typography } from '@mui/material';
import { colors } from '../../theme/theme';

const ChartCard = ({ title, subtitle, children, height = 280 }) => (
  <Box sx={{ p: 3, bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3, height: '100%' }}>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: subtitle ? 0.5 : 2 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>{subtitle}</Typography>}
    <Box sx={{ width: '100%', height }}>{children}</Box>
  </Box>
);

export default ChartCard;

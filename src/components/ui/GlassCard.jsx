import { Card, alpha } from '@mui/material';
import { colors } from '../../theme/theme';

const GlassCard = ({ children, sx = {}, ...props }) => (
  <Card
    elevation={0}
    sx={{
      bgcolor: alpha(colors.card, 0.65),
      backdropFilter: 'blur(12px)',
      border: `1px solid ${alpha(colors.border, 0.8)}`,
      borderRadius: 3,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        borderColor: alpha(colors.primary, 0.4),
        boxShadow: `0 20px 40px ${alpha('#000', 0.4)}, 0 0 0 1px ${alpha(colors.primary, 0.15)}`,
      },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Card>
);

export default GlassCard;

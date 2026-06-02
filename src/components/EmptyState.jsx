import { Box, Typography, Button } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { colors } from '../theme/theme';

const EmptyState = ({ title = 'No data yet', description, actionLabel, onAction, icon: Icon = InboxOutlinedIcon }) => (
  <Box
    sx={{
      py: 8,
      px: 3,
      textAlign: 'center',
      borderRadius: 3,
      border: `1px dashed ${colors.border}`,
      bgcolor: colors.surface,
    }}
  >
    <Icon sx={{ fontSize: 56, color: colors.textSecondary, mb: 2, opacity: 0.6 }} />
    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 1 }}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" sx={{ color: colors.textSecondary, maxWidth: 400, mx: 'auto', mb: 3 }}>
        {description}
      </Typography>
    )}
    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;

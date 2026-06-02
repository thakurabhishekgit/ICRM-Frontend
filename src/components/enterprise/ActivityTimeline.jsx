import { Box, Typography, alpha } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArticleIcon from '@mui/icons-material/Article';
import { colors } from '../../theme/theme';

const ICONS = {
  register: PersonAddIcon,
  property: HomeWorkIcon,
  request: ListAltIcon,
  approved: CheckCircleIcon,
  rejected: CancelIcon,
  lease: ArticleIcon,
  active: CheckCircleIcon,
};

const ActivityTimeline = ({ items = [], title = 'Recent Activity', emptyMessage = 'No recent activity yet.' }) => (
  <Box sx={{ bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3, p: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>{title}</Typography>
    {!items.length ? (
      <Typography variant="body2" sx={{ color: colors.textSecondary }}>{emptyMessage}</Typography>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((item, index) => {
          const Icon = ICONS[item.type] || ListAltIcon;
          return (
            <Box key={item.id} sx={{ display: 'flex', gap: 2, position: 'relative', pb: index < items.length - 1 ? 3 : 0 }}>
              {index < items.length - 1 && (
                <Box sx={{ position: 'absolute', left: 19, top: 40, bottom: 0, width: 2, bgcolor: colors.border }} />
              )}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(colors.primary, 0.15),
                  color: colors.primaryLight,
                  border: `1px solid ${alpha(colors.primary, 0.3)}`,
                  zIndex: 1,
                }}
              >
                <Icon fontSize="small" />
              </Box>
              <Box sx={{ flex: 1, pt: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.textPrimary }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.25 }}>{item.description}</Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 0.5, display: 'block' }}>
                  {item.time}{item.dateTime ? ` · ${item.dateTime}` : ''}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    )}
  </Box>
);

export default ActivityTimeline;

import { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, alpha } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { colors } from '../../theme/theme';

const DUMMY_NOTIFICATIONS = [
  { id: '1', text: 'New lease request received', time: '5m ago' },
  { id: '2', text: 'Property listing approved', time: '1h ago' },
  { id: '3', text: 'Monthly report is ready', time: '2h ago' },
];

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          color: colors.textSecondary,
          border: `1px solid ${colors.border}`,
          '&:hover': { bgcolor: alpha(colors.primary, 0.08), color: colors.primaryLight },
        }}
      >
        <Badge badgeContent={3} color="primary">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            bgcolor: colors.card,
            border: `1px solid ${colors.border}`,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${colors.border}` }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
        </Box>
        {DUMMY_NOTIFICATIONS.map((n) => (
          <MenuItem key={n.id} onClick={() => setAnchorEl(null)} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="body2" sx={{ color: colors.textPrimary }}>
              {n.text}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              {n.time}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationBell;

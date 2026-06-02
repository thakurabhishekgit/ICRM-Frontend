import { useState } from 'react';
import {
  IconButton, Badge, Popover, Box, Typography, Button, List, ListItemButton, ListItemText, Divider, alpha,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNotifications } from '../../context/NotificationContext';
import { colors } from '../../theme/theme';

const NotificationPanel = () => {
  const { notifications, unreadCount, markAllRead, markRead, refreshNotifications, loading } = useNotifications();
  const [anchor, setAnchor] = useState(null);

  const handleOpen = (e) => {
    setAnchor(e.currentTarget);
    refreshNotifications();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: colors.textSecondary,
          border: `1px solid ${colors.border}`,
          '&:hover': { bgcolor: alpha(colors.primary, 0.08), color: colors.primaryLight },
        }}
      >
        <Badge badgeContent={unreadCount} color="primary">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 360, maxHeight: 420, bgcolor: colors.card, border: `1px solid ${colors.border}`, mt: 1 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Notifications</Typography>
          <Button size="small" onClick={markAllRead}>Mark all read</Button>
        </Box>
        <Divider sx={{ borderColor: colors.border }} />
        <List dense sx={{ py: 0 }}>
          {loading && notifications.length === 0 && (
            <Typography variant="body2" sx={{ p: 2, color: colors.textSecondary }}>Loading...</Typography>
          )}
          {!loading && notifications.length === 0 && (
            <Typography variant="body2" sx={{ p: 2, color: colors.textSecondary }}>No notifications yet.</Typography>
          )}
          {notifications.map((n) => (
            <ListItemButton key={n.id} onClick={() => markRead(n.id)} sx={{ bgcolor: n.read ? 'transparent' : alpha(colors.primary, 0.06) }}>
              <ListItemText
                primary={<Typography variant="body2" sx={{ fontWeight: n.read ? 500 : 700 }}>{n.title}</Typography>}
                secondary={
                  <>
                    <Typography variant="caption" sx={{ display: 'block', color: colors.textSecondary }}>{n.message}</Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      {n.time}{n.dateTime ? ` · ${n.dateTime}` : ''}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default NotificationPanel;

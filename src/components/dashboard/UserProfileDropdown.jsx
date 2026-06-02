import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/theme';

const roleLabels = {
  tenant: 'Tenant',
  agent: 'Property Agent',
  admin: 'System Administrator',
};

const UserProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const roleKey = String(user?.role ?? '').toLowerCase();

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          px: 1,
          py: 0.5,
          borderRadius: 2,
          '&:hover': { bgcolor: `${colors.primary}14` },
        }}
      >
        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textPrimary, lineHeight: 1.2 }}>
            {user?.fullName}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            {roleLabels[roleKey] || user?.role}
          </Typography>
        </Box>
        <IconButton sx={{ p: 0 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: colors.primary,
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            bgcolor: colors.card,
            border: `1px solid ${colors.border}`,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate('/profile');
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: colors.textSecondary }} />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>
          <ListItemIcon><SettingsIcon fontSize="small" sx={{ color: colors.textSecondary }} /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider sx={{ borderColor: colors.border }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: colors.textSecondary }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfileDropdown;

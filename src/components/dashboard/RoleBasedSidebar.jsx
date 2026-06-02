import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AddHomeIcon from '@mui/icons-material/AddHome';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/theme';
import { normalizeRole } from '../../utils/roleRoutes';

export const DRAWER_WIDTH_EXPANDED = 260;
export const DRAWER_WIDTH_COLLAPSED = 76;

const NAV_BY_ROLE = {
  tenant: [
    { text: 'Dashboard', icon: DashboardIcon, path: '/tenant/dashboard' },
    { text: 'Browse Properties', icon: SearchIcon, path: '/properties' },
    { text: 'My Requests', icon: ListAltIcon, path: '/tenant/requests' },
    { text: 'My Leases', icon: ArticleIcon, path: '/tenant/leases' },
    { text: 'Profile', icon: PersonIcon, path: '/profile' },
  ],
  agent: [
    { text: 'Dashboard', icon: DashboardIcon, path: '/agent/dashboard' },
    { text: 'My Properties', icon: HomeWorkIcon, path: '/agent/properties' },
    { text: 'Add Property', icon: AddHomeIcon, path: '/agent/properties/create' },
    { text: 'Lease Requests', icon: ListAltIcon, path: '/agent/requests' },
    { text: 'Leases', icon: ArticleIcon, path: '/agent/leases' },
    { text: 'Profile', icon: PersonIcon, path: '/profile' },
  ],
  admin: [
    { text: 'Dashboard', icon: DashboardIcon, path: '/admin/dashboard' },
    { text: 'Users', icon: PeopleIcon, path: '/admin/users' },
    { text: 'Properties', icon: HomeWorkIcon, path: '/admin/properties' },
    { text: 'Lease Requests', icon: ListAltIcon, path: '/admin/lease-requests' },
    { text: 'Leases', icon: ArticleIcon, path: '/admin/leases' },
    { text: 'Analytics', icon: BarChartIcon, path: '/admin/analytics' },
    { text: 'Profile', icon: PersonIcon, path: '/profile' },
  ],
};

const RoleBasedSidebar = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  isMobile,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = normalizeRole(user?.role);
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.tenant;
  const width = collapsed && !isMobile ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onMobileClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/profile') return location.pathname === '/profile';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: colors.surface,
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      <Box
        sx={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
          px: collapsed && !isMobile ? 1 : 2.5,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {(!collapsed || isMobile) && (
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              background: `linear-gradient(90deg, #fff, ${colors.textSecondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IRCM
          </Typography>
        )}
        {!isMobile && (
          <IconButton size="small" onClick={onToggleCollapse} sx={{ color: colors.textSecondary }}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>

      <List sx={{ flexGrow: 1, py: 2, px: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const button = (
            <ListItemButton
              onClick={() => handleNav(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                minHeight: 48,
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                bgcolor: active ? alpha(colors.primary, 0.15) : 'transparent',
                color: active ? colors.primaryLight : colors.textSecondary,
                '&:hover': {
                  bgcolor: active ? alpha(colors.primary, 0.2) : alpha(colors.primary, 0.06),
                  color: colors.textPrimary,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed && !isMobile ? 0 : 40,
                  color: 'inherit',
                  justifyContent: 'center',
                }}
              >
                <Icon fontSize="small" />
              </ListItemIcon>
              {(!collapsed || isMobile) && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500 }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
              {collapsed && !isMobile ? (
                <Tooltip title={item.text} placement="right">
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 1, borderTop: `1px solid ${colors.border}` }}>
        {collapsed && !isMobile ? (
          <Tooltip title="Logout" placement="right">
            <IconButton onClick={handleLogout} sx={{ width: '100%', color: colors.textSecondary }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: colors.textSecondary,
              '&:hover': { bgcolor: alpha('#ef4444', 0.1), color: '#f87171' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
          </ListItemButton>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH_EXPANDED,
            boxSizing: 'border-box',
            bgcolor: colors.surface,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          transition: 'width 0.25s ease',
          overflowX: 'hidden',
          bgcolor: colors.surface,
          border: 'none',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default RoleBasedSidebar;

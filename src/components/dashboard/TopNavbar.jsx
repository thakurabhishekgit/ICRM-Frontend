import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationPanel from '../enterprise/NotificationPanel';
import GlobalSearch from '../enterprise/GlobalSearch';
import UserProfileDropdown from './UserProfileDropdown';
import useAuth from '../../hooks/useAuth';
import { normalizeRole } from '../../utils/roleRoutes';
import { colors } from '../../theme/theme';

const TopNavbar = ({ title, onMenuClick, sidebarWidth }) => {
  const { user } = useAuth();
  const isAdmin = normalizeRole(user?.role) === 'admin';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        bgcolor: colors.background,
        borderBottom: `1px solid ${colors.border}`,
        transition: 'width 0.25s ease, margin 0.25s ease',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 3 }, gap: 2 }}>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' }, color: colors.textPrimary }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: colors.textPrimary, fontFamily: '"Outfit", sans-serif', display: { xs: 'block', lg: isAdmin ? 'none' : 'block' }, minWidth: 120 }}>
          {title}
        </Typography>
        {isAdmin && <GlobalSearch />}
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <NotificationPanel />
          <UserProfileDropdown />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;

import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import RoleBasedSidebar, {
  DRAWER_WIDTH_COLLAPSED,
  DRAWER_WIDTH_EXPANDED,
} from '../components/dashboard/RoleBasedSidebar';
import TopNavbar from '../components/dashboard/TopNavbar';
import { colors } from '../theme/theme';

const PAGE_TITLES = {
  '/tenant/dashboard': 'Tenant Dashboard',
  '/tenant/requests': 'My Requests',
  '/tenant/leases': 'My Leases',
  '/properties': 'Browse Properties',
  '/settings': 'Settings',
  '/agent/dashboard': 'Agent Dashboard',
  '/agent/properties': 'My Properties',
  '/agent/properties/create': 'Create Property',
  '/agent/requests': 'Lease Requests',
  '/agent/leases': 'Leases',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users': 'Users',
  '/admin/properties': 'Properties',
  '/admin/lease-requests': 'Lease Requests',
  '/admin/leases': 'Leases',
  '/admin/analytics': 'Analytics',
  '/profile': 'Profile',
};

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = isMobile ? 0 : collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  const pageTitle = useMemo(() => {
    const exact = PAGE_TITLES[location.pathname];
    if (exact) return exact;
    const match = Object.entries(PAGE_TITLES).find(([path]) => location.pathname.startsWith(path));
    return match?.[1] || 'Dashboard';
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.background }}>
      <RoleBasedSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isMobile={isMobile}
      />

      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <TopNavbar
          title={pageTitle}
          onMenuClick={() => setMobileOpen(true)}
          sidebarWidth={sidebarWidth}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: '64px', md: '72px' },
            px: { xs: 2, sm: 3, md: 4 },
            pb: 3,
          }}
        >
          <Outlet />
        </Box>

        <Box
          component="footer"
          sx={{
            py: 2,
            px: { xs: 2, md: 4 },
            borderTop: `1px solid ${colors.border}`,
            bgcolor: colors.surface,
          }}
        >
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            &copy; {new Date().getFullYear()} IRCM Platform &mdash; Enterprise Commercial Real Estate Management
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

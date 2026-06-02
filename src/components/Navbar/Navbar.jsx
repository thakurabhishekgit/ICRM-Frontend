import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../theme/theme';
import useAuth from '../../hooks/useAuth';
import { getDashboardPath } from '../../utils/roleRoutes';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled
            ? alpha(colors.background, 0.85)
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid ${colors.border}` : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, gap: 2 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}
              onClick={() => navigate('/')}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                  boxShadow: `0 4px 14px ${alpha(colors.primary, 0.45)}`,
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#fff' }}>IR</Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  background: `linear-gradient(90deg, #fff 0%, ${colors.textSecondary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                IRCM
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mr: 2 }}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  sx={{
                    color: colors.textSecondary,
                    fontWeight: 500,
                    px: 2,
                    '&:hover': { color: colors.textPrimary, bgcolor: alpha(colors.primary, 0.08) },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  <Button variant="contained" color="primary" onClick={() => navigate(getDashboardPath(user?.role))}>
                    Dashboard
                  </Button>
                  <Button variant="outlined" color="primary" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="text" onClick={() => navigate('/login')} sx={{ color: colors.textSecondary }}>
                    Login
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                    Register
                  </Button>
                </>
              )}
            </Box>

            <IconButton
              sx={{ display: { md: 'none' }, color: colors.textPrimary }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: colors.surface,
            borderLeft: `1px solid ${colors.border}`,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: colors.textPrimary }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {NAV_LINKS.map((link) => (
            <ListItemButton key={link.href} onClick={() => handleNavClick(link.href)}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {isAuthenticated ? (
            <>
              <Button fullWidth variant="contained" onClick={() => { navigate(getDashboardPath(user?.role)); setMobileOpen(false); }}>
                Dashboard
              </Button>
              <Button fullWidth variant="outlined" onClick={() => { logout(); setMobileOpen(false); }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button fullWidth variant="outlined" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                Login
              </Button>
              <Button fullWidth variant="contained" onClick={() => { navigate('/register'); setMobileOpen(false); }}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }} />
    </>
  );
};

export default Navbar;

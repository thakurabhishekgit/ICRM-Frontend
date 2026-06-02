import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';

export const LandingLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handlePortalRedirect = () => {
    if (user.role === 'Admin') {
      navigate('/admin');
    } else if (user.role === 'Agent') {
      navigate('/agent');
    } else {
      navigate('/tenant');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="default" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }} onClick={() => navigate('/')}>
              <BusinessIcon sx={{ color: '#1976d2', mr: 1, fontSize: 28 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  letterSpacing: '.5px',
                  color: '#0f172a',
                }}
              >
                IRCM
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, mr: 4 }}>
              <Button color="inherit" onClick={() => navigate('/')} sx={{ color: '#475569', fontWeight: 500 }}>
                Home
              </Button>
              <Button color="inherit" onClick={() => navigate('/browse')} sx={{ color: '#475569', fontWeight: 500 }}>
                Browse Properties
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {isAuthenticated ? (
                <Button variant="contained" color="primary" onClick={handlePortalRedirect}>
                  Go to Portal ({user.fullName})
                </Button>
              ) : (
                <>
                  <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default LandingLayout;

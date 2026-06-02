import { Box, Typography, alpha } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import { colors } from '../theme/theme';

const AuthLayout = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: colors.background,
    }}
  >
    <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 6,
          background: `linear-gradient(160deg, ${colors.surface} 0%, ${colors.background} 50%, ${alpha(colors.primary, 0.15)} 100%)`,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${alpha(colors.background, 0.3)} 0%, ${colors.background} 90%)`,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              mb: 2,
              background: `linear-gradient(90deg, #fff 0%, ${colors.textSecondary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IRCM
          </Typography>
          <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 600, mb: 2, lineHeight: 1.4 }}>
            Intelligent Real Estate & Commercial Management
          </Typography>
          <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8 }}>
            Streamline property discovery, lease workflows, and tenant operations on one enterprise platform built for commercial real estate teams.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
    <Footer />
  </Box>
);

export default AuthLayout;

import { Box, Container, Typography, Button, Chip, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors } from '../../theme/theme';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        pt: { xs: 4, md: 8 },
        pb: { xs: 10, md: 14 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '60%',
          height: '80%',
          background: `radial-gradient(ellipse, ${alpha(colors.primary, 0.2)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '-20%',
          width: '50%',
          height: '50%',
          background: `radial-gradient(ellipse, ${alpha('#6366f1', 0.12)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: 8 },
            alignItems: 'center',
          }}
        >
          <Box className="fade-in">
            <Chip
              label="Enterprise Commercial Real Estate"
              sx={{
                mb: 3,
                bgcolor: alpha(colors.primary, 0.12),
                color: colors.primaryLight,
                border: `1px solid ${alpha(colors.primary, 0.3)}`,
                fontWeight: 600,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem' },
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                lineHeight: 1.12,
                color: colors.textPrimary,
                mb: 3,
              }}
            >
              Intelligent Real Estate &{' '}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 50%, #818cf8 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Commercial Management
              </Box>{' '}
              Platform
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: colors.textSecondary,
                fontWeight: 400,
                lineHeight: 1.75,
                mb: 4,
                maxWidth: 540,
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              A modern platform that helps tenants, agents, and administrators manage commercial real estate operations efficiently.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button variant="outlined" size="large" onClick={() => navigate('/login')}>
                Login
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              position: 'relative',
              display: { xs: 'none', md: 'block' },
            }}
            className="fade-in"
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                border: `1px solid ${colors.border}`,
                boxShadow: `0 32px 64px ${alpha('#000', 0.5)}, 0 0 80px ${alpha(colors.primary, 0.15)}`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, transparent 50%, ${alpha(colors.background, 0.85)} 100%)`,
                  zIndex: 1,
                },
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80"
                alt="Modern commercial office workspace"
                sx={{
                  width: '100%',
                  height: 480,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 24,
                left: -24,
                p: 2.5,
                borderRadius: 3,
                bgcolor: alpha(colors.card, 0.9),
                backdropFilter: 'blur(16px)',
                border: `1px solid ${colors.border}`,
                boxShadow: `0 16px 40px ${alpha('#000', 0.4)}`,
                zIndex: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block' }}>
                Portfolio occupancy
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.success }}>
                95%
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 32,
                right: -16,
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(colors.card, 0.9),
                backdropFilter: 'blur(16px)',
                border: `1px solid ${colors.border}`,
                zIndex: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Active leases
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                1,000+
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;

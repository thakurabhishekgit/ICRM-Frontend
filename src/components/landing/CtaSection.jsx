import { Box, Container, Typography, Button, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { colors } from '../../theme/theme';

const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, px: 2 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            p: { xs: 5, md: 8 },
            textAlign: 'center',
            border: `1px solid ${alpha(colors.primary, 0.3)}`,
            background: `linear-gradient(135deg, ${alpha(colors.primary, 0.15)} 0%, ${colors.card} 50%, ${colors.surface} 100%)`,
            boxShadow: `0 24px 48px ${alpha('#000', 0.4)}`,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: 1,
              background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: colors.textPrimary,
            }}
          >
            Transform Commercial Real Estate Operations
          </Typography>
          <Typography variant="subtitle1" sx={{ color: colors.textSecondary, mb: 4, maxWidth: 560, mx: 'auto' }}>
            Join teams using IRCM to streamline leasing, tenant management, and portfolio operations.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<EmailOutlinedIcon />}
              href="mailto:contact@ircm-platform.com"
            >
              Contact Us
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CtaSection;

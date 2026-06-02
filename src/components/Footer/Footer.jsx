import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/theme';

const FOOTER_SECTIONS = [
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact'],
  },
  {
    title: 'Platform',
    links: ['Features', 'Pricing', 'Security'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Support', 'FAQs'],
  },
  {
    title: 'Legal',
    links: ['Terms', 'Privacy Policy'],
  },
];

const SOCIAL = [
  { icon: <LinkedInIcon fontSize="small" />, label: 'LinkedIn' },
  { icon: <TwitterIcon fontSize="small" />, label: 'Twitter' },
  { icon: <GitHubIcon fontSize="small" />, label: 'GitHub' },
  { icon: <EmailIcon fontSize="small" />, label: 'Email' },
];

const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleFooterLink = (e, sectionTitle, label) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/home');
      setTimeout(() => {
        if (sectionTitle === 'Platform' && label === 'Features') {
          document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
        } else if (sectionTitle === 'Company' && label === 'About') {
          document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    if (sectionTitle === 'Platform' && label === 'Features') {
      document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (sectionTitle === 'Company' && label === 'About') {
      document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        pt: { xs: 6, md: 8 },
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                mb: 1.5,
                background: `linear-gradient(90deg, #fff, ${colors.textSecondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              IRCM
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, maxWidth: 320, mb: 2 }}>
              Intelligent Real Estate & Commercial Management Platform — enterprise-grade operations for modern commercial real estate.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {SOCIAL.map((s) => (
                <IconButton
                  key={s.label}
                  size="small"
                  aria-label={s.label}
                  sx={{
                    color: colors.textSecondary,
                    border: `1px solid ${colors.border}`,
                    '&:hover': { color: colors.primary, borderColor: colors.primary },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {FOOTER_SECTIONS.map((section) => (
            <Grid key={section.title} size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {section.links.map((label) => (
                  <Link
                    key={label}
                    href="#"
                    variant="body2"
                    onClick={(e) => handleFooterLink(e, section.title, label)}
                    sx={{ color: colors.textSecondary, cursor: 'pointer', '&:hover': { color: colors.primaryLight } }}
                  >
                    {label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, borderColor: colors.border }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            &copy; {new Date().getFullYear()} IRCM. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            Built for tenants, agents, and administrators.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

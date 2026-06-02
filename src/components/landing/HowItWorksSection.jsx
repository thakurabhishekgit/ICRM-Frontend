import { Box, Container, Typography, alpha } from '@mui/material';
import SectionHeading from '../ui/SectionHeading';
import { colors } from '../../theme/theme';

const STEPS = [
  { step: 1, title: 'Browse Commercial Properties', description: 'Explore available commercial spaces with detailed listings and filters.' },
  { step: 2, title: 'Submit Lease Request', description: 'Tenants submit structured lease requests directly through the platform.' },
  { step: 3, title: 'Agent Review & Approval', description: 'Agents review applications, negotiate terms, and approve qualified requests.' },
  { step: 4, title: 'Lease Creation', description: 'Generate and manage lease agreements with full audit trail and documentation.' },
  { step: 5, title: 'Property Occupancy & Management', description: 'Monitor occupancy, handle tenant operations, and track portfolio performance.' },
];

const HowItWorksSection = () => (
  <Box id="how-it-works" component="section" sx={{ py: { xs: 10, md: 14 } }}>
    <Container maxWidth="md">
      <SectionHeading
        overline="Workflow"
        title="How it works"
        subtitle="From property discovery to ongoing management — a streamlined five-step journey."
      />
      <Box sx={{ position: 'relative', pl: { xs: 0, sm: 4 } }}>
        <Box
          sx={{
            display: { xs: 'none', sm: 'block' },
            position: 'absolute',
            left: 27,
            top: 24,
            bottom: 24,
            width: 2,
            background: `linear-gradient(180deg, ${colors.primary} 0%, ${alpha(colors.primary, 0.2)} 100%)`,
          }}
        />
        {STEPS.map((item, index) => (
          <Box
            key={item.step}
            sx={{
              display: 'flex',
              gap: 3,
              mb: index < STEPS.length - 1 ? 4 : 0,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: 56,
                height: 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
                color: '#fff',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                boxShadow: `0 8px 24px ${alpha(colors.primary, 0.4)}`,
                border: `3px solid ${colors.background}`,
                zIndex: 1,
              }}
            >
              {item.step}
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                bgcolor: colors.card,
                border: `1px solid ${colors.border}`,
                transition: 'border-color 0.3s ease',
                '&:hover': { borderColor: alpha(colors.primary, 0.4) },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: colors.textPrimary }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>
                {item.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

export default HowItWorksSection;

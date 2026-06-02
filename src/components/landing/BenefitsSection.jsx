import { Box, Container, Typography, alpha } from '@mui/material';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { colors } from '../../theme/theme';

const STATS = [
  { value: '500+', label: 'Properties Managed', gradient: `linear-gradient(135deg, ${colors.primary} 0%, #818cf8 100%)` },
  { value: '95%', label: 'Occupancy Efficiency', gradient: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)' },
  { value: '1000+', label: 'Lease Requests Processed', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
  { value: '99%', label: 'Platform Reliability', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
];

const BenefitsSection = () => (
  <Box
    id="about"
    component="section"
    sx={{
      py: { xs: 10, md: 14 },
      bgcolor: alpha(colors.surface, 0.5),
      borderTop: `1px solid ${colors.border}`,
    }}
  >
    <Container maxWidth="lg">
      <SectionHeading
        overline="Impact"
        title="Trusted by commercial real estate teams"
        subtitle="Numbers that reflect operational excellence across portfolios of every size."
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
        }}
      >
        {STATS.map((stat) => (
          <GlassCard
            key={stat.label}
            sx={{
              p: 3,
              textAlign: 'center',
              background: `linear-gradient(160deg, ${alpha(colors.card, 0.9)} 0%, ${alpha(colors.surface, 0.6)} 100%)`,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontFamily: '"Outfit", sans-serif',
                background: stat.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              {stat.value}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>
              {stat.label}
            </Typography>
          </GlassCard>
        ))}
      </Box>
    </Container>
  </Box>
);

export default BenefitsSection;

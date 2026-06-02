import { Box, Container, Typography, Avatar, Rating, alpha } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { colors } from '../../theme/theme';

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Portfolio Director, Meridian Commercial',
    quote: 'IRCM transformed how we manage lease requests across 40+ properties. Our agents close deals faster with full visibility.',
    avatar: 'SC',
  },
  {
    name: 'James Okonkwo',
    role: 'Facilities Manager, Apex Towers',
    quote: 'The tenant portal reduced support tickets by half. Everything from requests to lease documents lives in one place.',
    avatar: 'JO',
  },
  {
    name: 'Elena Vasquez',
    role: 'Leasing Agent, UrbanCore Realty',
    quote: 'Clean workflows, role-based access, and reliable uptime. It feels like software built for professionals, not templates.',
    avatar: 'EV',
  },
];

const TestimonialsSection = () => (
  <Box component="section" sx={{ py: { xs: 10, md: 14 } }}>
    <Container maxWidth="lg">
      <SectionHeading
        overline="Testimonials"
        title="What our customers say"
        subtitle="Teams across commercial real estate rely on IRCM for day-to-day operations."
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {TESTIMONIALS.map((t) => (
          <GlassCard key={t.name} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <FormatQuoteIcon sx={{ color: alpha(colors.primary, 0.5), fontSize: 36, mb: 2 }} />
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, flexGrow: 1, mb: 3 }}>
              &ldquo;{t.quote}&rdquo;
            </Typography>
            <Rating value={5} readOnly size="small" sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(colors.primary, 0.2),
                  color: colors.primaryLight,
                  fontWeight: 700,
                }}
              >
                {t.avatar}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                  {t.name}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {t.role}
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        ))}
      </Box>
    </Container>
  </Box>
);

export default TestimonialsSection;

import { Box, Container, Typography, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupsIcon from '@mui/icons-material/Groups';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { colors } from '../../theme/theme';

const FEATURES = [
  {
    icon: <SearchIcon />,
    title: 'Property Discovery',
    description: 'Search and explore commercial properties with powerful filters and rich listing details.',
  },
  {
    icon: <DescriptionIcon />,
    title: 'Lease Management',
    description: 'Manage the full leasing lifecycle from inquiry through renewal in one workflow.',
  },
  {
    icon: <GroupsIcon />,
    title: 'Tenant Management',
    description: 'Handle tenant requests, occupancy tracking, and communication seamlessly.',
  },
  {
    icon: <AdminPanelSettingsIcon />,
    title: 'Role Based Access',
    description: 'Dedicated experiences for tenants, agents, and administrators with secure permissions.',
  },
  {
    icon: <TrendingUpIcon />,
    title: 'Revenue Tracking',
    description: 'Track property performance, revenue metrics, and portfolio health in real time.',
  },
  {
    icon: <BusinessIcon />,
    title: 'Real Estate Operations',
    description: 'Centralize documents, workflows, and operations on a single management platform.',
  },
];

const FeaturesSection = () => (
  <Box
    id="features"
    component="section"
    sx={{
      py: { xs: 10, md: 14 },
      bgcolor: alpha(colors.surface, 0.5),
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
    }}
  >
    <Container maxWidth="lg">
      <SectionHeading
        overline="Platform capabilities"
        title="Everything you need to run commercial real estate"
        subtitle="Purpose-built modules for discovery, leasing, tenants, and operations — designed to scale with your portfolio."
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
          gap: 3,
        }}
      >
        {FEATURES.map((feature) => (
          <GlassCard key={feature.title} sx={{ p: 3, height: '100%' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                color: colors.primary,
                bgcolor: alpha(colors.primary, 0.12),
                border: `1px solid ${alpha(colors.primary, 0.25)}`,
              }}
            >
              {feature.icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: colors.textPrimary }}>
              {feature.title}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>
              {feature.description}
            </Typography>
          </GlassCard>
        ))}
      </Box>
    </Container>
  </Box>
);

export default FeaturesSection;

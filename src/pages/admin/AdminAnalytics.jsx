import { Box, Paper, Typography, Grid } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PieChartIcon from '@mui/icons-material/PieChart';
import PageHeader from '../../components/dashboard/PageHeader';
import { colors } from '../../theme/theme';

const FEATURES = [
  { icon: TrendingUpIcon, title: 'ROI Analysis', desc: 'Deep portfolio return analytics across properties and markets.' },
  { icon: PieChartIcon, title: 'Revenue Analytics', desc: 'Revenue forecasting and trend analysis dashboards.' },
  { icon: LightbulbIcon, title: 'Investment Recommendations', desc: 'AI-powered investment insights — placeholder for future module.' },
  { icon: InsightsIcon, title: 'Occupancy Insights', desc: 'Predictive occupancy modeling and optimization.' },
];

const AdminAnalytics = () => (
  <Box>
    <PageHeader title="Analytics" subtitle="Advanced insights and intelligence — coming soon." />
    <Paper sx={{ p: 6, textAlign: 'center', bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3, mb: 4 }}>
      <InsightsIcon sx={{ fontSize: 64, color: colors.primary, mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Coming Soon</Typography>
      <Typography sx={{ color: colors.textSecondary, maxWidth: 480, mx: 'auto' }}>
        Enterprise analytics and AI-powered insights will be available in a future release.
      </Typography>
    </Paper>
    <Grid container spacing={3}>
      {FEATURES.map((f) => (
        <Grid key={f.title} size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 3, height: '100%', bgcolor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 3, opacity: 0.85 }}>
            <f.icon sx={{ color: colors.primaryLight, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{f.title}</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>{f.desc}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default AdminAnalytics;

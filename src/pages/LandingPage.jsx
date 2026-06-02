import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Avatar, Paper } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%' }}>
      {/* 1. Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          color: '#ffffff',
          pt: { xs: 10, md: 16 },
          pb: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7} sx={{ position: 'relative', zIndex: 2 }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  lineHeight: 1.2,
                  mb: 2,
                  color: '#ffffff',
                }}
              >
                Intelligent Real Estate & Commercial Management
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  color: '#93c5fd',
                  mb: 4,
                  maxWidth: 600,
                  lineHeight: 1.6,
                }}
              >
                IRCM connects Tenants, Agents, and Administrators on a single, integrated enterprise platform. Browse premium locations, automate lease workflows, and monitor operational portfolios in real-time.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: '#1976d2',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#1565c0' },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: '#ffffff50',
                    color: '#ffffff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': { borderColor: '#ffffff', bgcolor: '#ffffff10' },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '400px',
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to top, rgba(15,23,42,0.6), transparent)',
                    borderRadius: '16px',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. Features Section */}
      <Box sx={{ py: 12, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Designed For High-Velocity Commercial Operations
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ maxW: 600, mx: 'auto', fontSize: '1.1rem' }}>
              Say goodbye to legacy spreadsheets. Maximize efficiency with purpose-built tooling for every stakeholder.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                title: 'Property Discovery',
                icon: <ExploreIcon fontSize="large" color="primary" />,
                desc: 'Browse premium offices, logistics warehouses, and storefronts with localized maps, unit filters, and instant pricing.',
              },
              {
                title: 'Lease Request Pipeline',
                icon: <ListAltIcon fontSize="large" color="primary" />,
                desc: 'Submit lease interest directly to brokers. Track negotiations, request updates, and get approved with modern dashboards.',
              },
              {
                title: 'Active Lease Tracking',
                icon: <ArticleIcon fontSize="large" color="primary" />,
                desc: 'Generate, store, and manage multi-year commercial leases. Run renewals, monitor rent schedules, and terminate securely.',
              },
              {
                title: 'Tenant Management',
                icon: <GroupIcon fontSize="large" color="primary" />,
                desc: 'Store comprehensive profiles, contact channels, and transaction histories. Manage occupancies without document fatigue.',
              },
              {
                title: 'Agent Portals',
                icon: <SpeedIcon fontSize="large" color="primary" />,
                desc: 'Empower commercial brokers to list properties, upload photo files, approve lease requests, and draft leases dynamically.',
              },
              {
                title: 'Platform Audit Console',
                icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />,
                desc: 'Allow platform administrators to verify tenants, audit operations, modify user accounts, and track macro operations.',
              },
            ].map((feature, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ height: '100%', p: 2 }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. How It Works Section */}
      <Box sx={{ py: 12, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              The Streamlined Leasing Journey
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ maxW: 600, mx: 'auto', fontSize: '1.1rem' }}>
              We have condensed multi-month real estate procedures into five simple digital stages.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { step: '1', title: 'Browse Properties', desc: 'Tenants browse active listings and filter properties by budget and type.' },
              { step: '2', title: 'Submit Lease Request', desc: 'Tenants express interest by submitting requests containing custom terms.' },
              { step: '3', title: 'Agent Review', desc: 'Property brokers review applications and approve or reject them on their dashboard.' },
              { step: '4', title: 'Lease Creation', desc: 'Brokers draft official leases specifying deposit rates, rent details, and timelines.' },
              { step: '5', title: 'Property Occupancy', desc: 'Active leases are established, updating occupancy levels and tracking monthly revenue.' },
            ].map((item, i) => (
              <Grid item xs={12} md={2.4} key={i}>
                <Paper sx={{ p: 3, height: '100%', position: 'relative', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#1976d2',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. Benefits Section */}
      <Box sx={{ py: 12, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
                Optimize Your Real Estate Operations Immediately
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }}>
                IRCM removes delays, provides transparency on property occupancies, and gives brokers precise management controls over financial contracts.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Faster occupancy loops via automated request matching',
                  'Secure auditing tracking all historic leases and cancellations',
                  'Flexible client onboarding allowing quick role registration',
                  'Enterprise-grade dashboard tracking property metrics and yields',
                ].map((benefit, i) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }} key={i}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 800, mb: 1 }}>98%</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Occupancy Yield</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 800, mb: 1 }}>10x</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Approval Speed</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 800, mb: 1 }}>$1.2M</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Monthly Volume</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 800, mb: 1 }}>0%</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Paper Friction</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 5. Testimonials Section */}
      <Box sx={{ py: 12, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Trusted by Top Brokers and Tenants
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ maxW: 600, mx: 'auto', fontSize: '1.1rem' }}>
              Read reviews from companies who optimized their commercial workspaces through IRCM.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                quote: 'Using IRCM, our agency reduced lease drafting cycles from two weeks to under an hour. Real-time updates on occupied units completely changed our performance.',
                author: 'Sarah Jenkins',
                role: 'Commercial Broker Director',
                company: 'Apex Realty Group',
                avatar: 'SJ',
              },
              {
                quote: 'As a tenant expanding our logistics network, discovering warehouses, submitting requests, and completing leases on IRCM was extremely seamless.',
                author: 'David Chen',
                role: 'VP of Operations',
                company: 'SpeedyShip Logistical',
                avatar: 'DC',
              },
              {
                quote: 'The unified user directory and simple lease state toggling (activate, expire, terminate) made auditing our real estate holdings straightforward.',
                author: 'Marcus Vance',
                role: 'SVP Asset Management',
                company: 'Vanguard Holdings',
                avatar: 'MV',
              },
            ].map((review, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <RateReviewIcon sx={{ color: '#1976d2', mb: 2, fontSize: 32 }} />
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, flexGrow: 1, color: '#475569', lineHeight: 1.6 }}>
                    "{review.quote}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#1976d2', fontWeight: 600 }}>{review.avatar}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{review.author}</Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                        {review.role}, {review.company}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 6. CTA Section */}
      <Box sx={{ py: 10, bgcolor: '#1e293b', color: '#ffffff', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#ffffff' }}>
            Ready to Accelerate Commercial Management?
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, color: '#94a3b8', mb: 4, maxW: 600, mx: 'auto' }}>
            Sign up for a tenant or agent account today and explore the IRCM platform instantly.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ px: 4, py: 1.5 }}
            >
              Sign Up Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/browse')}
              sx={{ borderColor: '#ffffff30', color: '#ffffff', px: 4, py: 1.5, '&:hover': { borderColor: '#ffffff', bgcolor: '#ffffff10' } }}
            >
              Browse Active Units
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

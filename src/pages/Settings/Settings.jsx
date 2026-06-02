import { Box, Paper, Typography, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import PageHeader from '../../components/dashboard/PageHeader';
import { colors } from '../../theme/theme';

const Settings = () => {
  const [tab, setTab] = useState(0);

  const panels = [
    { label: 'General', content: 'Platform name, timezone, and locale preferences will be configurable here.' },
    { label: 'Appearance', content: 'Theme and display density settings — architecture ready for future implementation.' },
    { label: 'Notifications', content: 'Email and in-app notification preferences placeholder.' },
    { label: 'Security', content: 'Session timeout, 2FA, and password policies — coming soon.' },
  ];

  return (
    <Box>
      <PageHeader title="Settings" subtitle="Configure your IRCM platform preferences." />
      <Paper sx={{ bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: `1px solid ${colors.border}`, px: 2 }}>
          {panels.map((p) => <Tab key={p.label} label={p.label} />)}
        </Tabs>
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{panels[tab].label}</Typography>
          <Typography sx={{ color: colors.textSecondary }}>{panels[tab].content}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;

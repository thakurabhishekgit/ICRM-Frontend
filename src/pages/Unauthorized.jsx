import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import GppBadIcon from '@mui/icons-material/GppBad';
import useAuth from '../hooks/useAuth';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBackToDashboard = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const rolePrefix = String(user.role).toLowerCase();
    navigate(`/${rolePrefix}`);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
      <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center', width: '100%' }}>
        <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#d32f2f10', color: '#d32f2f', width: 64, height: 64, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <GppBadIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, mb: 1, color: '#0f172a' }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxW: 400, mx: 'auto' }}>
          You do not have the required role permissions to view this dashboard page. If you believe this is an error, please check with your administrator.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBackToDashboard} size="large">
          Back to Portal
        </Button>
      </Paper>
    </Container>
  );
};

export default Unauthorized;

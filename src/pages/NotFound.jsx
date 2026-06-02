import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
      <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center', width: '100%' }}>
        <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#cbd5e130', color: '#64748b', width: 64, height: 64, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <HeartBrokenIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, mb: 1, color: '#0f172a' }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxW: 400, mx: 'auto' }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')} size="large">
          Go to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound;

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { colors } from '../theme/theme';

const MainLayout = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: colors.background,
    }}
  >
    <Navbar />
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

export default MainLayout;

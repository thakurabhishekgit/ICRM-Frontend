import { Box, CircularProgress, Typography } from '@mui/material';
import { colors } from '../theme/theme';

const Loader = ({ message = 'Loading...', fullScreen = false }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      py: fullScreen ? 0 : 8,
      minHeight: fullScreen ? '60vh' : 'auto',
      bgcolor: fullScreen ? colors.background : 'transparent',
    }}
  >
    <CircularProgress color="primary" size={fullScreen ? 48 : 36} />
    {message && (
      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
        {message}
      </Typography>
    )}
  </Box>
);

export default Loader;

import { Box, Typography } from '@mui/material';
import { colors } from '../../theme/theme';

const SectionHeading = ({ overline, title, subtitle, align = 'center', id }) => (
  <Box
    id={id}
    sx={{
      textAlign: align,
      mb: { xs: 5, md: 7 },
      maxWidth: align === 'center' ? 720 : 'none',
      mx: align === 'center' ? 'auto' : 0,
    }}
  >
    {overline && (
      <Typography
        variant="overline"
        sx={{
          color: colors.primary,
          fontWeight: 700,
          letterSpacing: '0.12em',
          display: 'block',
          mb: 1,
        }}
      >
        {overline}
      </Typography>
    )}
    <Typography
      variant="h2"
      sx={{
        fontSize: { xs: '2rem', md: '2.75rem' },
        color: colors.textPrimary,
        mb: subtitle ? 2 : 0,
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="subtitle1" sx={{ color: colors.textSecondary }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default SectionHeading;

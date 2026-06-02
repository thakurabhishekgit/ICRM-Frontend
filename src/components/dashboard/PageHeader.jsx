import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '../../theme/theme';

const PageHeader = ({ title, subtitle, breadcrumbs = [] }) => (
  <Box sx={{ mb: 4 }}>
    {breadcrumbs.length > 0 && (
      <Breadcrumbs sx={{ mb: 1.5, '& .MuiBreadcrumbs-separator': { color: colors.textSecondary } }}>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          if (isLast || !crumb.to) {
            return (
              <Typography key={crumb.label} variant="body2" sx={{ color: colors.textSecondary }}>
                {crumb.label}
              </Typography>
            );
          }
          return (
            <Link
              key={crumb.label}
              component={RouterLink}
              to={crumb.to}
              variant="body2"
              sx={{ color: colors.primaryLight }}
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    )}
    <Typography
      variant="h4"
      sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: colors.textPrimary }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body1" sx={{ color: colors.textSecondary, mt: 1 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default PageHeader;

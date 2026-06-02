import { Skeleton, Box } from '@mui/material';
import { colors } from '../../theme/theme';

const SkeletonBlock = ({ height = 200, width = '100%', borderRadius = 2 }) => (
  <Skeleton
    variant="rounded"
    width={width}
    height={height}
    animation="wave"
    sx={{
      bgcolor: colors.card,
      '&::after': {
        background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
      },
    }}
  />
);

export const HeroSkeleton = () => (
  <Box sx={{ py: { xs: 8, md: 12 } }}>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
      <Box sx={{ flex: 1 }}>
        <SkeletonBlock height={48} width="80%" />
        <Box sx={{ mt: 2 }} />
        <SkeletonBlock height={24} width="100%" />
        <Box sx={{ mt: 1 }} />
        <SkeletonBlock height={24} width="70%" />
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <SkeletonBlock height={48} width={140} />
          <SkeletonBlock height={48} width={120} />
        </Box>
      </Box>
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
        <SkeletonBlock height={420} />
      </Box>
    </Box>
  </Box>
);

export default SkeletonBlock;

import { Card, CardContent, CardActions, Typography, Box, Chip, Button, LinearProgress, alpha } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { formatCurrency, getPropertyTypeName, getOccupancyRate } from '../utils/formatters';
import PropertyThumbnail from './properties/PropertyThumbnail';
import { colors } from '../theme/theme';

const PropertyCard = ({
  property,
  onViewDetails,
  onEdit,
  onDelete,
  onShowInterest,
  onViewRequests,
  onViewLeases,
  actionsType = 'tenant',
}) => {
  const {
    id,
    title,
    description,
    location,
    price,
    propertyType,
    totalUnits,
    occupiedUnits,
    amenities,
    thumbnailUrl,
    agent,
  } = property;

  const occupancy = getOccupancyRate(occupiedUnits, totalUnits);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: colors.card, border: `1px solid ${colors.border}` }}>
      <Box sx={{ position: 'relative' }}>
        <PropertyThumbnail thumbnailUrl={thumbnailUrl} seed={id || title} alt={title} height={200} />
        <Chip
          label={getPropertyTypeName(propertyType)}
          size="small"
          icon={<BusinessIcon sx={{ fontSize: '14px !important' }} />}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontWeight: 600,
            bgcolor: alpha(colors.primary, 0.9),
            color: '#fff',
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: colors.textSecondary }} />
          <Typography variant="body2" noWrap sx={{ color: colors.textSecondary }}>
            {location}
          </Typography>
        </Box>
        {agent?.fullName && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <PersonIcon fontSize="small" sx={{ mr: 0.5, color: colors.textSecondary }} />
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              {agent.fullName}
            </Typography>
          </Box>
        )}
        {amenities && (
          <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block', mb: 1.5 }}>
            {amenities}
          </Typography>
        )}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
            Occupancy
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={occupancy.percentage}
              sx={{
                flex: 1,
                mr: 1,
                height: 6,
                borderRadius: 3,
                bgcolor: colors.border,
                '& .MuiLinearProgress-bar': { bgcolor: colors.primary },
              }}
            />
            <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
              {occupancy.percentage}%
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: `1px solid ${colors.border}` }}>
          <Typography variant="caption" sx={{ color: colors.textSecondary, textTransform: 'uppercase', fontWeight: 600 }}>
            Monthly Price
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: colors.success }}>
            {formatCurrency(price)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, flexWrap: 'wrap', gap: 1 }}>
        {actionsType === 'tenant' && (
          <>
            <Button size="small" variant="outlined" onClick={() => onViewDetails(id)}>
              View Details
            </Button>
            {onShowInterest && (
              <Button size="small" variant="contained" onClick={() => onShowInterest(property)}>
                Show Interest
              </Button>
            )}
          </>
        )}
        {actionsType === 'agent' && (
          <>
            <Button size="small" variant="outlined" onClick={() => onViewDetails(id)}>View</Button>
            <Button size="small" variant="outlined" onClick={() => onEdit(property)}>Edit</Button>
            <Button size="small" variant="outlined" color="error" onClick={() => onDelete(id)}>Delete</Button>
            {onViewRequests && (
              <Button size="small" variant="text" onClick={() => onViewRequests(id)}>Requests</Button>
            )}
            {onViewLeases && (
              <Button size="small" variant="text" onClick={() => onViewLeases(id)}>Leases</Button>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default PropertyCard;

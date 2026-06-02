import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Box, Chip, Button, LinearProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import { formatCurrency, getPropertyTypeName, getOccupancyRate } from '../utils/formatters';

const DEFAULT_REAL_ESTATE_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';

export const PropertyCard = ({
  property,
  onViewDetails,
  onEdit,
  onDelete,
  onShowInterest,
  actionsType = 'tenant', // 'tenant', 'agent', 'admin'
}) => {
  const {
    id,
    title,
    location,
    price,
    propertyType,
    totalUnits,
    occupiedUnits,
    thumbnailUrl,
  } = property;

  const imageUrl = thumbnailUrl && thumbnailUrl.startsWith('http') 
    ? thumbnailUrl 
    : DEFAULT_REAL_ESTATE_IMAGE;

  const occupancy = getOccupancyRate(occupiedUnits, totalUnits);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <Chip
          label={getPropertyTypeName(propertyType)}
          size="small"
          color="primary"
          icon={<BusinessIcon sx={{ fontSize: '14px !important' }} />}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            backgroundColor: '#1976d2',
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineClamp: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: '#94a3b8' }} />
          <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
            {location}
          </Typography>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
            Occupancy Level:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1.5 }}>
              <LinearProgress
                variant="determinate"
                value={occupancy.percentage}
                color={occupancy.percentage >= 90 ? 'success' : occupancy.percentage >= 50 ? 'primary' : 'warning'}
                sx={{ height: 6, borderRadius: 3, backgroundColor: '#f1f5f9' }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                {occupancy.percentage}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
            {occupancy.label}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f1f5f9' }}>
          <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
            Monthly Price
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2e7d32' }}>
            {formatCurrency(price)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
        {actionsType === 'tenant' && (
          <>
            <Button size="small" variant="outlined" fullWidth onClick={() => onViewDetails(id)}>
              View Details
            </Button>
            {onShowInterest && (
              <Button size="small" variant="contained" fullWidth onClick={() => onShowInterest(property)}>
                Show Interest
              </Button>
            )}
          </>
        )}
        
        {actionsType === 'agent' && (
          <>
            <Button size="small" variant="outlined" onClick={() => onViewDetails(id)}>
              Details
            </Button>
            <Button size="small" variant="outlined" color="primary" onClick={() => onEdit(property)}>
              Edit
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={() => onDelete(id)}>
              Delete
            </Button>
          </>
        )}

        {actionsType === 'admin' && (
          <>
            <Button size="small" variant="outlined" fullWidth onClick={() => onViewDetails(id)}>
              Audit Details
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={() => onDelete(id)}>
              Remove
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default PropertyCard;

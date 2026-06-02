import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { PROPERTY_TYPE_OPTIONS } from '../../utils/formatters';
import { colors } from '../../theme/theme';

const PropertyForm = ({ formData, onChange, onTypeChange, loading, onSubmit, submitLabel = 'Save Property' }) => (
  <Box component="form" onSubmit={onSubmit} noValidate>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField required fullWidth label="Title" name="title" value={formData.title} onChange={onChange} disabled={loading} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          required
          fullWidth
          multiline
          rows={3}
          label="Description"
          name="description"
          value={formData.description}
          onChange={onChange}
          disabled={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField required fullWidth label="Location" name="location" value={formData.location} onChange={onChange} disabled={loading} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Property Type</InputLabel>
          <Select value={formData.propertyType} label="Property Type" onChange={onTypeChange} disabled={loading}>
            {PROPERTY_TYPE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          fullWidth
          label="Price (Monthly)"
          name="price"
          type="number"
          value={formData.price}
          onChange={onChange}
          disabled={loading}
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          fullWidth
          label="Thumbnail URL"
          name="thumbnailUrl"
          value={formData.thumbnailUrl}
          onChange={onChange}
          disabled={loading}
          placeholder="https://..."
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField required fullWidth label="Total Units" name="totalUnits" type="number" value={formData.totalUnits} onChange={onChange} disabled={loading} inputProps={{ min: 1 }} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Occupied Units" name="occupiedUnits" type="number" value={formData.occupiedUnits} onChange={onChange} disabled={loading} inputProps={{ min: 0 }} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth label="Monthly Maintenance" name="monthlyMaintenanceCost" type="number" value={formData.monthlyMaintenanceCost} onChange={onChange} disabled={loading} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth label="Monthly Revenue" name="monthlyRevenue" type="number" value={formData.monthlyRevenue} onChange={onChange} disabled={loading} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth label="ROI (%)" name="roi" type="number" value={formData.roi} onChange={onChange} disabled={loading} inputProps={{ min: 0, step: 0.1 }} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField required fullWidth label="Amenities" name="amenities" value={formData.amenities} onChange={onChange} disabled={loading} placeholder="Parking, WiFi, Conference Rooms" />
      </Grid>
      <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 140 }}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </Grid>
    </Grid>
  </Box>
);

export default PropertyForm;

import { Paper, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { PROPERTY_TYPE_OPTIONS } from '../utils/formatters';
import { colors } from '../theme/theme';

const FilterPanel = ({ filters, onChange, onReset }) => (
  <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: colors.card, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>
      Filter Properties
    </Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr auto' }, gap: 2, alignItems: 'center' }}>
      <FormControl fullWidth size="small">
        <InputLabel>Property Type</InputLabel>
        <Select
          value={filters.propertyType}
          label="Property Type"
          onChange={(e) => onChange({ ...filters, propertyType: e.target.value })}
        >
          <MenuItem value="all">All Types</MenuItem>
          {PROPERTY_TYPE_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        size="small"
        label="Location"
        value={filters.location}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
        placeholder="e.g. San Francisco"
      />
      <TextField
        fullWidth
        size="small"
        label="Max Monthly Rent ($)"
        type="number"
        value={filters.maxPrice}
        onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
        InputProps={{ inputProps: { min: 0 } }}
      />
      <Button variant="outlined" onClick={onReset} sx={{ height: 40, minWidth: 48 }} title="Reset Filters">
        <RestartAltIcon />
      </Button>
    </Box>
  </Paper>
);

export default FilterPanel;

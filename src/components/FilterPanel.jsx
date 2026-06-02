import React from 'react';
import { Paper, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export const FilterPanel = ({
  filters,
  onChange,
  onReset,
}) => {
  const handleTypeChange = (e) => {
    onChange({ ...filters, propertyType: e.target.value });
  };

  const handleMaxPriceChange = (e) => {
    const val = e.target.value;
    onChange({ ...filters, maxPrice: val ? parseFloat(val) : '' });
  };

  const handleLocationChange = (e) => {
    onChange({ ...filters, location: e.target.value });
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 2 }}>
        Filter Properties
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="property-type-label">Property Type</InputLabel>
            <Select
              labelId="property-type-label"
              id="property-type"
              value={filters.propertyType}
              label="Property Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="0">Office Space</MenuItem>
              <MenuItem value="1">Retail Storefront</MenuItem>
              <MenuItem value="2">Industrial Plant</MenuItem>
              <MenuItem value="3">Logistic Warehouse</MenuItem>
              <MenuItem value="4">Commercial Complex</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Max Monthly Rent ($)"
            type="number"
            value={filters.maxPrice}
            onChange={handleMaxPriceChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            size="small"
            label="Location Keyword"
            value={filters.location}
            onChange={handleLocationChange}
            placeholder="e.g. New York"
          />
        </Grid>

        <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onReset}
            fullWidth
            sx={{ minWidth: { sm: '40px' }, height: '40px', p: 1 }}
            title="Reset Filters"
          >
            <RestartAltIcon />
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterPanel;

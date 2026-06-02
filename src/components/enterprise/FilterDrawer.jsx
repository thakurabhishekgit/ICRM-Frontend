import {
  Drawer, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../theme/theme';

const FilterDrawer = ({ open, onClose, title = 'Filters', filters, onChange, onReset, children }) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { width: { xs: '100%', sm: 360 }, bgcolor: colors.surface, p: 3 } }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
      <IconButton onClick={onClose}><CloseIcon /></IconButton>
    </Box>
    {children || (
      <>
        <TextField fullWidth size="small" label="Search" value={filters.search || ''} onChange={(e) => onChange({ ...filters, search: e.target.value })} sx={{ mb: 2 }} />
        {filters.status !== undefined && (
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value })}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
              <MenuItem value="Terminated">Terminated</MenuItem>
            </Select>
          </FormControl>
        )}
      </>
    )}
    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
      <Button fullWidth variant="outlined" onClick={onReset}>Reset</Button>
      <Button fullWidth variant="contained" onClick={onClose}>Apply</Button>
    </Box>
  </Drawer>
);

export default FilterDrawer;

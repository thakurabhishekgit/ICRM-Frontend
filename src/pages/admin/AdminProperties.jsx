import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Alert, ToggleButton, ToggleButtonGroup, TextField, FormControl, InputLabel, Select, MenuItem, Button,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableRowsIcon from '@mui/icons-material/TableRows';
import FilterListIcon from '@mui/icons-material/FilterList';
import PageHeader from '../../components/dashboard/PageHeader';
import PropertyCard from '../../components/PropertyCard';
import AdminDataTable from '../../components/enterprise/AdminDataTable';
import FilterDrawer from '../../components/enterprise/FilterDrawer';
import Loader from '../../components/Loader';
import propertyService from '../../api/services/propertyService';
import { formatCurrency, getPropertyTypeName, PROPERTY_TYPE_OPTIONS, matchesPropertyTypeFilter } from '../../utils/formatters';
import { getApiErrorMessage } from '../../utils/apiHelpers';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { useToast } from '../../context/ToastContext';

const AdminProperties = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({ location: '', propertyType: 'all', agent: '', minPrice: '', maxPrice: '' });

  useEffect(() => {
    propertyService.getAllProperties()
      .then(setProperties)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const agents = useMemo(() => [...new Set(properties.map((p) => p.agent?.fullName).filter(Boolean))], [properties]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (filters.location && !p.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.propertyType !== 'all' && !matchesPropertyTypeFilter(p.propertyType, filters.propertyType)) return false;
      if (filters.agent && p.agent?.fullName !== filters.agent) return false;
      if (filters.minPrice && p.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > parseFloat(filters.maxPrice)) return false;
      return true;
    });
  }, [properties, filters]);

  const handleDelete = async () => {
    try {
      await propertyService.deleteProperty(deleteId);
      showToast('Property deleted');
      setProperties((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    }
  };

  const tableColumns = [
    { id: 'title', label: 'Property', sortable: true },
    { id: 'location', label: 'Location' },
    { id: 'propertyType', label: 'Type', render: (r) => getPropertyTypeName(r.propertyType) },
    { id: 'agent', label: 'Agent', render: (r) => r.agent?.fullName || '—' },
    { id: 'price', label: 'Price', render: (r) => formatCurrency(r.price), sortable: true },
    { id: 'actions', label: 'Actions', render: (r) => (
      <Button size="small" onClick={() => navigate(`/admin/properties/${r.id}`)}>View</Button>
    )},
  ];

  const tableRows = filtered.map((p) => ({ ...p, agent: p.agent?.fullName }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <PageHeader title="Property Management" subtitle="All commercial properties across the platform." />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFilterOpen(true)}>Filters</Button>
          <ToggleButtonGroup size="small" value={view} exclusive onChange={(_, v) => v && setView(v)}>
            <ToggleButton value="grid"><ViewModuleIcon fontSize="small" /></ToggleButton>
            <ToggleButton value="table"><TableRowsIcon fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Loader message="Loading properties..." />
      ) : view === 'grid' ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              actionsType="agent"
              onViewDetails={(id) => navigate(`/admin/properties/${id}`)}
              onEdit={(prop) => navigate(`/agent/properties/edit/${prop.id}`)}
              onDelete={setDeleteId}
            />
          ))}
        </Box>
      ) : (
        <AdminDataTable columns={tableColumns} rows={tableRows} searchKeys={['title', 'location']} searchPlaceholder="Search properties..." />
      )}

      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onChange={setFilters} onReset={() => setFilters({ location: '', propertyType: 'all', agent: '', minPrice: '', maxPrice: '' })}>
        <TextField fullWidth size="small" label="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} sx={{ mb: 2 }} />
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Property Type</InputLabel>
          <Select label="Property Type" value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}>
            <MenuItem value="all">All</MenuItem>
            {PROPERTY_TYPE_OPTIONS.map((o) => <MenuItem key={o.value} value={String(o.value)}>{o.label}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Agent</InputLabel>
          <Select label="Agent" value={filters.agent} onChange={(e) => setFilters({ ...filters, agent: e.target.value })}>
            <MenuItem value="">All</MenuItem>
            {agents.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField fullWidth size="small" type="number" label="Min Price" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} sx={{ mb: 2 }} />
        <TextField fullWidth size="small" type="number" label="Max Price" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
      </FilterDrawer>

      <ConfirmationDialog open={Boolean(deleteId)} title="Delete Property?" message="Permanently remove this property listing?" confirmColor="error" onConfirm={handleDelete} onClose={() => setDeleteId(null)} />
    </Box>
  );
};

export default AdminProperties;

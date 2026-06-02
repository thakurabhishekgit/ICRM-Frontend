import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, InputAdornment, Popper, Paper, List, ListItemButton, ListItemText, Typography, ClickAwayListener, alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from '../../hooks/useDebounce';
import userService from '../../api/services/userService';
import propertyService from '../../api/services/propertyService';
import { getAllLeases, getAllLeaseRequests } from '../../services/adminService';
import { colors } from '../../theme/theme';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [data, setData] = useState({ users: [], properties: [], requests: [], leases: [] });
  const debounced = useDebounce(query, 350);

  useEffect(() => {
    if (!debounced.trim()) return;
    Promise.all([
      userService.getAllUsers(),
      propertyService.getAllProperties(),
      getAllLeaseRequests(),
      getAllLeases(),
    ]).then(([users, properties, requests, leases]) => {
      setData({ users, properties, requests, leases });
    }).catch(() => {});
  }, [debounced]);

  const results = useMemo(() => {
    const q = debounced.toLowerCase().trim();
    if (!q) return [];
    const items = [];
    data.users.filter((u) => u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)).slice(0, 3)
      .forEach((u) => items.push({ type: 'User', label: u.fullName, sub: u.email, path: `/admin/users/${u.id}` }));
    data.properties.filter((p) => p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q)).slice(0, 3)
      .forEach((p) => items.push({ type: 'Property', label: p.title, sub: p.location, path: `/admin/properties/${p.id}` }));
    data.requests.filter((r) => r.property?.title?.toLowerCase().includes(q) || r.tenant?.fullName?.toLowerCase().includes(q)).slice(0, 2)
      .forEach((r) => items.push({ type: 'Request', label: r.property?.title, sub: r.tenant?.fullName, path: '/admin/lease-requests' }));
    data.leases.filter((l) => l.property?.title?.toLowerCase().includes(q) || l.tenant?.fullName?.toLowerCase().includes(q)).slice(0, 2)
      .forEach((l) => items.push({ type: 'Lease', label: l.property?.title, sub: l.tenant?.fullName, path: `/lease/${l.id}` }));
    return items;
  }, [debounced, data]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ flex: 1, maxWidth: 420, display: { xs: 'none', lg: 'block' } }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search users, properties, leases..."
          value={query}
          inputRef={setAnchor}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.textSecondary }} /></InputAdornment>,
            sx: { bgcolor: alpha(colors.surface, 0.8), borderRadius: 2 },
          }}
        />
        <Popper open={open && results.length > 0 && Boolean(anchor)} anchorEl={anchor} placement="bottom-start" sx={{ zIndex: 1400, width: anchor?.offsetWidth }}>
          <Paper sx={{ mt: 1, bgcolor: colors.card, border: `1px solid ${colors.border}`, maxHeight: 320, overflow: 'auto' }}>
            <List dense>
              {results.map((r, i) => (
                <ListItemButton key={`${r.type}-${i}`} onClick={() => { navigate(r.path); setOpen(false); setQuery(''); }}>
                  <ListItemText
                    primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{r.label}</Typography>}
                    secondary={<Typography variant="caption">{r.type} · {r.sub}</Typography>}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default GlobalSearch;

import { useMemo, useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TableSortLabel, TextField, InputAdornment, Button, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import Loader from '../Loader';
import EmptyState from '../EmptyState';
import FilterDrawer from './FilterDrawer';
import { colors } from '../../theme/theme';

const AdminDataTable = ({
  columns = [],
  rows = [],
  loading = false,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  statusKey,
  emptyTitle,
  emptyDescription,
  onExport,
  filterDrawerContent,
  defaultRowsPerPage = 10,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredRows = useMemo(() => {
    let result = [...rows];
    const q = (search || filters.search || '').toLowerCase();
    if (q && searchKeys.length) {
      result = result.filter((row) =>
        searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
      );
    }
    if (statusKey && filters.status && filters.status !== 'all') {
      result = result.filter((row) => String(row[statusKey]).toLowerCase() === filters.status.toLowerCase());
    }
    if (orderBy) {
      result.sort((a, b) => {
        const av = a[orderBy];
        const bv = b[orderBy];
        if (av < bv) return order === 'asc' ? -1 : 1;
        if (av > bv) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [rows, search, filters, searchKeys, statusKey, orderBy, order]);

  const handleSort = (id) => {
    if (orderBy === id) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setOrderBy(id); setOrder('asc'); }
  };

  if (loading) return <Loader message="Loading data..." />;

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFilterOpen(true)}>Filters</Button>
        <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={onExport}>Export</Button>
        <Typography variant="body2" sx={{ color: colors.textSecondary, ml: 'auto' }}>{filteredRows.length} records</Typography>
      </Box>

      {filteredRows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <Paper sx={{ overflow: 'hidden', bgcolor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.id} sx={{ fontWeight: 700, color: colors.textSecondary, borderColor: colors.border, bgcolor: colors.surface, whiteSpace: 'nowrap' }}>
                      {col.sortable ? (
                        <TableSortLabel active={orderBy === col.id} direction={orderBy === col.id ? order : 'asc'} onClick={() => handleSort(col.id)}>
                          {col.label}
                        </TableSortLabel>
                      ) : col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                  <TableRow hover key={row.id || i}>
                    {columns.map((col) => (
                      <TableCell key={col.id} sx={{ borderColor: colors.border, color: colors.textPrimary }}>
                        {col.render ? col.render(row) : row[col.id] ?? '—'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{ borderTop: `1px solid ${colors.border}` }}
          />
        </Paper>
      )}

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ search: '', status: 'all' })}
      >
        {filterDrawerContent}
      </FilterDrawer>
    </>
  );
};

export default AdminDataTable;

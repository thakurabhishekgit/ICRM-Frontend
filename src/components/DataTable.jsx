import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';
import Loader from './Loader';
import EmptyState from './EmptyState';
import { colors } from '../theme/theme';

const DataTable = ({
  columns = [],
  rows = [],
  loading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records to display here.',
  emptyIcon,
  pagination = true,
  defaultRowsPerPage = 10,
  onRowClick,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  if (loading) {
    return (
      <Paper sx={{ p: 4, borderRadius: 2, bgcolor: colors.card, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
        <Loader message="Fetching records..." />
      </Paper>
    );
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />;
  }

  const paginatedRows = pagination ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, bgcolor: colors.card, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'} sx={{ fontWeight: 700, color: colors.textSecondary, borderColor: colors.border, bgcolor: colors.surface }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow
                hover
                key={row.id || rowIndex}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'} sx={{ borderColor: colors.border, color: colors.textPrimary }}>
                    {column.render ? column.render(row) : row[column.id] ?? '—'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          sx={{ borderTop: `1px solid ${colors.border}`, color: colors.textSecondary }}
        />
      )}
    </Paper>
  );
};

export default DataTable;

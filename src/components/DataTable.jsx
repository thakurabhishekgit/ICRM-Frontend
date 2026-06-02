import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Box } from '@mui/material';
import Loader from './Loader';
import EmptyState from './EmptyState';

export const DataTable = ({
  columns = [],
  rows = [],
  loading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records to display here.',
  emptyIcon,
  pagination = true,
  defaultRowsPerPage = 5,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <Loader message="Fetching records..." />
      </Paper>
    );
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />;
  }

  const paginatedRows = pagination
    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rows;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="custom data table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth, fontWeight: 700 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => {
              const key = row.id || rowIndex;
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={key}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.render ? column.render(row) : value !== undefined && value !== null ? String(value) : '—'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #f1f5f9' }}
        />
      )}
    </Paper>
  );
};

export default DataTable;

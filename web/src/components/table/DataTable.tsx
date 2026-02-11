import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Checkbox,
  TableSortLabel,
  Typography
} from '@mui/material';
import { TableToolbar } from './TableToolbar';
import { TableSkeleton } from './TableSkeleton';
import { EmptyState } from './EmptyState';

export interface Column<T = any> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  format?: (value: any, row: T) => React.ReactNode;
  render?: (row: T) => React.ReactNode;
}

export interface RowAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning';
  disabled?: (row: T) => boolean;
}

export interface PaginationConfig {
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export interface DataTableProps<T = any> {
  title?: string;
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (columnId: string, order: 'asc' | 'desc') => void;
  rowActions?: RowAction<T>[];
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selected: T[]) => void;
  getRowId?: (row: T) => string | number;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function DataTable<T = any>({
  title,
  columns,
  rows = [],
  loading = false,
  pagination,
  searchable = true,
  searchPlaceholder = 'Search...',
  onSearch,
  sortable = true,
  sortBy,
  sortOrder,
  onSort,
  rowActions = [],
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (row: any) => row.id,
  emptyMessage = 'No data available',
  emptyIcon
}: DataTableProps<T>) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  // Ensure rows is always an array
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeSelectedRows = Array.isArray(selectedRows) ? selectedRows : [];

  const handleSearch = (value: string) => {
    setLocalSearchTerm(value);
    onSearch?.(value);
  };

  const handleSort = (columnId: string) => {
    if (!sortable || !onSort) return;

    const newOrder =
      sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(columnId, newOrder);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectable || !onSelectionChange) return;

    if (event.target.checked) {
      onSelectionChange([...safeRows]);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    if (!selectable || !onSelectionChange) return;

    if (checked) {
      onSelectionChange([...safeSelectedRows, row]);
    } else {
      onSelectionChange(safeSelectedRows.filter((r) => getRowId(r) !== getRowId(row)));
    }
  };

  const isSelected = (row: T) => {
    return safeSelectedRows.some((r) => getRowId(r) === getRowId(row));
  };

  const isAllSelected = useMemo(() => {
    return safeRows.length > 0 && safeSelectedRows.length === safeRows.length;
  }, [safeRows.length, safeSelectedRows.length]);

  const isIndeterminate = useMemo(() => {
    return safeSelectedRows.length > 0 && safeSelectedRows.length < safeRows.length;
  }, [safeSelectedRows.length, safeRows.length]);

  if (loading) {
    return <TableSkeleton columns={columns.length} rows={pagination?.rowsPerPage || 5} />;
  }

  return (
    <Paper elevation={2}>
      {title && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}

      {searchable && (
        <TableToolbar
          searchPlaceholder={searchPlaceholder}
          onSearch={handleSearch}
          searchValue={localSearchTerm}
        />
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {sortable && column.sortable !== false && onSort ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {rowActions.length > 0 && (
                <TableCell align="right" style={{ minWidth: 100 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {safeRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 8 }}
                >
                  <EmptyState message={emptyMessage} icon={emptyIcon} />
                </TableCell>
              </TableRow>
            ) : (
              safeRows.map((row) => {
                const selected = isSelected(row);
                return (
                  <TableRow
                    key={getRowId(row)}
                    hover
                    selected={selected}
                    sx={{ cursor: selectable ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected}
                          onChange={(e) => handleSelectRow(row, e.target.checked)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const value = (row as any)[column.id];
                      return (
                        <TableCell key={column.id} align={column.align || 'left'}>
                          {column.render
                            ? column.render(row)
                            : column.format
                            ? column.format(value, row)
                            : value}
                        </TableCell>
                      );
                    })}
                    {rowActions.length > 0 && (
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          {rowActions.map((action, index) => {
                            const disabled = action.disabled?.(row) || false;
                            return (
                              <Box
                                key={index}
                                onClick={() => !disabled && action.onClick(row)}
                                sx={{
                                  cursor: disabled ? 'not-allowed' : 'pointer',
                                  opacity: disabled ? 0.5 : 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  color: action.color === 'error' ? 'error.main' : 'primary.main'
                                }}
                              >
                                {action.icon}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: action.color === 'error' ? 'error.main' : 'primary.main'
                                  }}
                                >
                                  {action.label}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page}
          onPageChange={(_, newPage) => pagination.onPageChange(newPage)}
          rowsPerPage={pagination.rowsPerPage}
          onRowsPerPageChange={(e) =>
            pagination.onRowsPerPageChange(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      )}
    </Paper>
  );
}



import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box
} from '@mui/material';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showToolbar?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns = 5,
  rows = 5,
  showToolbar = true
}) => {
  return (
    <Paper elevation={2}>
      {showToolbar && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Skeleton variant="rectangular" height={40} />
        </Box>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};







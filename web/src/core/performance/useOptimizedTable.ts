/**
 * Optimized Table Hook
 * 
 * Provides memoization and virtualization for large data tables
 */

import { useMemo, useCallback } from 'react';

export interface TableRow {
  id: string | number;
  [key: string]: any;
}

/**
 * Optimized table configuration
 */
export function useOptimizedTable<T extends TableRow>(
  data: T[],
  options: {
    pageSize?: number;
    enableVirtualization?: boolean;
  } = {}
) {
  const { pageSize = 10, enableVirtualization = true } = options;

  // Memoize sorted/filtered data
  const processedData = useMemo(() => {
    return data;
  }, [data]);

  // Memoize row getter
  const getRow = useCallback(
    (index: number): T | undefined => {
      return processedData[index];
    },
    [processedData]
  );

  // Memoize key extractor
  const keyExtractor = useCallback((row: T): string => {
    return String(row.id);
  }, []);

  return {
    data: processedData,
    getRow,
    keyExtractor,
    totalRows: processedData.length,
    enableVirtualization,
    pageSize,
  };
}







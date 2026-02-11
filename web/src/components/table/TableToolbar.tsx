import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../../hooks/useDebounce';

interface TableToolbarProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchPlaceholder = 'Search...',
  onSearch,
  searchValue: controlledValue
}) => {
  const [localValue, setLocalValue] = React.useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : localValue;

  const debouncedValue = useDebounce(value, 300);

  React.useEffect(() => {
    if (debouncedValue !== undefined) {
      onSearch?.(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!isControlled) {
      setLocalValue(newValue);
    }
    onSearch?.(newValue);
  };

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <TextField
        fullWidth
        size="small"
        placeholder={searchPlaceholder}
        value={value}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};







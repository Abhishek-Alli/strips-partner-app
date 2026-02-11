import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Collapse,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

export interface FilterOption {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterValues {
  [key: string]: string | { start: string; end: string } | undefined;
}

interface FilterPanelProps {
  filters: FilterOption[];
  values?: FilterValues;
  onChange?: (values: FilterValues) => void;
  onReset?: () => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  title?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  values: controlledValues,
  onChange,
  onReset,
  collapsible = true,
  defaultExpanded = true,
  title = 'Filters'
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [localValues, setLocalValues] = useState<FilterValues>({});

  const isControlled = controlledValues !== undefined;
  const values = isControlled ? controlledValues : localValues;

  const handleChange = (filterId: string, value: any) => {
    const newValues = { ...values, [filterId]: value };

    if (!isControlled) {
      setLocalValues(newValues);
    }

    onChange?.(newValues);
  };

  const handleReset = () => {
    const emptyValues: FilterValues = {};
    filters.forEach((filter) => {
      emptyValues[filter.id] = undefined;
    });

    if (!isControlled) {
      setLocalValues(emptyValues);
    }

    onChange?.(emptyValues);
    onReset?.();
  };

  const hasActiveFilters = Object.values(values).some(
    (v) => v !== undefined && v !== '' && (typeof v !== 'object' || v.start || v.end)
  );

  const renderFilter = (filter: FilterOption) => {
    const value = values[filter.id];

    switch (filter.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            label={filter.label}
            placeholder={filter.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(filter.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={value || ''}
              label={filter.label}
              onChange={(e) => handleChange(filter.id, e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filter.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            fullWidth
            size="small"
            label={filter.label}
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(filter.id, e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'daterange':
        const rangeValue = (value as { start: string; end: string }) || { start: '', end: '' };
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="From"
              type="date"
              value={rangeValue.start}
              onChange={(e) =>
                handleChange(filter.id, { ...rangeValue, start: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              size="small"
              label="To"
              type="date"
              value={rangeValue.end}
              onChange={(e) =>
                handleChange(filter.id, { ...rangeValue, end: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        backgroundColor: '#ffffff'
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon fontSize="small" color="action" />
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          {hasActiveFilters && (
            <Typography variant="caption" color="primary">
              ({Object.values(values).filter(Boolean).length} active)
            </Typography>
          )}
        </Box>

        {collapsible && (
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* BODY */}
      <Collapse in={!collapsible || expanded}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {filters.map((filter) => (
              <Grid item xs={12} sm={6} md={4} key={filter.id}>
                {renderFilter(filter)}
              </Grid>
            ))}
          </Grid>

          {hasActiveFilters && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleReset}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

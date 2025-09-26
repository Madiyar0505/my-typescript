import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

interface MuiFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MuiFilter({ value, onChange }: MuiFilterProps) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="mui-filter-label">Фильтр</InputLabel>
      <Select
        labelId="mui-filter-label"
        id="mui-filter"
        value={value}
        label="Фильтр"
        onChange={e => onChange(e.target.value)}
      >
        <MenuItem value="all">Все</MenuItem>
        <MenuItem value="paid">Оплачены</MenuItem>
        <MenuItem value="unpaid">Не оплачены</MenuItem>
      </Select>
    </FormControl>
  );
}

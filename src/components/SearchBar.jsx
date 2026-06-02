import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export const SearchBar = ({
  placeholder = 'Search by title, description or location...',
  onSearch,
  onClear,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    setValue('');
    if (onClear) onClear();
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
      }}
    >
      <InputBase
        sx={{ ml: 2, flex: 1, fontSize: '0.95rem' }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{ 'aria-label': placeholder }}
      />
      {value && (
        <IconButton type="button" sx={{ p: '10px' }} aria-label="clear" onClick={handleClear}>
          <ClearIcon />
        </IconButton>
      )}
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton type="submit" sx={{ p: '10px', color: '#1976d2' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;

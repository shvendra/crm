import React, { useState, useEffect } from 'react';
import { TextField, Grid } from '@mui/material';

const SearchComponent = ({ t, handleSearchChange }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Update debounced value after a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay

    return () => clearTimeout(handler); // cleanup on change
  }, [search]);

  // Call the search handler when debouncedSearch changes
  useEffect(() => {
    handleSearchChange(debouncedSearch);
  }, [debouncedSearch, handleSearchChange]);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <TextField
        label={t('SearchByNamePhoneOrCity')}
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />
    </Grid>
  );
};

export default SearchComponent;

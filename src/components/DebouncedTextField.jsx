import React, { useState, useEffect } from 'react';
import { TextField, Grid, FormControl } from '@mui/material';

const DebouncedTextField = ({ label, value, onDebouncedChange, delay = 500 }) => {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      onDebouncedChange(inputValue);
    }, delay);

    return () => clearTimeout(handler);
  }, [inputValue, onDebouncedChange, delay]);

  return (
        <FormControl fullWidth>
      <TextField
        label={label}
        size="small"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      </FormControl>
  );
};

export default DebouncedTextField;

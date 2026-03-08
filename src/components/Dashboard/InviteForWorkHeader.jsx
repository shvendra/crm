import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const InviteForWorkHeader = ({ t, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // optional callback for filtering / API call
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ p: 0, m: 0 }}
    >
      {/* Left Title */}
      <Typography className="dash-head" variant="h6" sx={{ mb: 0 }}>
        {t ? t('inviteForWork') : 'Invite for Work'}
      </Typography>

      {/* Right Search Box */}
      <TextField
        size="small"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder={t ? t('searchreqdash') : 'Search by city or work'}
        variant="outlined"
        sx={{
          width: 180,
          '& .MuiOutlinedInput-root': {
            borderRadius: '7px',
            fontSize: 12,
          },
          mt: "4px", mb: "4px"
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16 }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default InviteForWorkHeader;

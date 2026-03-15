import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from "react-hot-toast";
import { Context } from "../../main";

const InviteForWorkHeader = ({ t, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const { isAuthorized, user, setUser } = useContext(Context);

const handleSearchChange = (e) => {
  const value = e.target.value;

  // Check verification before allowing search
  if (!user?.veryfiedBage) {
    // Show a polite message (toast, alert, or dialog)
toast.error(
  t('verificationRequired') ||
    "Access denied: You are not verified. Please obtain a Verified Badge first to unlock search features. Verification ensures trust and safety for all users."
);

    return; // stop execution
  }

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
  <Typography
    className="dash-head"
    variant="h6"
    sx={{ mb: 0, color: "white !important" }}
  >
    {t ? t("inviteForWork") : "Invite for Work"}
  </Typography>

  {/* Right Search Box */}
 <TextField
  size="small"
  value={searchValue}
  onChange={handleSearchChange}
  placeholder={t ? t("searchreqdash") : "Search by city or work"}
  variant="outlined"
  sx={{
    width: 180,
    mt: "4px",
    mb: "4px",

    "& .MuiOutlinedInput-root": {
      borderRadius: "7px",
      fontSize: 12,
      color: "white",

      "& fieldset": {
        borderColor: "white",
      },

      "&:hover fieldset": {
        borderColor: "white",
      },

      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },

    "& input": {
      color: "white",
    },

    "& input::placeholder": {
      color: "white",
      opacity: 0.7,
    },
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon sx={{ fontSize: 16, color: "white" }} />
      </InputAdornment>
    ),
  }}
/>
</Box>
  );
};

export default InviteForWorkHeader;

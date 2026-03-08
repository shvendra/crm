import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

const DeleteAccount = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    // TODO: Replace this with real account deletion logic (e.g., API call)
    alert('Your account has been permanently deleted.');
    setOpen(false);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
      {/* <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleClickOpen}
      >
        Delete Account Permanently
      </Button> */}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6" color="error">
            Confirm Account Deletion
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Warning:</strong> All your data will be lost. You will not be able to recover your account once it's deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Yes, Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteAccount;

import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import MapWithDirections from './mapWithDirections';

const PathLocationModal = ({ open, onClose, selectedLocation }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); // Mobile detection

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="md">
      {fullScreen ? (
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Directions
            </Typography>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      ) : (
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      )}

      <DialogContent sx={{ px: 0.25, py: 0.25 }}>
        <MapWithDirections selectedLocation={selectedLocation} />
      </DialogContent>
    </Dialog>
  );
};

export default PathLocationModal;

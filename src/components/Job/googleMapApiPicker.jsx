import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 28.6139, // Delhi fallback
  lng: 77.209,
};

const GoogleMapPicker = ({
  open,
  onClose,
  onLocationSelect,
  initialLocation,
}) => {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const searchBoxRef = useRef(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyD7QXM4V8lR0qy3cWU9H83tWjsjVN1aooE",
    libraries,
  });

  // 📍 Get initial or current location
  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setPosition(initialLocation);
      setIsLoading(false);
      return;
    }

    if (!navigator?.geolocation) {
      setPosition(defaultCenter);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos?.coords?.latitude,
          lng: pos?.coords?.longitude,
        };

        if (coords.lat && coords.lng) {
          setPosition(coords);
        } else {
          setPosition(defaultCenter);
        }
        setIsLoading(false);
      },
      () => {
        setPosition(defaultCenter);
        setIsLoading(false);
      }
    );
  }, [initialLocation]);

  // 🖱 Map click / marker drag
  const onMapClick = useCallback((e) => {
    if (!e?.latLng) return;

    setPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  // 🔍 Search location
  const handleSearchChanged = () => {
    const places = searchBoxRef.current?.getPlaces?.();
    if (!places || places.length === 0) return;

    const location = places[0]?.geometry?.location;
    if (!location) return;

    const newPos = {
      lat: location.lat(),
      lng: location.lng(),
    };

    setPosition(newPos);
    map?.panTo?.(newPos);
  };

  // ✅ Confirm
  const handleConfirmLocation = () => {
    if (!position?.lat || !position?.lng) return;
    onLocationSelect?.(position);
    onClose?.();
  };

  if (loadError) return <div>Failed to load Google Maps</div>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullScreen={fullScreen}
      fullWidth
    >
      {/* Header */}
      {fullScreen ? (
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6">
              Select Location
            </Typography>
            <IconButton color="inherit" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      ) : (
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={handleSearchChanged}
        >
          <TextField
            placeholder="Search location"
            fullWidth
            size="small"
            disabled={isLoading}
          />
        </StandaloneSearchBox>
      </Box>

      {/* Map */}
      <DialogContent sx={{ height: fullScreen ? "calc(100vh - 220px)" : 450, p: 0 }}>
        {!isLoaded || isLoading ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          position?.lat &&
          position?.lng && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={position ?? defaultCenter}
              zoom={13}
              onClick={onMapClick}
              onLoad={(mapInstance) => setMap(mapInstance)}
            >
              <Marker
                position={position}
                draggable
                onDragEnd={onMapClick}
              />
            </GoogleMap>
          )
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmLocation}
          variant="contained"
          disabled={!position?.lat || !position?.lng}
        >
          Confirm Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoogleMapPicker;

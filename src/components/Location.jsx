import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import MapIcon from "@mui/icons-material/Map";

import GoogleMapPicker from "../components/Job/googleMapApiPicker";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const CurrentLocation = () => {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openMap, setOpenMap] = useState(false);

  /* Detect current location */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const data = await res.json();
          setLocation(data.display_name);
        } catch {
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false),
    );
  }, []);
useEffect(() => {
  if (editing) {
    setSearchText(location);
  }
}, [editing, location]);
const getAddressFromLatLng = async (lat, lng) => {
  if (!window.google) return "";

  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results?.[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve("");
        }
      }
    );
  });
};

  /* Search suggestions */
  useEffect(() => {
    if (!searchText) return;

    const controller = new AbortController();
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchText}&limit=5`,
      { signal: controller.signal },
    )
      .then((res) => res.json())
      .then((data) => setOptions(data.map((item) => item.display_name)))
      .catch(() => {});

    return () => controller.abort();
  }, [searchText]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LocationOnIcon sx={{ color: "#1b75d2" }} />

        {!editing ? (
          <>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                maxWidth: 260,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {loading
                ? "Detecting location…"
                : location || "Add your location"}
            </Typography>

            {/* <IconButton size="small" onClick={() => setEditing(true)}>
              <EditIcon sx={{ fontSize: 18, color: "#1b75d2" }} />
            </IconButton> */}

            <IconButton size="small" onClick={() => setOpenMap(true)}>
              <MapIcon sx={{ fontSize: 18, color: "#1b75d2" }} />
            </IconButton>
          </>
        ) : (
    <Autocomplete
  freeSolo
  autoFocus
  options={options}
  inputValue={searchText}
  onInputChange={(_, value) => setSearchText(value)}
  onChange={(_, value) => {
    if (value) setLocation(value);
    setEditing(false);
  }}
  sx={{
    width: 300,
    borderBottom: "1px solid #1b75d2",
    borderRadius: "0 0 8px 8px",
    paddingBottom: "0px",
     /* 👇 input root */
    "& .MuiInput-root": {
      paddingRight: 0,
    },

    /* 👇 actual input element */
    "& .MuiInput-root .MuiInput-input": {
      padding: "0px 0px 0px 0px",
    },

    "& .MuiAutocomplete-inputRoot": {
      paddingRight: "1px !important",
    },
  }}
renderInput={(params) => (
  <TextField
    {...params}
    variant="standard"
    placeholder="Search location"
    sx={{ ml: 1 }}
    InputProps={{
      ...params.InputProps,
      disableUnderline: true,

      endAdornment: (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* ❌ Clear */}
          {searchText && (
            <IconButton
              size="small"
              onClick={() => setSearchText("")}
              sx={{ p: 0.5 }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}

          {/* 🔍 Search */}
          <IconButton
            size="small"
            onClick={() => {
              if (!searchText) return;
              setLocation(searchText);
              setEditing(false);
            }}
            sx={{ p: 0.5 }}
          >
            <SearchIcon sx={{ fontSize: 18, color: "#1b75d2", mr: "3px" }} />
          </IconButton>
        </Box>
      ),
    }}
  />
)}



/>



        )}
      </Box>

      {/* Google Map Picker */}
  <GoogleMapPicker
  open={openMap}
  onClose={() => setOpenMap(false)}
  onLocationSelect={async (pos) => {
    const address = await getAddressFromLatLng(pos.lat, pos.lng);
    setLocation(address || `${pos.lat}, ${pos.lng}`);
  }}
/>


    </>
  );
};

export default CurrentLocation;

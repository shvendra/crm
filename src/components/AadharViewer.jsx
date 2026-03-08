import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

const AadharViewer = ({ selectedUser, config }) => {
  const [zoomFront, setZoomFront] = useState(1);
  const [zoomBack, setZoomBack] = useState(1);

  const zoomStep = 0.2;

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {/* Aadhar Front */}
      <div>
        <Typography variant="subtitle1" gutterBottom>
          Front:
        </Typography>

        {selectedUser.kyc?.aadharFront ? (
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <img
              src={
                selectedUser.aadharFront ||
                `${config.FILE_BASE_URL}/${selectedUser.kyc?.aadharFront}`
              }
              alt="Aadhar Front"
              style={{
                maxWidth: "250px",
                maxHeight: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
                transform: `scale(${zoomFront})`,
                transition: "transform 0.3s ease",
              }}
            />
           <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
  <IconButton
    sx={{
      background: "#1876d2",
      color: "#fff",
      "&:hover": { background: "#115293" }
    }}
    onClick={() => setZoomFront((z) => Math.max(0.5, z - zoomStep))}
  >
    <RemoveIcon />
  </IconButton>
  <IconButton
    sx={{
      background: "#1876d2",
      color: "#fff",
      ml: 1,
      "&:hover": { background: "#115293" }
    }}
    onClick={() => setZoomFront((z) => Math.min(3, z + zoomStep))}
  >
    <AddIcon />
  </IconButton>
</Box>

          </Box>
        ) : (
          <Box
            sx={{
              width: 250,
              height: 150,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8f8f8",
              borderRadius: "8px",
              border: "1px dashed #ccc",
              textAlign: "center",
            }}
          >
            <ImageNotSupportedIcon sx={{ fontSize: 48, color: "#999" }} />
            <Typography variant="caption" color="textSecondary">
              No Aadhar Front
            </Typography>
          </Box>
        )}
      </div>

      {/* Aadhar Back */}
      <div>
        <Typography variant="subtitle1" gutterBottom>
          Back:
        </Typography>

        {selectedUser.kyc?.aadharBack ? (
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <img
              src={
                selectedUser.aadharBack ||
                `${config.FILE_BASE_URL}/${selectedUser.kyc?.aadharBack}`
              }
              alt="Aadhar Back"
              style={{
                maxWidth: "250px",
                maxHeight: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
                transform: `scale(${zoomBack})`,
                transition: "transform 0.3s ease",
              }}
            />
           <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
  <IconButton
    sx={{
      background: "#1876d2",
      color: "#fff", // optional: white icon color
      "&:hover": { background: "#115293" }, // optional hover color
    }}
    onClick={() => setZoomBack((z) => Math.max(0.5, z - zoomStep))}
  >
    <RemoveIcon />
  </IconButton>
  <IconButton
    sx={{
      background: "#1876d2",
      color: "#fff",
      ml: 1, // space between buttons
      "&:hover": { background: "#115293" },
    }}
    onClick={() => setZoomBack((z) => Math.min(3, z + zoomStep))}
  >
    <AddIcon />
  </IconButton>
</Box>

          </Box>
        ) : (
          <Box
            sx={{
              width: 250,
              height: 150,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8f8f8",
              borderRadius: "8px",
              border: "1px dashed #ccc",
              textAlign: "center",
            }}
          >
            <ImageNotSupportedIcon sx={{ fontSize: 48, color: "#999" }} />
            <Typography variant="caption" color="textSecondary">
              No Aadhar Back
            </Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default AadharViewer;

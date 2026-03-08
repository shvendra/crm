import React from "react";
import { Box, Typography } from "@mui/material";

const LogoLoader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
    >
      {/* Rotating colorful border around logo */}
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "6px solid transparent",
          borderTopColor: "#1976d2",
          borderRightColor: "#ff9800",
          borderBottomColor: "#4caf50",
          borderLeftColor: "#f44336",
          animation: "rotateBorder 1.5s linear infinite",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/assets/img/logo.png"
          alt="Company Logo"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "contain",
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{ color: "#666", mt: 2, fontSize: "14px", textAlign: "center" }}
      >
        Loading application...
      </Typography>

      {/* Keyframes animation */}
      <style>
        {`
          @keyframes rotateBorder {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default LogoLoader;

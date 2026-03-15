import React from "react";
import { Box, Typography } from "@mui/material";

const LogoLoader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      sx={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
      }}
    >
      {/* Glow circle */}
      <Box
        sx={{
          position: "relative",
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer gradient rotating ring */}
        <Box
          sx={{
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "conic-gradient(from 0deg, #2563eb, #60a5fa, #38bdf8, #2563eb)",
            animation: "spin 2s linear infinite",
            filter: "blur(2px)",
          }}
        />

        {/* Inner white circle */}
        <Box
          sx={{
            position: "absolute",
            width: 95,
            height: 95,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 10px 30px rgba(37,99,235,0.15)",
          }}
        />

        {/* Logo */}
        <Box
          component="img"
          src="/assets/img/logo.png"
          alt="logo"
          sx={{
            width: 60,
            height: 60,
            zIndex: 2,
            animation: "float 3s ease-in-out infinite",
          }}
        />
      </Box>

      {/* Loading text */}
      <Typography
        sx={{
          mt: 3,
          fontSize: "14px",
          fontWeight: 600,
          color: "#475569",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        Loading application
        <span className="dots">...</span>
      </Typography>

      {/* Animations */}
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        .dots::after {
          content: '';
          animation: dots 1.5s steps(4,end) infinite;
        }

        @keyframes dots {
          0%,20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%,100% { content: '...'; }
        }
        `}
      </style>
    </Box>
  );
};

export default LogoLoader;
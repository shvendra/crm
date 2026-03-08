import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Box, Typography, Button, Fade } from "@mui/material";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookie_consent");

    // Show popup only if consent not given
    if (!consent) {
      // Delay 5 seconds before showing
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookie_consent", "accepted", { expires: 365 }); // 1 year
    setShow(false);
  };

  const handleDecline = () => {
    Cookies.set("cookie_consent", "declined", { expires: 365 });
    setShow(false);
  };

  if (!show) return null;

  return (
    <Fade in={show}>
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          left: 20,
          right: 20,
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: 3,
          p: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2000,
          gap: 2,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography variant="body2" sx={{ color: "#333", lineHeight: 1.6 }}>
          <strong>Our website uses cookies</strong> to enhance your browsing
          experience, analyze site traffic, and provide personalized content and
          services. By continuing to use our site, you consent to our use of
          cookies. You can choose to accept or decline below.
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: { xs: 2, sm: 0 } }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleDecline}
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAccept}
            sx={{
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Accept
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default CookieConsent;

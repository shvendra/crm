import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Paper, Fade, Button, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaWhatsapp, FaDownload, FaGooglePlay, FaPhone } from "react-icons/fa"; // Keep react-icons for custom icons
import { useTranslation } from "react-i18next";
import { Phone } from "@mui/icons-material";
export const ChatPopup = () => {
  const [open, setOpen] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Track first user interaction
    const handleUserInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("scroll", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);

      if (userInteracted) {
        const audio = new Audio("/sound.mp3");
        audio.play().catch((err) => {
          console.warn("Audio play blocked:", err);
        });
      } else {
        console.warn("User hasn't interacted yet — sound will be skipped.");
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [userInteracted]);

  const handleClose = () => setOpen(false);

  return (
 <Fade in={open}>
  <Paper
    elevation={10}
    sx={{
      position: "fixed",
      bottom: 24,
      right: 24,
      width: 300,
      p: 2.5,
      borderRadius: 3,
      bgcolor: "#ffffff",
      zIndex: 1300,
      boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
      <Typography variant="subtitle1" fontWeight={600}>
        💬 How may I assist you?
      </Typography>
      <IconButton size="small" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>

    <Typography variant="body2" color="text.secondary" mb={2}>
      Our support team is just a call away. Feel free to reach out if you need help!
    </Typography>

<Stack direction="row" spacing={2}>
  <Button
    variant="contained"
    component="a"
    href="tel:+917089788929"
    sx={{
      width: 64,
      height: 64,
      minWidth: 64,
      minHeight: 64,
      borderRadius: "50%",
      bgcolor: "primary.main",
      color: "#fff",
      "&:hover": {
        bgcolor: "primary.dark",
      },
      boxShadow: 3,
    }}
  >
    <Phone sx={{ fontSize: 32 }} />
  </Button>

  <Button
    variant="outlined"
    href="https://wa.me/15557193421"
    sx={{
      width: 64,
      height: 64,
      minWidth: 64,
      minHeight: 64,
      borderRadius: "50%",
      color: "#25D366",
      borderColor: "#25D366",
      "&:hover": {
        borderColor: "#1ebe5d",
        backgroundColor: "#eafff1",
      },
      boxShadow: 3,
    }}
  >
    <FaWhatsapp size={32} />
  </Button>
</Stack>

  </Paper>
</Fade>

  );
};

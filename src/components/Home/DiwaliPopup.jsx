import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

const DiwaliPopup = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const lastShown = localStorage.getItem("newyear_popup_shown");
    const today = new Date().toDateString();

    // Show popup only once per day
    if (lastShown !== today) {
      setTimeout(() => setOpen(true), 1000);
      localStorage.setItem("newyear_popup_shown", today);
    }
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          color: "white",
          textAlign: "center",
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 0 25px rgba(255, 255, 255, 0.4)",
        },
      }}
    >
      {/* Fireworks Animation */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth * 0.4,
              y: Math.random() * 200,
              opacity: 0,
            }}
            animate={{
              scale: [0, 3, 0],
              opacity: [1, 1, 0],
              x: Math.random() * window.innerWidth * 0.5 - 100,
              y: Math.random() * 200 - 50,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              position: "absolute",
              width: "6px",
              height: "6px",
              background:
                ["#ffd700", "#ff4081", "#00e676", "#40c4ff"][i % 4],
              borderRadius: "50%",
            }}
          />
        ))}
      </Box>

      <DialogContent sx={{ position: "relative", p: 1 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 2, textShadow: "2px 2px 8px rgba(0,0,0,0.4)" }}
        >
          🎊 Happy New Year 🎆
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 3,
            fontSize: "1.1rem",
            fontWeight: 500,
            lineHeight: 1.6,
            textShadow: "1px 1px 6px rgba(0,0,0,0.3)",
          }}
        >
          Wishing you a year filled with success, happiness, and new opportunities ✨
        </Typography>

        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            backgroundColor: "white",
            color: "#0f2027",
            fontWeight: "bold",
            borderRadius: "50px",
            px: 4,
            py: 1,
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
        >
          Start the Year 🎉
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DiwaliPopup;

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

const ConfirmationDialog = ({ open, message, onConfirm, onCancel }) => (
 <Dialog
  disablePortal
  open={open}
  onClose={onCancel}
  fullWidth
  maxWidth="xs"
  PaperProps={{
    sx: {
      borderRadius: "24px",
      p: 0,
      overflow: "hidden",
      zIndex: 1500,
      border: "1px solid rgba(148,163,184,0.18)",
      boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
    },
  }}
  BackdropProps={{
    sx: {
      zIndex: 1400,
      backdropFilter: "blur(3px)",
      backgroundColor: "rgba(15, 23, 42, 0.45)",
    },
  }}
>
  <DialogTitle
    sx={{
      fontSize: { xs: "1.05rem", sm: "1.2rem" },
      fontWeight: 800,
      textAlign: "center",
      pb: 1.2,
      pt: 2.2,
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
      color: "#fff !important",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 30%)",
        pointerEvents: "none",
      }}
    />
    <Box sx={{ position: "relative", zIndex: 1 }}>Confirmation</Box>
  </DialogTitle>

  <DialogContent
    sx={{
      textAlign: "center",
      fontSize: { xs: "0.95rem", sm: "1rem" },
      px: { xs: 2, sm: 3 },
      py: 3,
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      color: "#475569",
      lineHeight: 1.7,
      fontWeight: 500,
    }}
  >
    {message || "Are you sure you want to proceed?"}
  </DialogContent>

  <DialogActions
    sx={{
      justifyContent: "center",
      gap: 1.2,
      pb: 2.2,
      pt: 0.5,
      background: "#fff",
      borderTop: "1px solid #eef2f7",
    }}
  >
    <Button
      size="small"
      onClick={onCancel}
      color="primary"
      variant="outlined"
      sx={{
        textTransform: "none",
        minWidth: 96,
        borderRadius: "12px",
        fontWeight: 700,
        px: 2.5,
      }}
    >
      Cancel
    </Button>

    <Button
      size="small"
      onClick={onConfirm}
      color="primary"
      variant="contained"
      sx={{
        textTransform: "none",
        minWidth: 96,
        borderRadius: "12px",
        fontWeight: 800,
        px: 2.5,
        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        boxShadow: "0 12px 24px rgba(37,99,235,0.22)",
        "&:hover": {
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
        },
      }}
    >
      Yes
    </Button>
  </DialogActions>
</Dialog>
  
);

export default ConfirmationDialog;

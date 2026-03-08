import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const ConfirmationDialog = ({ open, message, onConfirm, onCancel }) => (
    <Dialog
    disablePortal
    open={open}
    onClose={onCancel}
    fullWidth
    maxWidth="xs"
    PaperProps={{
      sx: {
        borderRadius: 3,
        p: { xs: 1.5, sm: 2 },
        zIndex: 1500, // Set a higher z-index for this dialog
      },
    }}
    BackdropProps={{
      sx: {
        zIndex: 1400, // Ensure the backdrop is slightly below the dialog
      },
    }}
  >
    <DialogTitle
      sx={{
        fontSize: { xs: "1.1rem", sm: "1.25rem" },
        fontWeight: 600,
        textAlign: "center",
        pb: 1,
      }}
    >
      Confirmation
    </DialogTitle>
    <DialogContent
      sx={{
        textAlign: "center",
        fontSize: { xs: "0.95rem", sm: "1rem" },
        px: { xs: 1, sm: 2 },
      }}
    >
      {message || "Are you sure you want to proceed?"}
    </DialogContent>
    <DialogActions
      sx={{
        justifyContent: "center",
        pb: { xs: 1, sm: 2 },
      }}
    >
      <Button
        size="small"
        onClick={onCancel}
        color="primary"
        variant="outlined"
        sx={{ textTransform: "none", minWidth: 90 }}
      >
        Cancel
      </Button>
      <Button
        size="small"
        onClick={onConfirm}
        color="primary"
        variant="contained"
        sx={{ textTransform: "none", minWidth: 90 }}
      >
        Yes
      </Button>
    </DialogActions>
  </Dialog>
  
);

export default ConfirmationDialog;

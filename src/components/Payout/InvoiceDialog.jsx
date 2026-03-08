import React, { forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

// ForwardRef wrapper to allow react-to-print to access the DOM element
const InvoiceContent = forwardRef(({ selectedTxn, user, ref }) => {
  if (!selectedTxn) return null;

  return (
    <div ref={ref}>
      <Box sx={{ p: "10px", fontFamily: "monospace" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            BookMyWorker
          </Typography>
          <Typography variant="body2">
            Khasara No 34/1/33, Rewa Semariya Road,
          </Typography>
          <Typography variant="body2">
            Karahiya, District: Rewa, Madhya Pradesh - 486450
          </Typography>
          <Typography variant="body2">
            Email: support@bookmyworkers.com
          </Typography>
          <Typography variant="body2">GSTIN: 23NBJPS3070R1ZQ</Typography>
        </Box>

        {/* Metadata */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Name:</strong> {user?.name || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {user?.email || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {user?.phone || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Address:</strong>{" "}
              {`${user?.block || ""} ${user?.district || ""} ${
                user?.state || ""
              }`}
            </Typography>
            <Typography variant="body2">
              <strong>GST:</strong> {user?.keyc?.gstNumber || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="body2">
              <strong>Invoice Date:</strong>{" "}
              {new Date(selectedTxn.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Bill Type:</strong> Worker Payment
            </Typography>
            <Typography variant="body2">
              <strong>Payment Status:</strong> {selectedTxn.creditStatus}
            </Typography>
            <Typography variant="body2">
              <strong>TX ID:</strong> {selectedTxn.creditTransactionId || "N/A"}
            </Typography>
          </Grid>
        </Grid>

        {/* Payment Table */}
        <Table size="small" sx={{ border: "1px solid #ddd" }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Amount (₹)</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Base Amount</TableCell>
              <TableCell align="right">
                {selectedTxn.amount.toFixed(2)}
              </TableCell>
            </TableRow>
            {user?.role === "Employer" &&
              selectedTxn.platformCharges !== undefined && (
                <>
                  <TableRow>
                    <TableCell>Platform Charges</TableCell>
                    <TableCell align="right">
                      {selectedTxn.platformCharges.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GST Charges</TableCell>
                    <TableCell align="right">
                      {selectedTxn.gstCharges.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </>
              )}
            {user?.role === "Agent" || user?.role === "SelfWorker" && (
              <TableRow>
                <TableCell>Incentive</TableCell>
                <TableCell align="right">
                  {Number(selectedTxn.incentiveCharges || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>
                <strong>Total</strong>
              </TableCell>
              <TableCell align="right">
                (₹){" "}
                <strong>
                  {user?.role === "Employer"
                    ? (
                        Number(selectedTxn.amount) +
                        Number(selectedTxn.platformCharges) +
                        Number(selectedTxn.gstCharges || 0)
                      ).toFixed(2)
                    : Number(selectedTxn.amount).toFixed(2)}
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="caption" color="textSecondary">
            This is a digitally generated invoice and does not require a
            physical signature.
          </Typography>
        </Box>
      </Box>
    </div>
  );
});

InvoiceContent.displayName = "InvoiceContent";

// Main Dialog Component
const InvoiceDialog = ({
  open,
  onClose,
  selectedTxn,
  user,
  handlePrint,
  componentRef,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      onEntered={() => {
        // Notify parent dialog is ready
        setDialogReady(true); // <-- pass this function via props if needed
      }}
      maxWidth="sm"
      fullWidth
    >
      {" "}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1,
          py: 1,
        }}
      >
        <Typography>Invoice</Typography>
        <Tooltip title="Print Invoice">
          <IconButton onClick={handlePrint}>
            <PrintIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 1 }}>
        <InvoiceContent
          ref={componentRef}
          selectedTxn={selectedTxn}
          user={user}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDialog;

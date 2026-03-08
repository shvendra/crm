import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const maskAccountNumber = (account) => account?.replace(/.(?=.{4})/g, "*");

const AgentDetailDialog = ({ open, onClose, selectedAgent, t }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "1.4rem",
          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
          color: "#fff",
          py: 2,
        }}
      >
        {t("AgentPayoutDetails")}
      </DialogTitle>
      <DialogContent dividers>
        {selectedAgent ? (
          <>
            {[
              { label: t("AgentName"), value: selectedAgent?.agent?.name },
              { label: t("MobileNumber"), value: selectedAgent?.agent?.phone },
              {
                label: t("AvailableAmount"),
                value: `₹ ${selectedAgent?.summary?.availableAmount || 0}`,
              },
              {
                label: t("TotalIncentive"),
                value: `₹ ${(selectedAgent?.summary?.incentiveAmount || 0).toFixed(2)}`,
              },
              {
                label: t("BankAccount"),
                value: selectedAgent?.agent?.bankDetails?.accountNumber,
              },
              {
                label: t("IFSCCode"),
                value: selectedAgent?.agent?.bankDetails?.ifscCode || "-",
              },
              { label: t("State"), value: selectedAgent?.agent?.state || "-" },
              {
                label: t("City"),
                value: selectedAgent?.agent?.district || "-",
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1,
                  borderBottom: idx !== 7 ? "1px solid #eee" : "none",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {item.label}:
                </Typography>
                <Typography variant="body1">{item.value}</Typography>
              </Box>
            ))}
          </>
        ) : (
          <Typography align="center" sx={{ py: 3 }}>
            {t("Loading")}...
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          sx={{
            px: 4,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {t("Close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentDetailDialog;

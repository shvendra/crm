import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Fade,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { insertRequirement } from "../../utils/insertRequirement";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | failed

  useEffect(() => {
    const handlePayment = async () => {
      const merchantOrderId = searchParams.get("merchantOrderId");
      const amount = searchParams.get("amount");
      const resultStatus = searchParams.get("status"); // always get latest from URL

      if (!merchantOrderId) {
        toast.error("Payment ID not found");
        setStatus("failed");
        return;
      }

      try {
        setStatus("verifying");

        if (resultStatus === "success" || resultStatus === "completed") {
          const saved = localStorage.getItem("savedRequirementFormData");

          if (saved) {
            const formData = JSON.parse(saved);
            const success = await insertRequirement(formData);

            if (success) {
              localStorage.removeItem("savedRequirementFormData");
            }
          }

          setStatus("success");

          setTimeout(
            () =>
              navigate(
                `/payment/callback/success?merchantOrderId=${merchantOrderId}&amount=${amount}`
              ),
            2000
          );
        } else if (resultStatus === "failed" || resultStatus === "pending") {
          setStatus("failed");
          setTimeout(() => navigate("/failure"), 2000);
        }
      } catch (err) {
        console.error("Error processing requirement:", err);
        setStatus("failed");
        toast.error("Failed to process your order.");
        setTimeout(() => navigate("/failure"), 2000);
      }
    };

    handlePayment();
  }, [navigate, searchParams]); // no need for resultStatus state

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f9f9f9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Fade in timeout={800}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            maxWidth: 420,
            width: "100%",
            backgroundColor: "#ffffffdd",
            backdropFilter: "blur(6px)",
          }}
        >
          <Stack spacing={2} alignItems="center">
            {status === "verifying" && (
              <>
                <CircularProgress size={60} thickness={5} color="primary" />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1976d2", mt: 1 }}
                >
                  Processing Your Payment...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  Please wait while we finalize your order.
                </Typography>
              </>
            )}

            {(status === "success" || status === "completed") && (
              <>
                <CheckCircleIcon sx={{ fontSize: 70, color: "success.main" }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  Payment Completed!
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Your requirement has been submitted successfully.
                </Typography>
              </>
            )}

            {status === "failed" && (
              <>
                <ErrorOutlineIcon sx={{ fontSize: 70, color: "error.main" }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "error.main" }}
                >
                  Payment Failed
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Please contact support or try again: support@bookmyworkers.com
                </Typography>
              </>
            )}
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
};

export default PaymentCallback;

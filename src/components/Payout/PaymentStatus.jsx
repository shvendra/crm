import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const statusPath = location.pathname.includes("success") ? "success" : "failure";
  const merchantOrderId = query.get("merchantOrderId");
  const amount = query.get("amount");

  const isSuccess = statusPath === "success";

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={2}
      bgcolor="#f0f2f5"
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <CardContent>
          {isSuccess ? (
            <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
          ) : (
            <ErrorIcon color="error" sx={{ fontSize: 80 }} />
          )}
          <Typography variant="h5" mt={2} fontWeight="bold">
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </Typography>

          <Typography variant="body1" mt={1}>
            Order ID: <strong>{merchantOrderId}</strong>
          </Typography>

          {isSuccess && (
            <Typography variant="body1" mt={1}>
              Amount Paid: <strong>₹{amount}</strong>
            </Typography>
          )}

          <Typography variant="body2" mt={2} color="text.secondary">
            {isSuccess
              ? "Thank you! Your payment has been successfully processed."
              : "Oops! Something went wrong with the payment. Please try again or contact support."}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.2 }}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentStatus;

import React, { useState, useEffect, useContext } from "react";
import {
  Modal, Box, Typography, IconButton, Divider, Button, Stack,
  ToggleButtonGroup, ToggleButton, TextField, CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../utils/axiosConfig";
import config from "../../config";
import { Context } from "../../main";

const CloserSummaryModal = ({ employerId, pay_request, open, handleClose }) => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [totalDue, setTotalDue] = useState(0);
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [perWorkerWage, setPerWorkerWage] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [closeOption, setCloseOption] = useState("yes");
  const [stat, setStat] = useState("Closed");
  const [customAmount, setCustomAmount] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);

const isContract = ["Contract_Based", "Office_Staff"].includes(pay_request?.req_type);

  useEffect(() => {
    setLoading(true);
    if (pay_request?.req_id_pay && employerId) {
      axios.get(
        `${config.API_BASE_URL}/api/v1/payment/transactions/by-requirement/${pay_request?.req_id_pay}`,
        { withCredentials: true }
      ).then(res => {
        setTotalPaidAmount(res?.data?.totalAmount || 0);
      });

      if (!isContract) {
        axios.get(
          `${config.API_BASE_URL}/api/v1/attendance/get-by-requirement`,
          {
            params: { requirement_id: pay_request?.req_id_pay, employer_id: employerId },
            withCredentials: true,
          }
        ).then(res => {
          const data = Array.isArray(res.data) ? res.data : res.data.data || [];
          const acceptedData = data.filter(item => item.employer_accepted === true);

          const workers = acceptedData.reduce((sum, item) => sum + item.number_of_worker, 0);
          setTotalWorkers(workers);

          const wage = pay_request?.perheadPay || 0;
          setPerWorkerWage(wage);
          setTotalDue(wage * workers);
        });
      } else {
        const wage = pay_request?.perheadPay || 0;
        setPerWorkerWage(wage);
        setTotalDue(wage); // No attendance for contract
      }
    }
    setLoading(false);
  }, [pay_request, employerId]);

  const handleCloseOptionChange = (event, newValue) => {
    if (newValue !== null) {
      setCloseOption(newValue);
      setStat(newValue === "yes" ? "Closed" : "Assigned");
    } 
  };

  const payableAmount =
    closeOption === "yes"
      ? Number(totalDue) - Number(totalPaidAmount)
      : Number(customAmount) || 0;

const handlePayment = async () => {
  const finalAmount = (
    Number(payableAmount) +
    Number(payableAmount) * config.PLATFORM_CHARGES +
    Number(payableAmount) * config.PLATFORM_CHARGES * config.GST_CHARGES
  ).toFixed(2);

  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/api/v1/payment/add-trans`,
      {
        requirementId: pay_request?.req_id_pay,
        employerId: employerId,
        firstName: user?.name,
        gstNumber: user?.kyc?.gstNumber || "",
        employer_phone: user?.phone || '',
        agentId: pay_request?.agentId,
        agentName: pay_request?.agentName,
        ernNumber: pay_request?.ernNumber || "",
        paymentType: "credit",
        ernStatus: stat || "Assigned",
        amount: Number(finalAmount),
        gstCharges: (
          Number(payableAmount) *
          config.PLATFORM_CHARGES *
          config.GST_CHARGES
        ).toFixed(2),
        productName: "Payment for Workers",
      },
      { withCredentials: true }
    );

    if (response?.data?.merchantOrderId && response?.data?.url) {
      setCurrentOrderId(response.data.merchantOrderId);
      // Redirect user to PhonePe payment page
      window.location.href = response.data.url; // <-- FIXED
    }
  } catch (err) {
    console.error("Payment failed:", err);
  }
};


  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: { xs: 320, sm: 450 },
        bgcolor: "background.paper", borderRadius: 3, boxShadow: 24
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="h6" fontWeight={600}>
                Payment Summary
              </Typography>
              <IconButton onClick={handleClose}><CloseIcon /></IconButton>
            </Box>

            <Box sx={{
              p: 1, border: "1px solid #e0e0e0", borderRadius: 2, bgcolor: "#f9f9f9"
            }}>
              <Stack spacing={1}>
                {!isContract && (
                  <>
                    <SummaryRow label="Total Workers:" value={totalWorkers} />
                    <SummaryRow label="Per Worker Wage:" value={`₹${perWorkerWage}`} />
                  </>
                )}
                <SummaryRow label="Total Wage:" value={`₹${totalDue}`} />
                <SummaryRow label="Total Paid:" value={`₹${totalPaidAmount.toFixed(2)}`} />
                <SummaryRow label="Total Due:" value={`₹${(totalDue - totalPaidAmount).toFixed(2)}`} color="error.main" />
              </Stack>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Do you want to close?
            </Typography>
            <ToggleButtonGroup
              value={closeOption}
              exclusive
              onChange={handleCloseOptionChange}
              fullWidth
            >
              <ToggleButton size="small" value="yes">Yes</ToggleButton>
              <ToggleButton size="small" value="no">No</ToggleButton>
            </ToggleButtonGroup>

            {closeOption === "no" && (
              <TextField
                label="Enter Amount"
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                inputProps={{ min: 1, max: totalDue }}
              />
            )}

            <Box mt={1}>
              <Typography variant="caption" color="textSecondary">
                Platform Fee (9.45%): ₹{(payableAmount * config.PLATFORM_CHARGES).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                GST Charges (18%): ₹{((payableAmount * config.PLATFORM_CHARGES) * config.GST_CHARGES).toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="small"
              sx={{ mt: 1, fontWeight: 600 }}
              disabled={payableAmount <= 0}
              onClick={handlePayment}
            >
              Proceed to Pay ₹{(Number(payableAmount) + Number(payableAmount) * config.PLATFORM_CHARGES + Number(payableAmount) * config.PLATFORM_CHARGES * config.GST_CHARGES).toFixed(2)}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

const SummaryRow = ({ label, value, color = "text.primary" }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography fontWeight={600} color={color}>{label}</Typography>
    <Typography fontWeight={600}>{value}</Typography>
  </Box>
);

export default CloserSummaryModal;

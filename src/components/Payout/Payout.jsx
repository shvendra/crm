import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Container,
  AppBar,
  CircularProgress,
  Toolbar,
} from '@mui/material';
import { ArrowBack, Business } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PrintIcon from '@mui/icons-material/Print';
import axios from '../../utils/axiosConfig';
import config from '../../config';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import LanguageSwitcher from '../LanguageSwitcher.jsx';
import TransactionsTable from './TransactionsTable.jsx'
const Payout = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); // For screens below 600px
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { t } = useTranslation();

  const [payoutInfo, setPayoutInfo] = useState({
    availableAmount: 0,
    totalWithdrawn: 0,
    totalIncentive: 0,
    bankDetails: {
      accountNumber: user?.bankDetails?.accountNumber || '',
      ifscCode: user?.bankDetails?.ifscCode || '',
      accountHolder: user?.name || '',
    },
  });

  const [transactions, setTransactions] = useState([]);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);

  const maskedAccount = account => account?.replace(/.(?=.{4})/g, '*');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [open, setOpen] = useState(false);

  const handleRowClick = txn => {
    setSelectedTxn(txn);
    setOpen(true);
  };
  useEffect(() => {
    if (!isAuthorized) navigateTo('/landing');
    // if (user?.role === "Employer" && !user?.isSubscribed) {
    //   navigateTo("/Dashboard");
    // }
  }, [isAuthorized, navigateTo]);

  useEffect(() => {
    if (user?.role === 'Agent' || user?.role === 'SelfWorker') {
      fetchAgentTransactions(user?._id);
    } else {
      fetchEmployerTransactions(user?._id);
    }
  }, [user?._id]);

  const fetchAgentTransactions = async agentId => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/api/v1/payment/transactions/by-agent/${agentId}`,
        { withCredentials: true }
      );
      const {
        debitTransactions,
        availableAmount,
        totalDebit,
        incentiveDebitAmount,
        incentiveAmount,
      } = res.data;
      setTransactions(debitTransactions);
      setPayoutInfo(prev => ({
        ...prev,
        availableAmount: availableAmount || 0,
        totalWithdrawn: totalDebit || 0,
        totalIncentive: incentiveAmount || 0,
        incentiveDebitAmount: incentiveDebitAmount || 0,
      }));
    } catch (error) {
      console.error('Error fetching agent transactions:', error.response?.data || error.message);
    }
  };

  const fetchEmployerTransactions = async employerId => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/api/v1/payment/transactions/by-employer/${employerId}`,
        { withCredentials: true }
      );
      setTransactions(res.data?.transactions);
    } catch (error) {
      console.error('Error fetching employer transactions:', error.response?.data || error.message);
    }
  };

  const handleScreenshot = () => {
    const invoiceElement = document.getElementById('invoice-section');
    if (!invoiceElement) return;

    html2canvas(invoiceElement, {
      scale: 2, // high quality
      useCORS: true,
      backgroundColor: '#ffffff', // ensures clean background
    }).then(canvas => {
      const ctx = canvas.getContext('2d');

      // Add watermark
      const watermarkText = 'BookMyWorker';
      ctx.font = '28px monospace';
      ctx.fillStyle = 'rgba(25, 118, 210, 0.06)'; // Light blue with transparency
      ctx.textAlign = 'center';
      ctx.rotate(-Math.PI / 8); // rotate text diagonally

      // Repeat watermark pattern
      const stepX = 250;
      const stepY = 150;
      for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
        for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
          ctx.fillText(watermarkText, x, y);
        }
      }

      // Reset transform before exporting
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const link = document.createElement('a');
      link.download = 'invoice.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // const handleWithdraw = async () => {
  //   try {
  //     toast.success(t("WithdrawalSuccess"));
  //     setOpenWithdrawDialog(false);
  //   } catch {
  //     toast.error(t("WithdrawalFailed"));
  //   }
  // };

const handleWithdraw = async (e) => {
  // prevent any default submit/navigation
  e?.preventDefault?.();
  e?.stopPropagation?.();

  console.log('handleWithdraw: clicked - start', { availableAmount: payoutInfo?.availableAmount });

  // quick guard
  if (!payoutInfo || payoutInfo.availableAmount <= 0) {
    console.warn('No available amount to withdraw');
    toast.error(t('InsufficientBalanceWarning'));
    return;
  }

  const withdrawalPayload = {
    requirementId: null,
    employerId: user?.role === 'Employer' ? user?._id : null,
    employerName: user?.role === 'Employer' ? user?.name : null,
    agentId: user?.role === 'Agent' || user?.role === 'SelfWorker' ? user?._id : null,
    agentName: user?.role === 'Agent' || user?.role === 'SelfWorker' ? user?.name : null,
    paymentType: 'debit',
    amount: payoutInfo.availableAmount,
    creditTransactionId: null,
    creditStatus: 'pending',
    creditPaymentMethod: 'online',
    withdrawalStatus: 'pending',
    platformCharges: 0,
    incentiveCharges: payoutInfo.totalIncentive > 500 ? payoutInfo.totalIncentive - 500 : 0,
    gstCharges: 0,
    paymentStatus: 'pending',
    isEmployerCredit: false,
    isAgentWithdrawal: true,
  };

  // Log payload length/shape (no sensitive data)
  console.log('handleWithdraw: payload prepared', {
    amount: withdrawalPayload.amount,
    agentId: withdrawalPayload.agentId,
  });

  try {
    // mark UI busy (optional)
    // setIsWithdrawing(true);

    // Use full URL so instance baseURL won't be ambiguous
    const url = `${config.API_BASE_URL}/api/v1/payment/add-withdrawal`;
    console.log('handleWithdraw: calling axios.post', url);

    // 1) Try axios call and log result
    const res = await axios.post(url, withdrawalPayload, { withCredentials: true });
    console.log('handleWithdraw: axios response', res && res.data);

    toast.success(t('WithdrawalSuccess'));
    setOpenWithdrawDialog(false);

    // Refresh transactions
    if (user?.role === 'Agent' || user?.role === 'SelfWorker') {
      fetchAgentTransactions(user._id);
    } else {
      fetchEmployerTransactions(user._id);
    }

    return; // done
  } catch (axiosError) {
    // log everything from axios path
    console.error('handleWithdraw: axios error', {
      message: axiosError?.message,
      responseStatus: axiosError?.response?.status,
      responseData: axiosError?.response?.data,
    });

    // If axios produced a client-side redirect via interceptors, it might have already navigated.
    // Test fallback: call fetch (browser native) to see if same behavior occurs.
    try {
      console.log('handleWithdraw: attempting fetch fallback (for debugging)');
      const fetchRes = await fetch(`${config.API_BASE_URL}/api/v1/payment/add-withdrawal`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withdrawalPayload),
      });
      const fetchData = await fetchRes.json().catch(() => null);
      console.log('handleWithdraw: fetch fallback response', {
        status: fetchRes.status,
        data: fetchData,
      });

      if (fetchRes.ok) {
        toast.success(t('WithdrawalSuccess'));
        setOpenWithdrawDialog(false);
        if (user?.role === 'Agent' || user?.role === 'SelfWorker') {
          fetchAgentTransactions(user._id);
        } else {
          fetchEmployerTransactions(user._id);
        }
        return;
      } else {
        console.warn('handleWithdraw: fetch returned not ok', fetchRes.status);
      }
    } catch (fetchError) {
      console.error('handleWithdraw: fetch fallback error', fetchError);
    }

    // show failure toast at the end
    toast.error(t('WithdrawalFailed'));
  } finally {
    // setIsWithdrawing(false);
    console.log('handleWithdraw: finished (finally)');
  }
};

return (
  <Box
    sx={{
      minHeight: "100vh",
      backgroundColor: "#f5f7fb",
      pb: 8,
    }}
  >
    <Container
      sx={{
        maxWidth: "1200px !important",
        pt: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "rgba(245,247,251,0.92)",
          backdropFilter: "blur(10px)",
          border: "1px solid #e8edf5",
          borderRadius: 3,
          px: 2,
          py: 1.2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            onClick={() => navigateTo(-1)}
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "#f8fafc" },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#1f2937" }} />
          </Box>

          <Box>
            <Typography fontSize={17} fontWeight={800} color="#1f2a44">
              {t("PayoutSummary")}
            </Typography>
            <Typography fontSize={12} color="#6b7280">
              {t("PayoutSummary")} / {t("Transactions")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary Cards */}
      {(user?.role === "Agent" || user?.role === "SelfWorker") && (
        <Card
          sx={{
            mb: 3,
            borderRadius: "20px",
            border: "1px solid #e8edf5",
            boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderBottom: "1px solid #edf2f7",
              background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                fontWeight: 800,
                color: "#1f2a44",
                textAlign: "center",
              }}
            >
              💰 {t("PayoutSummary")}
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    backgroundColor: "#eefaf1",
                    border: "1px solid #ccebd3",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#2e7d32",
                      fontWeight: 700,
                      mb: 0.8,
                    }}
                  >
                    💰 {t("AvailableAmount")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.4rem" },
                      color: "#1b5e20",
                      fontWeight: 800,
                    }}
                  >
                    ₹{payoutInfo.availableAmount?.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    backgroundColor: "#f7effb",
                    border: "1px solid #ead7f7",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#7b1fa2",
                      fontWeight: 700,
                      mb: 0.8,
                    }}
                  >
                    📤 {t("TotalWithdrawn")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      color: "#4a148c",
                      fontWeight: 800,
                    }}
                  >
                    ₹{payoutInfo.totalWithdrawn?.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    backgroundColor: "#fff7eb",
                    border: "1px solid #ffe0ad",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#e65100",
                      fontWeight: 700,
                      mb: 0.8,
                    }}
                  >
                    🎁 {t("TotalIncentive")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      color: "#ef6c00",
                      fontWeight: 800,
                    }}
                  >
                    ₹{payoutInfo.totalIncentive?.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    backgroundColor: "#fff0f5",
                    border: "1px solid #f8c9dc",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#c2185b",
                      fontWeight: 700,
                      mb: 0.8,
                    }}
                  >
                    🎯 {t("TotalIncentiveWithdrawal")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      color: "#ad1457",
                      fontWeight: 800,
                    }}
                  >
                    ₹{payoutInfo.incentiveDebitAmount?.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    backgroundColor: "#eff6ff",
                    border: "1px solid #cfe3ff",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#1565c0",
                      fontWeight: 700,
                      mb: 0.8,
                    }}
                  >
                    🏦 {t("BankAccount")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.2rem" },
                      color: "#0d47a1",
                      fontWeight: 800,
                    }}
                  >
                    {maskedAccount(payoutInfo.bankDetails.accountNumber)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    backgroundColor: "#f4fbef",
                    border: "1px solid #dcedc8",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#2e7d32",
                      fontWeight: 700,
                      mb: 0.8,
                    }}
                  >
                    🔢 {t("IFSCCode")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.2rem" },
                      color: "#33691e",
                      fontWeight: 800,
                    }}
                  >
                    {payoutInfo.bankDetails.ifscCode}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  minWidth: 180,
                  py: 1.4,
                  px: 3,
                  borderRadius: 3,
                  fontSize: "0.98rem",
                  fontWeight: 800,
                  textTransform: "none",
                  background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 10px 22px rgba(37,99,235,0.22)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #1d4ed8, #1e40af)",
                    boxShadow: "0 12px 24px rgba(37,99,235,0.28)",
                  },
                  "&:disabled": {
                    background: "#d1d5db",
                    color: "#7b8794",
                  },
                }}
                onClick={() => {
                  const { accountNumber, ifscCode } = payoutInfo.bankDetails;
                  if (!accountNumber || !ifscCode) {
                    toast.error(t("AddBankDetailsWarning"));
                    return;
                  }
                  if (payoutInfo.availableAmount <= 0) {
                    toast.error(t("InsufficientBalanceWarning"));
                    return;
                  }
                  setOpenWithdrawDialog(true);
                }}
              >
                🏧 {t("Withdraw")}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card
        sx={{
          borderRadius: "20px",
          border: "1px solid #e8edf5",
          boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: "1px solid #edf2f7",
            background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.05rem", md: "1.3rem" },
              fontWeight: 800,
              color: "#1f2a44",
              textAlign: "center",
            }}
          >
            {t("Transactions")}
          </Typography>
        </Box>

        <CardContent sx={{ p: 0 }}>
          <Box sx={{ overflowX: "auto", backgroundColor: "#fff" }}>
            <Table size="small" sx={{ minWidth: 460 }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f8fafc",
                    "& .MuiTableCell-head": {
                      fontWeight: 800,
                      color: "#334155",
                      borderBottom: "1px solid #e8edf5",
                      fontSize: "0.84rem",
                    },
                  }}
                >
                  <TableCell>{t("SN")}</TableCell>
                  <TableCell>{t("Date")}</TableCell>
                  <TableCell>{t("Status")}</TableCell>
                  <TableCell align="right">{t("Amount")}</TableCell>
                  {user?.role === "Agent" ||
                    (user?.role === "SelfWorker" && (
                      <TableCell align="right">{t("Incentive")}</TableCell>
                    ))}
                </TableRow>
              </TableHead>

              <TransactionsTable
                transactions={transactions}
                user={user}
                handleRowClick={handleRowClick}
              />
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Container>

    {/* Withdraw Dialog */}
    <Dialog
      disablePortal
      open={openWithdrawDialog}
      onClose={() => setOpenWithdrawDialog(false)}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 4,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "1.15rem",
          fontWeight: 800,
          borderBottom: "1px solid #edf2f7",
          backgroundColor: "#f8fbff",
        }}
      >
        {t("ConfirmWithdrawal")}
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} mb={1.2} color="#1f2a44">
          {t("WithdrawConfirmationMessage")}
        </Typography>

        <Box
          sx={{
            p: 1.6,
            borderRadius: 3,
            backgroundColor: "#f8fafc",
            border: "1px solid #e8edf5",
            mb: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>{t("AccountNumberLabel")}:</strong>{" "}
            {maskedAccount(payoutInfo.bankDetails.accountNumber)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>{t("IFSCLabel")}:</strong> {payoutInfo.bankDetails.ifscCode}
          </Typography>
          <Typography variant="body2">
            <strong>{t("AccountHolder")}:</strong>{" "}
            {payoutInfo.bankDetails.accountHolder}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="body2" sx={{ mb: 0.8 }}>
          <strong>{t("AvailableAmount")}:</strong> ₹
          {payoutInfo.availableAmount?.toFixed(2)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <strong>{t("incentive")}:</strong> ₹
          {payoutInfo.totalIncentive > 500
            ? payoutInfo.totalIncentive?.toFixed(2) - 500
            : 0}
        </Typography>

        <Typography
          variant="body2"
          mt={2}
          fontStyle="italic"
          color="text.secondary"
        >
          💡 {t("PostWithdrawalNote") || "Amount will be credited to your bank within 24 hours."}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.2, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setOpenWithdrawDialog(false)}
          sx={{
            mr: 1,
            py: 1.3,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {t("Cancel")}
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={handleWithdraw}
          type="button"
          sx={{
            ml: 1,
            py: 1.3,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
            background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
            boxShadow: "0 10px 20px rgba(37,99,235,0.20)",
            "&:hover": {
              background: "linear-gradient(90deg, #1d4ed8, #1e40af)",
            },
          }}
        >
          {t("Transfer")}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Invoice Dialog */}
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 4,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.4,
          fontWeight: 800,
          borderBottom: "1px solid #edf2f7",
          backgroundColor: "#f8fbff",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Invoice
        </Typography>
        <IconButton onClick={handleScreenshot} size="small">
          <PrintIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 1,
          backgroundColor: "#f8fafc",
        }}
      >
        <div id="invoice-section" style={{ margin: "6px" }}>
          {selectedTxn && (
            <Box
              style={{
                border: "1px solid #dbe3ef",
                borderRadius: "12px",
                padding: "16px",
                margin: "16px auto",
                backgroundColor: "#ffffff",
                maxWidth: "800px",
                boxShadow: "0 0 8px rgba(15,23,42,0.06)",
                fontFamily: "monospace",
              }}
            >
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
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
                <Typography variant="body2">
                  GSTIN: 23NBJPS3070R1ZQ
                </Typography>

                <Box
                  sx={{
                    borderBottom: "1px dashed #999",
                    mt: 1,
                    mb: 2,
                    width: "100%",
                  }}
                />
              </Box>

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {user?.name || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Firm:</strong> {user?.kyc?.firmName || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {user?.phone || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {user?.email || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong>{" "}
                    {user?.block + " " + user?.district + " " + user?.state || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>GST:</strong> {user?.kyc?.gstNumber || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedTxn.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Transaction ID:</strong>{" "}
                    {selectedTxn.creditTransactionId || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

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
                    <TableCell>Worker Wage</TableCell>
                    <TableCell align="right">
                      {selectedTxn.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>

                  {user?.role === "Employer" && selectedTxn.platformCharges && (
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

                  {user?.role === "Agent" ||
                    (user?.role === "SelfWorker" && (
                      <TableRow>
                        <TableCell>Incentive</TableCell>
                        <TableCell align="right">
                          {Number(selectedTxn.incentiveCharges || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}

                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="right">
                      (₹)
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

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="caption" color="textSecondary">
                  This is a digitally generated invoice and does not require a physical signature.
                </Typography>
              </Box>
            </Box>
          )}
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.2 }}>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  </Box>
);
};

export default Payout;

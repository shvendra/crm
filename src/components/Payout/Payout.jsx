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
           margin: 'auto',
        mb: 10,
        zIndex: 1,
        position: 'relative',
      }}
    >
      
      {/* Main Content */}
      <Container
        // maxWidth="lg"
        sx={{
          flex: 1,
          // py: 3,
          mb: 5,
        }}
      >
           <Box 
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              pt: 2,
                              pb: 2,
                                mx: "auto"
                            }}
                          >
                            <Box
                               onClick={() => navigateTo(-1)}
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                                "&:hover": { backgroundColor: "#f1f1f1" },
                              }}
                            >
                              <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                            </Box>
                         <Box>
              <Typography fontSize={16} fontWeight={700}>
                {t('PayoutSummary')}
              </Typography>
            
              <Typography fontSize={12} color="text.secondary">
                {t('PayoutSummary')}/{t('Transactions')}
              </Typography>
            </Box>
            
                          </Box>
        {(user?.role === 'Agent' || user?.role === 'SelfWorker') && (
          <Card
            sx={{
              mb: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Box
              sx={{
                background: '#f4f5f8',
                px: 3,
                py: 2,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            >
              <Typography
                variant="h5"
                align="center"
                color="primary"
                sx={{
                  fontWeight: 700,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                💰 {t('PayoutSummary')}
              </Typography>
            </Box>
            <CardContent sx={{ p: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={6}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: '#e8f5e9',
                      borderRadius: 3,
                      border: '1px solid #c8e6c9',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="#2e7d32" fontWeight={500} mb={1}>
                      💰 {t('AvailableAmount')}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#1b5e20', fontWeight: 700 }}>
                      ₹{payoutInfo.availableAmount?.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: '#f3e5f5',
                      borderRadius: 3,
                      border: '1px solid #e1bee7',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="#7b1fa2" fontWeight={500} mb={1}>
                      📤 {t('TotalWithdrawn')}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#4a148c', fontWeight: 600 }}>
                      ₹{payoutInfo.totalWithdrawn?.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: '#fff3e0',
                      borderRadius: 3,
                      border: '1px solid #ffcc02',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="#f57c00" fontWeight={500} mb={1}>
                      🎁 {t('TotalIncentive')}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#e65100', fontWeight: 600 }}>
                      ₹{payoutInfo.totalIncentive?.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: '#fce4ec',
                      borderRadius: 3,
                      border: '1px solid #f8bbd9',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="#c2185b" fontWeight={500} mb={1}>
                      🎯 {t('TotalIncentiveWithdrawal')}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#ad1457', fontWeight: 600 }}>
                      ₹{payoutInfo.incentiveDebitAmount?.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: '#e3f2fd',
                      borderRadius: 3,
                      border: '1px solid #bbdefb',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="#1976d2" fontWeight={500} mb={1}>
                      🏦 {t('BankAccount')}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 600 }}>
                      {maskedAccount(payoutInfo.bankDetails.accountNumber)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: '#f1f8e9',
                      borderRadius: 3,
                      border: '1px solid #dcedc1',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="#388e3c" fontWeight={500} mb={1}>
                      🔢 {t('IFSCCode')}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                      {payoutInfo.bankDetails.ifscCode}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  size="medium"
                  sx={{
                    py: 1.5, // slightly less vertical padding
                    px: 3, // slightly less horizontal padding
                    borderRadius: 4,
                    fontSize: '1rem', // reduced font size for better proportion
                    fontWeight: 'bold',
                    bgcolor: '#1976d2',
                    textTransform: 'none',
                    minWidth: 160, // slightly smaller width
                    boxShadow: '0 3px 12px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      bgcolor: '#1565c0',
                      boxShadow: '0 5px 18px rgba(25, 118, 210, 0.4)',
                    },
                    '&:disabled': {
                      bgcolor: '#e0e0e0',
                      color: '#999',
                    },
                  }}
                  onClick={() => {
                    const { accountNumber, ifscCode } = payoutInfo.bankDetails;
                    if (!accountNumber || !ifscCode) {
                      toast.error(t('AddBankDetailsWarning'));
                      return;
                    }
                    if (payoutInfo.availableAmount <= 0) {
                      toast.error(t('InsufficientBalanceWarning'));
                      return;
                    }
                    setOpenWithdrawDialog(true);
                  }}
                >
                  🏧 {t('Withdraw')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Transactions Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
            },
          }}
        >
          <Box
            sx={{
              background: '#f4f5f8',
              px: 3,
              py: 2,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Typography
              variant="h5"
              align="center"
              color="primary"
              sx={{
                fontWeight: 700,
                textShadow: '0 1px 2px rgba(229, 218, 218, 0.1)',
              }}
            >
              {t('Transactions')}
            </Typography>
          </Box>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 140 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: '#f8f9fa',
                      '& .MuiTableCell-head': {
                        fontWeight: 600,
                        color: '#333',
                        borderBottom: '2px solid #e0e0e0',
                      },
                    }}
                  >
                    <TableCell>{t('SN')}</TableCell>
                    {/* <TableCell>{t('TransactionID')}</TableCell> */}
                    <TableCell>{t('Date')}</TableCell>
                    {/* <TableCell>{t("Type")}</TableCell> */}
                    <TableCell>{t('Status')}</TableCell>
                    <TableCell align="right">{t('Amount')}</TableCell>
                    {user?.role === 'Agent' ||
                      (user?.role === 'SelfWorker' && (
                        <TableCell align="right">{t('Incentive')}</TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TransactionsTable transactions={transactions} user={user} handleRowClick={handleRowClick}/>
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
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.2rem' }}>
          {t('ConfirmWithdrawal')}
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            {t('WithdrawConfirmationMessage')}
          </Typography>

          <Box mb={1}>
            <Typography variant="body2">
              <strong>{t('AccountNumberLabel')}:</strong>{' '}
              {maskedAccount(payoutInfo.bankDetails.accountNumber)}
            </Typography>
            <Typography variant="body2">
              <strong>{t('IFSCLabel')}:</strong> {payoutInfo.bankDetails.ifscCode}
            </Typography>
            <Typography variant="body2">
              <strong>{t('AccountHolder')}:</strong> {payoutInfo.bankDetails.accountHolder}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Typography variant="body2">
            <strong>{t('AvailableAmount')}:</strong> ₹{payoutInfo.availableAmount?.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>{t('incentive')}:</strong> ₹
            {payoutInfo.totalIncentive > 500 ? payoutInfo.totalIncentive?.toFixed(2) - 500 : 0}
          </Typography>

          <Typography variant="body2" mt={2} fontStyle="italic" color="text.secondary">
            💡 {t('PostWithdrawalNote') || 'Amount will be credited to your bank within 24 hours.'}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpenWithdrawDialog(false)}
            sx={{
              mr: 1,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleWithdraw}
            type="button"
            sx={{
              ml: 1,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              bgcolor: '#1976d2',
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                bgcolor: '#1565c0',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
              },
            }}
          >
            {t('Transfer')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 1,
            py: 1,
            fontWeight: 700,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Invoice
          </Typography>
          <IconButton onClick={handleScreenshot} size="small">
            <PrintIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 1, // Remove default padding and apply minimal
          }}
        >
          {' '}
          <div id="invoice-section" style={{ margin: '5px' }}>
            {selectedTxn && (
              <Box
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '16px',
                  margin: '16px auto',
                  backgroundColor: '#ffffff',
                  maxWidth: '800px',
                  boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                  fontFamily: 'monospace',
                }}
              >
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    BookMyWorker
                  </Typography>
                  <Typography variant="body2">Khasara No 34/1/33, Rewa Semariya Road,</Typography>
                  <Typography variant="body2">
                    Karahiya, District: Rewa, Madhya Pradesh - 486450
                  </Typography>
                  <Typography variant="body2">Email: support@bookmyworkers.com</Typography>
                  <Typography variant="body2">GSTIN: 23NBJPS3070R1ZQ</Typography>

                  {/* 👇 Divider after address */}
                  <Box
                    sx={{
                      borderBottom: '1px dashed #999',
                      mt: 1,
                      mb: 2,
                      width: '100%',
                    }}
                  />
                </Box>

                {/* Bill Metadata */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {user?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Firm:</strong> {user?.kyc?.firmName || 'N/A'}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Phone:</strong> {user?.phone || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {user?.email || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong>{' '}
                      {user?.block + ' ' + user?.district + ' ' + user?.state || 'N/A'}
                    </Typography>

                    <Typography variant="body2">
                      <strong>GST:</strong> {user?.kyc?.gstNumber || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2">
                      <strong>Date:</strong> {new Date(selectedTxn.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Transaction ID:</strong> {selectedTxn.creditTransactionId || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Payment Table */}
                <Table size="small" sx={{ border: '1px solid #ddd' }}>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
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
                      <TableCell align="right">{selectedTxn.amount.toFixed(2)}</TableCell>
                    </TableRow>
                    {user?.role === 'Employer' && selectedTxn.platformCharges && (
                      <>
                        <TableRow>
                          <TableCell>Platform Charges</TableCell>
                          <TableCell align="right">
                            {selectedTxn.platformCharges.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GST Charges</TableCell>
                          <TableCell align="right">{selectedTxn.gstCharges.toFixed(2)}</TableCell>
                        </TableRow>
                      </>
                    )}
                    {user?.role === 'Agent' ||
                      (user?.role === 'SelfWorker' && (
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
                          {user?.role === 'Employer'
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
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    This is a digitally generated invoice and does not require a physical signature.
                  </Typography>
                </Box>
              </Box>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payout;

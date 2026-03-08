import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  CircularProgress,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import { keyframes } from '@mui/system';
import toast from 'react-hot-toast';
import axios from "../../utils/axiosConfig";
import config from '../../config';
import { insertRequirement } from '../../utils/insertRequirement';
import { Context } from '../../main';

const scrollLeftToRight = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
`;

const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const SubscriptionModel = ({ employerId, open, handleClose }) => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [agents, setAgents] = useState([]);

  // Determine registration fee based on employer type
  let REGISTRATION_FEE = 0;
  if (user?.role === 'Employer') {
    const employerTypes = user.employerType || {};
    const priorityOrder = ['industry', 'agency', 'contractor', 'individual'];
    const feeByType = {
      industry: 499,
      agency: 299,
      contractor: 199,
      individual: 99,
    };
    const matchedType = priorityOrder.find(type => employerTypes[type]);
    REGISTRATION_FEE = feeByType[matchedType] || 99;
  }

  // Fetch verified agents for UI
  useEffect(() => {
    const fetchAgents = async () => {
      if (!user?.state) return;
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/v1/user/getAllAgents`, {
          params: { state: user.state },
          withCredentials: true,
        });
        if (res.data.success) {
          const agentsWithRating = res.data.agents.map(agent => ({
            ...agent,
            rating: Math.floor(Math.random() * 3) + 3, // 3–5 stars
          }));
          setAgents(agentsWithRating);
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
      }
    };
    fetchAgents();
  }, [user?.state]);

  const maskPhone = phone => {
    if (!phone) return '**********';
    return `${phone.slice(0, 2)}*****${phone.slice(-3)}`;
  };

  const SummaryRow = ({ label, value }) => (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
      <Typography variant="body2" sx={{ color: '#1e88e5', fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: '#4a4a4a', fontWeight: 700 }}>
        {value}
      </Typography>
    </Stack>
  );

  // 🔹 Payment Handler
  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/v1/payment/add-trans`,
        {
          employerId,
          firstName: user?.name || '',
          email: user?.email || '',
          employer_phone: user?.phone || '',
          paymentType: 'subscription',
          amount: Number((REGISTRATION_FEE + REGISTRATION_FEE * config.GST_CHARGES).toFixed(2)),
          gstCharges: REGISTRATION_FEE * config.GST_CHARGES,
          productName: 'Registration Subscription Fee',
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (response.data?.url) {
        localStorage.setItem('pendingOrderId', response.data.merchantOrderId);
        // 🔸 Redirect directly to payment page (no iframe)
        // window.location.href = response.data.url;
        // window.open(response.data.url, '_blank');
        if (response.data?.url) {
        localStorage.setItem('pendingOrderId', response.data.merchantOrderId);
        setTimeout(() => {
          window.open(response.data.url, '_self');
        }, 1000);
      }


      } else {
        toast.error('Payment URL not received');
      }
    } catch (error) {
      console.error('Payment initiation failed', error);
      toast.error('Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle payment status after success/failure redirect
  // useEffect(() => {
  //   const checkPaymentStatus = async () => {
  //     const orderId = localStorage.getItem('pendingOrderId');
  //     if (!orderId) return;

  //     try {
  //       const res = await axios.get(
  //         `${config.API_BASE_URL}/api/v1/payment/status/${orderId}/subscription`,
  //         { withCredentials: true }
  //       );

  //       if (res.data?.status?.toLowerCase() === 'completed' && user.isSubscribed) {
  //         const saved = localStorage.getItem('savedRequirementFormData');
  //         if (saved) {
  //           const formData = JSON.parse(saved);
  //           const success = await insertRequirement(formData);
  //           if (success) {
  //             localStorage.removeItem('savedRequirementFormData');
  //             window.location.href = `/payment/callback/success?merchantOrderId=${orderId}&amount=${res.data.amount}`;
  //           }
  //         }
  //       } else if (res.data?.status === 'FAILED') {
  //         window.location.href = `/failure?merchantOrderId=${orderId}`;
  //       }
  //     } catch (err) {
  //       console.error('Payment status check failed:', err);
  //     }
  //   };

  //   checkPaymentStatus();
  // }, []);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 360, sm: 480 },
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 24,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="250px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* 🔹 Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f1f8ff' }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary">
                🌟 Trusted Agents in Your Area
              </Typography>
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* 🔹 Agent Carousel */}
           {/* 🔹 Agent Carousel */}
<Box sx={{ overflowX: 'hidden', px: 1, py: 1 }}>
  <Stack
    direction="row"
    spacing={1}
    sx={{
      animation: `${scrollLeftToRight} 15s linear infinite`, // faster scroll
    }}
  >
    {[...agents, ...agents]
      .filter(agent => agent.status === 'Verified')
      .slice(0, 20)
      .map((agent, idx) => (
        <Box
          key={idx}
          sx={{
            width: 90,
            flexShrink: 0,
            p: 1,
            borderRadius: 2,
            backgroundColor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', // center vertically
          }}
        >
          <Avatar
            src={
              agent?.profilePhoto
                ? `${config.API_BASE_URL}/${agent?.profilePhoto}`.replace(/([^:]\/)\/+/g, '$1')
                : '/usericon.png'
            }
            alt={agent.name}
            sx={{
              width: 50,
              height: 50,
              animation: `${blinkAnimation} 1.5s infinite`,
              border: '2px solid #1976d2',
              mb: 0.5,
            }}
          />
          <Typography variant="body2" fontWeight={600} color="darkgreen">
            {agent.name?.split(' ')[0] || '-'}
          </Typography>
          <Typography variant="caption" color="blue">
            {maskPhone(agent.phone)}
          </Typography>
          <Box mt={0.5}>
            {Array.from({ length: 5 }, (_, i) => (
              <StarIcon
                key={i}
                fontSize="inherit"
                sx={{
                  color: i < agent.rating ? '#ffc107' : '#e0e0e0',
                  fontSize: '14px',
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
  </Stack>
</Box>


            {/* 🔹 Payment Summary */}
            <Box sx={{ p: 2, backgroundColor: '#f0f4f8', borderRadius: 3 }}>
              <SummaryRow label="👤 Name" value={user?.name || '-'} />
              <SummaryRow label="📞 Phone" value={user?.phone || '-'} />
              <SummaryRow label="💳 Fee" value={`₹${REGISTRATION_FEE}`} />
              <SummaryRow
                label="🧾 GST (18%)"
                value={`₹${(REGISTRATION_FEE * config.GST_CHARGES).toFixed(2)}`}
              />
              <SummaryRow
                label="💰 Total"
                value={`₹${(
                  REGISTRATION_FEE +
                  REGISTRATION_FEE * config.GST_CHARGES
                ).toFixed(2)}`}
              />
                    <Box
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      background: 'linear-gradient(to right, #bbdefb, #e3f2fd)',
                      borderRadius: '30px',
                      p: 1,
                      fontWeight: 'bold',
                      color: '#0d47a1',
                      fontSize: '1rem',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
                      width: 'fit-content',
                      mx: 'auto',
                    }}
                  >
                    🎯 Validity: <span style={{ color: '#0b3c91' }}>Lifetime Access</span>
                  </Box>
                     <Box
                  sx={{
                    backgroundColor: '#e8f0fe',
                    borderLeft: '6px solid #1976d2',
                    borderRadius: 2,
                    p: 1,
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={1} color="primary">
                    🌟 Why Subscribe?
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">✅ Get Immediate Daily Workers.</Typography>
                    <Typography variant="body2">✅ Verified and Skilled Workers.</Typography>
                    <Typography variant="body2">✅ Hire as per your Budget & Work.</Typography>
                    <Typography variant="body2">✅ Lifetime Access — One-time Fee.</Typography>
                  </Stack>
                </Box>

              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handlePayment}
                sx={{
                  mt: 2,
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                }}
              >
                🔒 Pay ₹{(REGISTRATION_FEE + REGISTRATION_FEE * config.GST_CHARGES).toFixed(2)} Securely
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default SubscriptionModel;

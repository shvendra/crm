import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Context } from '../../main';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import toast from 'react-hot-toast';
import config from '../../config';
import { Visibility, VisibilityOff, ArrowBack, Business } from '@mui/icons-material';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('enterEmail');
  const [otpTimer, setOtpTimer] = useState(0);
  const { isAuthorized } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthorized) navigate('/dashboard');
  }, [isAuthorized]);

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const imageList = ['/slide-log.jpg', '/slide-log-2.jpg'];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
  };

  const handleSendOtp = async () => {
    if (!email || !role) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setOtpTimer(60);
    // Step 1: Get temporary session token
    const sessionRes = await fetch(`${config.API_BASE_URL}/api/v1/session/start`);
    const { sessionToken } = await sessionRes.json();

      const res = await fetch(`${config.API_BASE_URL}/api/v1/otp/send-otp`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-session-token': sessionToken,
  },
        body: JSON.stringify({
          email: email.includes('@') ? email : undefined,
          phone: email.includes('@') ? undefined : email,
          role: role,
        }),
      });
      const data = await res.json();
      if (res?.ok) {
        toast.success('OTP sent successfully!');
        setStep('verifyOtp');
      } else {
        setOtpTimer(0);
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setOtpTimer(0);
      toast.error('Something went wrong!');
    }
  };

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/otp/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.includes('@') ? email : undefined,
          phone: email.includes('@') ? undefined : email,
          otp,
          role: "resetPassword",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('OTP verified successfully');
        setStep('resetPassword');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Something went wrong');
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/user/update/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.includes('@') ? email : undefined,
          phone: email.includes('@') ? undefined : email,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Password updated successfully');
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'enterEmail':
        return (
          <>
            {/* Header */}

            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Forgot Password?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  fontWeight: 'normal',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Enter your email or mobile number to reset
              </Typography>
            </Box>

            {/* Role Selection */}
            <FormControl
              fullWidth
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
              }}
            >
              <InputLabel>Select Your Role</InputLabel>
              <Select value={role} onChange={e => setRole(e.target.value)} label="Select Your Role">
                <MenuItem value="Agent">Agent (Worker Supplier)</MenuItem>
                <MenuItem value="SelfWorker">Self Worker (Individual)</MenuItem>
                <MenuItem value="Employer">Employer (Work Provider)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="WhatsApp Number"
              placeholder="WhatsApp Number"
              value={email}
              onChange={e => setEmail(e.target.value)}
              variant="outlined"
              required
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
              }}
            />

            <Button
              onClick={handleSendOtp}
              fullWidth
              variant="contained"
              disabled={otpTimer > 0}
              sx={{
                py: 2,
                borderRadius: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                bgcolor: '#1976d2',
                mb: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
              }}
            >
              {otpTimer > 0 ? `Wait ${otpTimer}s` : 'Send OTP'}
            </Button>
          </>
        );

      case 'verifyOtp':
        return (
          <>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Verify OTP
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  fontWeight: 'normal',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Enter the 6-digit code sent to your {email.includes('@') ? 'email' : 'mobile'}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Enter OTP"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              variant="outlined"
              required
              inputProps={{ maxLength: 6 }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
              }}
            />

            {otpTimer > 0 ? (
              <Typography align="center" sx={{ mb: 4, color: 'text.secondary' }}>
                Resend OTP in {otpTimer}s
              </Typography>
            ) : (
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Link
                  component="button"
                  onClick={handleSendOtp}
                  sx={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Resend OTP
                </Link>
              </Box>
            )}

            <Button
              onClick={handleOtpVerify}
              fullWidth
              variant="contained"
              sx={{
                py: 2,
                borderRadius: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                bgcolor: '#1976d2',
                mb: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
              }}
            >
              Verify OTP
            </Button>
          </>
        );

      case 'resetPassword':
        return (
          <>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Reset Password
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  fontWeight: 'normal',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Enter your new password
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="New Password"
              placeholder="Enter new password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              variant="outlined"
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#666' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              placeholder="Confirm new password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              variant="outlined"
              required
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#666' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              onClick={handleUpdatePassword}
              fullWidth
              variant="contained"
              sx={{
                py: 2,
                borderRadius: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                bgcolor: '#1976d2',
                mb: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
              }}
            >
              Update Password
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f5f5',
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/landing')} sx={{ color: '#1976d2', mr: 1 }}>
              <ArrowBack />
            </IconButton>
            {/* <Business sx={{ color: '#1976d2', mr: 1 }} />
            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
              Book<span style={{ color: '#1976d2' }}>My</span>Worker
            </Typography> */}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageSwitcher />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          {renderStep()}

          {/* Back to Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Remember your password?{' '}
              <Link
                component={Link}
                to="/login"
                sx={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Login Now
              </Link>
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 1, maxWidth: '320px', mx: 'auto' }}>
          <Typography
            variant="body2"
            sx={{
              color: '#333',
              fontSize: '0.85rem',
              fontWeight: 500,
              mb: 1.5,
              lineHeight: 1.4,
            }}
          >
            If you face any issues while using the application, feel free to reach out:
          </Typography>
         <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                }}
              >
                Phone:  <span style={{ color: '#1976d2', fontWeight: 'bold'}}>+91 7389791873</span>
                <br />
                Email: <span style={{ color: '#1976d2', fontWeight: 'bold'}}>support@bookmyworkers.com</span>
              </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;

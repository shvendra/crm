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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import toast from 'react-hot-toast';
import config from '../../config';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';

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
  }, [isAuthorized, navigate]);

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const handleSendOtp = async () => {
    if (!email || !role) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setOtpTimer(60);
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

  const authFieldSx = {
    mb: 1.8,
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#fafafa',
      minHeight: { xs: 46, md: 48 },
      '& fieldset': {
        borderColor: '#d9dee7',
      },
      '&:hover fieldset': {
        borderColor: '#b8c0cc',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2bb7bb',
        borderWidth: '1px',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#98a2b3',
    },
  };

  const authSelectSx = {
    borderRadius: '10px',
    backgroundColor: '#fafafa',
    minHeight: 48,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d9dee7',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#b8c0cc',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2bb7bb',
      borderWidth: '1px',
    },
  };

  const renderStepTitle = () => {
    if (step === 'enterEmail') return 'Forgot Password?';
    if (step === 'verifyOtp') return 'Verify OTP';
    if (step === 'resetPassword') return 'Reset Password';
    return '';
  };

  const renderStepSubtitle = () => {
    if (step === 'enterEmail') return 'Enter your email or mobile number to reset';
    if (step === 'verifyOtp') {
      return `Enter the 6-digit code sent to your ${email.includes('@') ? 'email' : 'mobile'}`;
    }
    if (step === 'resetPassword') return 'Enter your new password';
    return '';
  };

  const renderStep = () => {
    switch (step) {
      case 'enterEmail':
        return (
          <>
            <FormControl fullWidth required sx={{ mb: 1.8 }}>
              <InputLabel>Select Your Role</InputLabel>
              <Select
                value={role}
                onChange={e => setRole(e.target.value)}
                label="Select Your Role"
                sx={authSelectSx}
              >
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
              sx={{ ...authFieldSx, mb: 2.2 }}
            />

            <Button
              onClick={handleSendOtp}
              fullWidth
              variant="contained"
              disabled={otpTimer > 0}
              sx={{
                height: 46,
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: '#2bb7bb',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#24a3a7',
                  boxShadow: 'none',
                },
                '&:disabled': {
                  bgcolor: '#d0d5dd',
                  color: '#fff',
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
            <TextField
              fullWidth
              label="Enter OTP"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              variant="outlined"
              required
              inputProps={{ maxLength: 6 }}
              sx={{ ...authFieldSx, mb: 1.2 }}
            />

            {otpTimer > 0 ? (
              <Typography align="center" sx={{ mb: 2.2, color: '#667085', fontSize: 14 }}>
                Resend OTP in {otpTimer}s
              </Typography>
            ) : (
              <Box sx={{ textAlign: 'center', mb: 2.2 }}>
                <Link
                  component="button"
                  onClick={handleSendOtp}
                  sx={{
                    color: '#2bb7bb',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
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
                height: 46,
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: '#2bb7bb',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#24a3a7',
                  boxShadow: 'none',
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
            <TextField
              fullWidth
              label="New Password"
              placeholder="Enter new password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              variant="outlined"
              required
              sx={authFieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#667085' }}
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
              sx={{ ...authFieldSx, mb: 2.2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#667085' }}
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
                height: 46,
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: '#2bb7bb',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#24a3a7',
                  boxShadow: 'none',
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
        minHeight: '100vh',
        width: '100%',
        bgcolor: { xs: '#fff', md: '#f2f4f7' },
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'center',
        px: { xs: 0, md: 2 },
        py: { xs: 0, md: 4 },
      }}
    >
      <Container
        maxWidth="sm"
        disableGutters
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', md: 460 },
            bgcolor: '#fff',
            borderRadius: { xs: 0, md: '14px' },
            boxShadow: { xs: 'none', md: '0 10px 40px rgba(16,24,40,0.08)' },
            px: { xs: 2, sm: 3.5 },
            py: { xs: 2.5, sm: 3.5 },
            minHeight: { xs: '100vh', md: 'auto' },
            position: 'relative',
          }}
        >
          {/* top row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <IconButton
              onClick={() => navigate('/landing')}
              sx={{ color: '#344054', p: 0.8 }}
            >
              <ArrowBack />
            </IconButton>

            <LanguageSwitcher />
          </Box>

          {/* logo / heading */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2.5, md: 3 } }}>
            <Box
              component="img"
              src="/app/logo.svg"
              alt="BookMyWorker"
              sx={{
                height: 56,
                objectFit: 'contain',
                mx: 'auto',
                mb: 1.2,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: 28, md: 30 },
                fontWeight: 800,
                color: '#101828',
                lineHeight: 1.2,
                mb: 0.8,
              }}
            >
              {renderStepTitle()}
            </Typography>
            <Typography
              sx={{
                color: '#667085',
                fontSize: 14,
                maxWidth: 320,
                mx: 'auto',
              }}
            >
              {renderStepSubtitle()}
            </Typography>
          </Box>

          <Box
            sx={{
              width: '100%',
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            {renderStep()}

            <Box sx={{ textAlign: 'center', mt: 2.2 }}>
              <Typography sx={{ color: '#475467', fontSize: 14 }}>
                Remember your password?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#101828',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  Login Now
                </Link>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography
              sx={{
                color: '#667085',
                fontSize: '0.8rem',
                lineHeight: 1.6,
              }}
            >
              If you face any issues while using the application, feel free to reach out:
              <br />
              Phone:{' '}
              <span style={{ color: '#2bb7bb', fontWeight: 700 }}>
                +91 7389791873
              </span>
              <br />
              Email:{' '}
              <span style={{ color: '#2bb7bb', fontWeight: 700 }}>
                support@bookmyworkers.com
              </span>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
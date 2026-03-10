import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { FaPhone } from 'react-icons/fa';
import { RiLock2Fill } from 'react-icons/ri';
import axios from "../../utils/axiosConfig";
import toast from 'react-hot-toast';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../main';

const AdminLogin = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const navigate = useNavigate();

  const phoneRef = useRef(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const [role, setRole] = useState('Admin');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const handleRoleToggle = (event) => {
    const checked = event.target.checked;
    setIsSuperAdmin(checked);
    setRole(checked ? 'SuperAdmin' : 'Admin');
  };

  const didCallCaptcha = useRef(false);

  // Fetch captcha from backend
  const getCaptcha = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/v1/admin/captcha`, {
        withCredentials: true,
      });
      setCaptchaImage(res.data.image);
      setIsCaptchaVerified(false);
      setCaptchaInput('');
    } catch {
      toast.error('Failed to load CAPTCHA');
    }
  };

  useEffect(() => {
    if (!didCallCaptcha.current) {
      didCallCaptcha.current = true;
      getCaptcha();
    }
  }, []);

  // ✅ Verify captcha & auto-send OTP
  const verifyCaptchaAndSendOtp = async () => {
    if (!captchaInput) return toast.error('Please enter CAPTCHA');
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/admin/verify-captcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ captcha: captchaInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('CAPTCHA verified successfully!');
        setIsCaptchaVerified(true);
        // ✅ Automatically send OTP
        await sendOtp();
      } else {
        toast.error(data.message || 'Invalid CAPTCHA');
        setIsCaptchaVerified(false);
        getCaptcha();
      }
    } catch {
      toast.error('Error verifying CAPTCHA');
    }
  };

  // Send OTP
  const sendOtp = async () => {
    if (!phone) {
      toast.error('Please enter phone number');
      phoneRef.current?.focus();
      return;
    }

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/otp/send-otp-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone, role }),
      });
      const data = await res.json();

      if (res.ok) {
        setOtpTimer(60);
        setIsOtpSent(true);
        toast.success('OTP sent successfully!');
      } else toast.error(data.message || 'Failed to send OTP');
    } catch {
      toast.error('Something went wrong!');
    }
  };

  // Verify OTP & login
  const handleOtpVerify = async () => {
    if (!phone || !otp) return toast.error('Please enter phone and OTP');
    if (otp.length !== 6) return toast.error('OTP must be 6 digits');

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/otp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone, otp, role, captcha: captchaInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const loginRes = await axios.post(
          `${config.API_BASE_URL}/api/v1/admin/login`,
          { phone, role },
          { withCredentials: true }
        );
        toast.success(loginRes.data.message);
        setIsAuthorized(true);
        setUser(loginRes.data.user || null);
      } else toast.error(data.message || 'Invalid OTP');
    } catch {
      toast.error('Something went wrong while verifying OTP');
      getCaptcha();
    }
  };

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Redirect on login
  useEffect(() => {
    if (isAuthorized) navigate('/dashboard', { replace: true });
  }, [isAuthorized]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ p: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Admin Login
            </Typography>

            <TextField
              label="Mobile Number"
              inputRef={phoneRef}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              type="number"
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaPhone />
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Checkbox checked={isSuperAdmin} onChange={handleRoleToggle} />}
              label="Login as Super Admin"
            />

            {!isOtpSent && (
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                <img
                  src={captchaImage}
                  alt="captcha"
                  style={{ height: 30, cursor: 'pointer' }}
                  onClick={getCaptcha}
                />
                <TextField
                  label="Enter CAPTCHA"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                  size="small"
                  fullWidth
                  sx={{ ml: 2 }}
                />
                <Button size="small" variant="outlined" onClick={verifyCaptchaAndSendOtp} sx={{ ml: 2 }}>
                  Verify
                </Button>
              </Box>
            )}

            {isOtpSent && (
              <>
                <TextField
                  label="OTP"
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RiLock2Fill />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button onClick={handleOtpVerify} fullWidth variant="contained" sx={{ mt: 2 }}>
                  Login
                </Button>
                {otpTimer > 0 ? (
                  <Typography align="center" sx={{ mt: 1 }}>
                    Resend OTP in {otpTimer}s
                  </Typography>
                ) : (
                  <Button fullWidth variant="text" onClick={sendOtp}>
                    Resend OTP
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminLogin;

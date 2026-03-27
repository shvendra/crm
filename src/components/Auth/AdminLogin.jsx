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
      // setCaptchaImage(res.data.image);
      console.log(res);
setCaptchaImage(res.data.captchaImage);
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
      minHeight: "100vh",
       // 👇 background logic
    backgroundColor: { xs: "#fff", md: "transparent" },
    backgroundImage: {
      xs: "none",
      md: "url('/app/images/background/urgent_worker.png')", // your image path
    },
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* soft background accents */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.10), transparent 28%), radial-gradient(circle at bottom right, rgba(14,165,233,0.10), transparent 28%)",
        pointerEvents: "none",
      }}
    />

    <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
      <Card
        sx={{
          borderRadius: "28px",
          overflow: "hidden",
          border: "1px solid rgba(148,163,184,0.18)",
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
        }}
      >
        {/* top header strip */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
            color: "#fff",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 30%)",
              pointerEvents: "none",
            }}
          />
          <Typography
            variant="h5"
            align="center"
            sx={{
              position: "relative",
              zIndex: 1,
              fontWeight: 800,
              fontSize: { xs: "1.3rem", sm: "1.45rem" },
              color: "#fff !important",
            }}
          >
            Admin Login
          </Typography>
        </Box>

        <CardContent
          sx={{
            p: 3,
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <TextField
            label="Mobile Number"
            inputRef={phoneRef}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            type="number"
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                background: "#fff",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaPhone />
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox checked={isSuperAdmin} onChange={handleRoleToggle} />
            }
            label="Login as Super Admin"
            sx={{
              mt: 0.8,
              "& .MuiTypography-root": {
                fontWeight: 600,
                color: "#334155",
              },
            }}
          />

          {!isOtpSent && (
            <Box
              sx={{
                mt: 2,
                p: 1.4,
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                background:
                  "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  gap: 1.2,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                <Box
                  sx={{
                    minWidth: 92,
                    height: 40,
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={getCaptcha}
                >
                  <img
                    src={captchaImage}
                    alt="captcha"
                    style={{ height: 30, cursor: "pointer" }}
                  />
                </Box>

                <TextField
                  label="Enter CAPTCHA"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      background: "#fff",
                    },
                  }}
                />

                <Button
                  size="small"
                  variant="contained"
                  onClick={verifyCaptchaAndSendOtp}
                  sx={{
                    minWidth: { xs: "100%", sm: 92 },
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 800,
                    px: 2,
                    py: 1,
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    boxShadow: "0 10px 22px rgba(37,99,235,0.22)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                    },
                  }}
                >
                  Verify
                </Button>
              </Box>
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
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    background: "#fff",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RiLock2Fill />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                onClick={handleOtpVerify}
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  minHeight: 48,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "1rem",
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow: "0 14px 28px rgba(37, 99, 235, 0.24)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                  },
                }}
              >
                Login
              </Button>

              {otpTimer > 0 ? (
                <Typography
                  align="center"
                  sx={{
                    mt: 1.4,
                    color: "#64748b",
                    fontWeight: 600,
                    fontSize: "0.92rem",
                  }}
                >
                  Resend OTP in {otpTimer}s
                </Typography>
              ) : (
                <Button
                  fullWidth
                  variant="text"
                  onClick={sendOtp}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#2563eb",
                  }}
                >
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

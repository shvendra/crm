import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../../utils/axiosConfig";
import toast from 'react-hot-toast';
import { Context } from '../../main';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import config from '../../config';

const Login = () => {
  const { t } = useTranslation();
  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async e => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields.');
    }

    try {
      const loginData = {
        phone: email.includes('@') ? undefined : email,
        email: email.includes('@') ? email : undefined,
        password,
      };

      const { data } = await axios.post(`${config.API_BASE_URL}/api/v1/user/login`, loginData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      toast.success(data.message);

      if (data.user) {
        setUser(data.user);

        if (data.availableRoles) {
          localStorage.setItem('availableRoles', JSON.stringify(data.availableRoles));
        }
      }

      setEmail('');
      setPassword('');
      setIsAuthorized(true);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'An error occurred during login.';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isAuthorized && user) {
      navigate('/dashboard');
    }
  }, [isAuthorized, user, navigate]);

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
        borderColor: 'linear-gradient(90deg, rgb(27, 118, 211) 0%, rgb(24, 90, 157) 100%)',
        borderWidth: '1px',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#98a2b3',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
              // 👇 background logic
    backgroundColor: { xs: "#fff", md: "transparent" },
    backgroundImage: {
      xs: "none",
      md: "url('/app/images/background/urgent_worker.png')", // your image path
    },
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
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

          {/* logo / brand */}
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
              {t('welcomeback')}
            </Typography>
            <Typography
              sx={{
                color: '#667085',
                fontSize: 14,
                maxWidth: 320,
                mx: 'auto',
              }}
            >
              {t('logintocontinue')}
            </Typography>
          </Box>

          {/* form */}
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              width: '100%',
            }}
          >
            <TextField
              fullWidth
              label={t('phoneNumber')}
              placeholder={t('phoneNumber')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              variant="outlined"
              required
              sx={authFieldSx}
            />

            <TextField
              fullWidth
              label={t('password')}
              placeholder={t('password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              variant="outlined"
              required
              sx={{ ...authFieldSx, mb: 1.2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: '#667085' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 2.5 }}>
              <Link
                to="/forgot-password"
                style={{
                  color: 'linear-gradient(90deg, rgb(27, 118, 211) 0%, rgb(24, 90, 157) 100%)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                {t('forgotpassword')}
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                height: 46,
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: 'linear-gradient(90deg, rgb(27, 118, 211) 0%, rgb(24, 90, 157) 100%)',
                boxShadow: 'none',
                mb: 2.2,
                '&:hover': {
                  bgcolor: '#24a3a7',
                  boxShadow: 'none',
                },
              }}
            >
              {t('Login')}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#475467', fontSize: 14 }}>
                {t('donthaveaccount')}{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#101828',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  {t('registernow')}
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* support */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography
              sx={{
                color: '#667085',
                fontSize: '0.8rem',
                lineHeight: 1.6,
              }}
            >
              {t('contactsupport')}
              <br />
              Phone:{' '}
              <span style={{ color: 'linear-gradient(90deg, rgb(27, 118, 211) 0%, rgb(24, 90, 157) 100%)', fontWeight: 700 }}>
                +91 7389791873
              </span>
              <br />
              Email:{' '}
              <span style={{ color: 'linear-gradient(90deg, rgb(27, 118, 211) 0%, rgb(24, 90, 157) 100%)', fontWeight: 700 }}>
                support@bookmyworkers.com
              </span>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
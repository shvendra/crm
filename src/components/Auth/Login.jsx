import React, { useContext, useState, useEffect, useRef } from 'react';
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
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack, Business } from '@mui/icons-material';
import config from '../../config';

const Login = () => {
  const { t } = useTranslation();
  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
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
      console.log('Login successful, user data:', data.user);

      // Save available roles for switching
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
      console.log('User already authorized, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthorized, user]);
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
      {/* Header */}
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
          py: 1,
        }}
      >
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
            {t('welcomeback')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#666',
              fontWeight: 'normal',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
           {t('logintocontinue')}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
          }}
        >
       

          {/* Email/Phone Input */}
          <TextField
            fullWidth
            label={t('phoneNumber')}
            placeholder={t('phoneNumber')}
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          />

          {/* Password Input */}
          <TextField
            fullWidth
            label={t('password')}
            placeholder={t('password')}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            variant="outlined"
            required
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: '#666' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Forgot Password */}
          <Box sx={{ textAlign: 'right', mb: 4 }}>
            <Link
              component={Link}
              to="/forgot-password"
              sx={{
                color: '#1976d2',
                textDecoration: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {t('forgotpassword')}
            </Link>
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
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
            {t('Login')}
          </Button>

          {/* Register Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {t('donthaveaccount')}{' '}
              <Link
                component={Link}
                to="/register"
                sx={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {t('registernow')}
              </Link>
            </Typography>
          </Box>
        </Box>
        {/* Support Contact */}
        <Box sx={{ textAlign: 'center', mt: 2, maxWidth: '320px', mx: 'auto' }}>
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
            {t('contactsupport')}
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

export default Login;

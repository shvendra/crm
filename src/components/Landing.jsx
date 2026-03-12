import React, { useEffect, useContext, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import TermsAndConditions from './Auth/TermsAndConditions';

import {
  CheckCircle,
  Speed,
  Public,
  Person,
  Business,
  Badge,
  Facebook,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../main';
import { Helmet } from 'react-helmet-async';
import { keyframes } from '@mui/system';
import config from "../config";

// Import slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Blinking animation for buttons
const blinkAnimation = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  const [openTerms, setOpenTerms] = useState(false); // Terms modal state
  const [accepted, setAccepted] = useState(false);
  const [open, setOpen] = useState(false);

const handleAccept = () => {
  setAccepted(true);   // store accepted state if needed
  setOpenTerms(false); // close the modal
};

// Decline button
const handleDecline = () => {
  setAccepted(false);  // optional: explicitly set declined state
  setOpenTerms(false); // close the modal
};
  useEffect(() => {
    if (isAuthorized && user) navigate("/dashboard");
  }, [isAuthorized, user, navigate]);

const sliderImages = [
  `${config.FILE_BASE_URL}/ImagesWeb/Industrial_Workers.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Construction_Workers.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Electrical_and_Wiring.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Painting_and_Finishing.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Fabrication_and_Welding.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Cleaning_and_Maintenance.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Household_Domestic.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Household_Services.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Agriculture_Farm_Workers.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/General.jpg`,
];


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dotsClass: "slick-dots custom-dots",
  };

  const features = [
    { icon: <CheckCircle sx={{ fontSize: { xs: 40, md: 50 }, color: '#4caf50' }} />, title: 'Verified Profiles', description: 'All worker profiles are verified and trusted' },
    { icon: <Speed sx={{ fontSize: { xs: 40, md: 50 }, color: '#2196f3' }} />, title: 'Quick Hiring', description: 'Hire skilled workers in just a few clicks' },
    { icon: <Public sx={{ fontSize: { xs: 40, md: 50 }, color: '#ff9800' }} />, title: 'All India Network', description: 'Pan-India network of skilled workers' },
  ];

  const userTypes = [
    { icon: <Person sx={{ fontSize: { xs: 40, md: 50 }, color: '#1976d2' }} />, title: 'Employer', description: 'Hire skilled workers for your projects', bgColor: '#e3f2fd' },
    { icon: <Business sx={{ fontSize: { xs: 40, md: 50 }, color: '#388e3c' }} />, title: 'Agent', description: 'Connect employers with workers', bgColor: '#e8f5e9' },
    { icon: <Badge sx={{ fontSize: { xs: 40, md: 50 }, color: '#7b1fa2' }} />, title: 'Job Seeker', description: 'Find work opportunities near you', bgColor: '#f3e5f5' },
  ];

  const handleUserTypeClick = (userType) => {
    if (userType === 'Job Seeker') navigate('/register?type=jobseeker');
    else if (userType === 'Employer') navigate('/register?type=employer');
    else if (userType === 'Agent') navigate('/register?type=agent');
  };

  return (
    <>
      <Helmet>
        <title>BookMyWorker - India's Leading Manpower Supply Platform</title>
        <meta name="description" content="Connect with skilled workers across India. Quick hiring, verified profiles, and nationwide network." />
      </Helmet>
      
      <Box sx={{ height: '100vh', bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Photo Slider Section */}
      {/* Photo Slider Section */}
<Box
  sx={{
    position: "relative",
    height: { xs: "25vh", md: "30vh" },
    overflow: "hidden",
    flexShrink: 0,
    bgcolor: "#f0f0f0",
  }}
>
  <Slider {...sliderSettings}>
    {sliderImages.map((image, index) => (
      <Box key={index} sx={{ height: { xs: "25vh", md: "30vh" } }}>
        <Box
          component="img"
          src={image}
          alt={`Slide ${index + 1}`}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: { xs: "contain", md: "cover" },
            objectPosition: "center",
          }}
        />
      </Box>
    ))}
  </Slider>
</Box>

        {/* Content Section */}
        <Box sx={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', py: { xs: 2, md: 3 }, overflow: 'auto' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.8) 25%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.95) 75%, rgba(255,255,255,0.98) 100%)`, backdropFilter: 'blur(2px) blur(4px) blur(6px) blur(8px) blur(10px)', zIndex: 0 }} />
          <Container maxWidth={isMobile ? "sm" : "lg"} sx={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'space-between', gap: { xs: 1, md: 1.5 }, position: 'relative', zIndex: 1 }}>
            
            {/* Login & Register */}
            <Grid container spacing={2} sx={{ mb: { xs: 1, md: 2 }, justifyContent: 'center' }}>
              <Grid item xs={6} md={3}>
                <Button component={Link} to="/login" variant="contained" fullWidth size="large" sx={{ py: { xs: 1.2, md: 1.5 }, borderRadius: { xs: '20px', md: '24px' }, fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 'bold', bgcolor: '#1976d2', animation: `${blinkAnimation} 2s ease-in-out infinite`, '&:hover': { bgcolor: '#1565c0', animation: 'none' } }}>Login</Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button component={Link} to="/register" variant="outlined" fullWidth size="large" sx={{ py: { xs: 1.2, md: 1.5 }, borderRadius: { xs: '20px', md: '24px' }, fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 'bold', borderColor: '#1976d2', color: '#1976d2', bgcolor: 'white', animation: `${blinkAnimation} 2s ease-in-out infinite 0.5s`, '&:hover': { bgcolor: '#f5f5f5', borderColor: '#1565c0', animation: 'none' } }}>Register</Button>
              </Grid>
            </Grid>

            {/* Features */}
            <Grid container spacing={{ xs: 1, md: 2 }} sx={{ mb: { xs: 1, md: 2 } }}>
              {features.map((feature, index) => (
                <Grid item xs={4} md={4} key={index}>
                  <Card sx={{ textAlign: 'center', py: { xs: 1, md: 2 }, px: { xs: 0.5, md: 1 }, borderRadius: { xs: '12px', md: '16px' }, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>
                    <CardContent sx={{ p: { xs: 0.5, md: 1 } }}>
                      <Box sx={{ mb: { xs: 0.5, md: 1 } }}>{feature.icon}</Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' } }}>{feature.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* User Types */}
            <Grid container spacing={{ xs: 1, md: 2 }} sx={{ mb: { xs: 1, md: 2 } }}>
              {userTypes.map((userType, index) => (
                <Grid item xs={4} md={4} key={index}>
                  <Card onClick={() => handleUserTypeClick(userType.title)} sx={{ textAlign: 'center', py: { xs: 1, md: 2 }, px: { xs: 0.5, md: 1 }, borderRadius: { xs: '12px', md: '16px' }, height: '100%', bgcolor: userType.bgColor, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }, transition: 'all 0.3s ease' }}>
                    <CardContent sx={{ p: { xs: 0.5, md: 1 } }}>
                      <Box sx={{ mb: { xs: 0.5, md: 1 } }}>{userType.icon}</Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' } }}>{userType.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

     

            {/* Social Media Icons & Support */}
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 1 }}>
                <IconButton component="a" href="https://www.facebook.com/BookMyWorker/" target="_blank" rel="noopener noreferrer" sx={{ mx: 0.5, color: '#3b5998', p: { xs: 0.5, md: 1 } }}><Facebook sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} /></IconButton>
                <IconButton component="a" href="https://www.instagram.com/bookmyworker/" target="_blank" rel="noopener noreferrer" sx={{ mx: 0.5, color: '#e4405f', p: { xs: 0.5, md: 1 } }}><Instagram sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} /></IconButton>
                <IconButton component="a" href="https://linkedin.com/company/bookmyworker/" target="_blank" rel="noopener noreferrer" sx={{ mx: 0.5, color: '#0077b5', p: { xs: 0.5, md: 1 } }}><LinkedIn sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} /></IconButton>
              </Box>

              {/* Already have account */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>Login</Link>
                </Typography>
              </Box>

              {/* Terms & Privacy */}
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  By registering, you agree to our{' '}
                  <span style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setOpenTerms(true)}>Terms & Privacy Policy</span>
                </Typography>
              </Box>

              {/* Support Contact */}
              <Box sx={{ textAlign: 'center', mt: 4, maxWidth: '320px', mx: 'auto' }}>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '0.85rem', fontWeight: 500, mb: 1.5, lineHeight: 1.4 }}>
                  If you face any issues while using the application, feel free to reach out:
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  Phone: <strong style={{ color: '#1976d2' }}>+91 7389791873</strong><br />
                  Email: <strong style={{ color: '#1976d2' }}>support@bookmyworkers.com</strong>
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Terms & Conditions Dialog */}
      <Dialog open={openTerms} onClose={() => setOpenTerms(false)} maxWidth="sm" fullWidth>
         <DialogContent>
              <TermsAndConditions role={"role"} />
            </DialogContent>
           <DialogActions>
  <Button onClick={handleDecline} color="inherit">
    Decline
  </Button>
  <Button onClick={handleAccept} variant="contained" color="primary">
    Accept
  </Button>
</DialogActions>
      </Dialog>

      <style jsx>{`
        .custom-dots { bottom: 20px; }
        .custom-dots li button:before { color: white; opacity: 0.5; font-size: 12px; }
        .custom-dots li.slick-active button:before { opacity: 1; color: white; }
      `}</style>
    </>
  );
};

export default Landing;

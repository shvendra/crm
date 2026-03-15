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

const isDesktop = window.innerWidth >= 1024;

const sliderImages = isDesktop
  ? [
      `${config.FILE_BASE_URL}/ImagesWeb/la.png`,
      `${config.FILE_BASE_URL}/ImagesWeb/lb.png`,
      `${config.FILE_BASE_URL}/ImagesWeb/lc.png`,
      `${config.FILE_BASE_URL}/ImagesWeb/ld.png`,
      `${config.FILE_BASE_URL}/ImagesWeb/le.png`,
      `${config.FILE_BASE_URL}/ImagesWeb/lf.png`,
    ]
  : [
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
      <meta
        name="description"
        content="Connect with skilled workers across India. Quick hiring, verified profiles, and nationwide network."
      />
    </Helmet>

    <Box
      sx={{
        height: "100vh",
        bgcolor: "#eef2f7",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
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
                  objectPosition: "center",
                }}
              />
            </Box>
          ))}
        </Slider>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.16) 100%)",
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          py: { xs: 2, md: 3 },
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.82) 22%, rgba(255,255,255,0.90) 45%, rgba(255,255,255,0.96) 72%, rgba(255,255,255,0.99) 100%)",
            backdropFilter: "blur(10px)",
            zIndex: 0,
          }}
        />

        <Container
          maxWidth={isMobile ? "sm" : "lg"}
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: { xs: 1.25, md: 1.6 },
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Login & Register */}
          <Grid
            container
            spacing={2}
            sx={{
              mb: { xs: 1, md: 2 },
              justifyContent: "center",
            }}
          >
            <Grid item xs={6} md={3}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: { xs: 1.2, md: 1.5 },
                  borderRadius: { xs: "18px", md: "22px" },
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow: "0 14px 30px rgba(37, 99, 235, 0.24)",
                  animation: `${blinkAnimation} 2s ease-in-out infinite`,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                    animation: "none",
                    boxShadow: "0 18px 36px rgba(37, 99, 235, 0.30)",
                  },
                }}
              >
                Login
              </Button>
            </Grid>

            <Grid item xs={6} md={3}>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  py: { xs: 1.2, md: 1.5 },
                  borderRadius: { xs: "18px", md: "22px" },
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  fontWeight: 800,
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  bgcolor: "rgba(255,255,255,0.95)",
                  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
                  animation: `${blinkAnimation} 2s ease-in-out infinite 0.5s`,
                  "&:hover": {
                    bgcolor: "#f8fbff",
                    borderColor: "#1d4ed8",
                    animation: "none",
                  },
                }}
              >
                Register
              </Button>
            </Grid>
          </Grid>

          {/* Features */}
          <Grid
            container
            spacing={{ xs: 1, md: 2 }}
            sx={{ mb: { xs: 1, md: 2 } }}
          >
            {features.map((feature, index) => (
              <Grid item xs={4} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: "center",
                    py: { xs: 1, md: 2 },
                    px: { xs: 0.5, md: 1 },
                    borderRadius: { xs: "16px", md: "20px" },
                    height: "100%",
                    border: "1px solid #e2e8f0",
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                    boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                    "&:hover": {
                      boxShadow: "0 16px 34px rgba(15, 23, 42, 0.10)",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent sx={{ p: { xs: 0.5, md: 1 } }}>
                    <Box sx={{ mb: { xs: 0.5, md: 1 } }}>{feature.icon}</Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        color: "#0f172a",
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* User Types */}
          <Grid
            container
            spacing={{ xs: 1, md: 2 }}
            sx={{ mb: { xs: 1, md: 2 } }}
          >
            {userTypes.map((userType, index) => (
              <Grid item xs={4} md={4} key={index}>
                <Card
                  onClick={() => handleUserTypeClick(userType.title)}
                  sx={{
                    textAlign: "center",
                    py: { xs: 1, md: 2 },
                    px: { xs: 0.5, md: 1 },
                    borderRadius: { xs: "16px", md: "20px" },
                    height: "100%",
                    bgcolor: userType.bgColor,
                    cursor: "pointer",
                    border: "1px solid rgba(148,163,184,0.14)",
                    boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 16px 32px rgba(15, 23, 42, 0.12)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent sx={{ p: { xs: 0.5, md: 1 } }}>
                    <Box sx={{ mb: { xs: 0.5, md: 1 } }}>{userType.icon}</Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        color: "#0f172a",
                      }}
                    >
                      {userType.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Social Media Icons & Support */}
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 1.2 }}>
              <IconButton
                component="a"
                href="https://www.facebook.com/BookMyWorker/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mx: 0.5,
                  color: "#3b5998",
                  p: { xs: 0.6, md: 1 },
                  bgcolor: "rgba(255,255,255,0.85)",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
                }}
              >
                <Facebook sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
              </IconButton>

              <IconButton
                component="a"
                href="https://www.instagram.com/bookmyworker/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mx: 0.5,
                  color: "#e4405f",
                  p: { xs: 0.6, md: 1 },
                  bgcolor: "rgba(255,255,255,0.85)",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
                }}
              >
                <Instagram sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
              </IconButton>

              <IconButton
                component="a"
                href="https://linkedin.com/company/bookmyworker/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mx: 0.5,
                  color: "#0077b5",
                  p: { xs: 0.6, md: 1 },
                  bgcolor: "rgba(255,255,255,0.85)",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
                }}
              >
                <LinkedIn sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
              </IconButton>
            </Box>

            {/* Already have account */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>

            {/* Terms & Privacy */}
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                By registering, you agree to our{" "}
                <span
                  style={{
                    color: "#2563eb",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: 700,
                  }}
                  onClick={() => setOpenTerms(true)}
                >
                  Terms & Privacy Policy
                </span>
              </Typography>
            </Box>

            {/* Support Contact */}
            <Box
              sx={{
                textAlign: "center",
                mt: 1,
                mb: 8,
                maxWidth: "340px",
                mx: "auto",
                p: 1,
                borderRadius: "20px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#334155",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                If you face any issues while using the application, feel free to
                reach out:
              </Typography>

              <Typography variant="body2" sx={{ fontSize: "0.82rem", }}>
                <br />
                Phone:{" "}
                <span style={{ color: "#0f766e", fontWeight: 800 }}>
                  +91 7389791873
                </span>
                <br />
                Email:{" "}
                <span style={{ color: "#0f766e", fontWeight: 800 }}>
                  support@bookmyworkers.com
                </span>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>

    {/* Terms & Conditions Dialog */}
    <Dialog
      open={openTerms}
      onClose={() => setOpenTerms(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(148,163,184,0.18)",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
        },
      }}
    >
      <DialogContent
        sx={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          p: 2,
        }}
      >
        <TermsAndConditions role={"role"} />
      </DialogContent>

      <DialogActions
        sx={{
          px: 2,
          pb: 2,
          pt: 1,
          justifyContent: "space-between",
          borderTop: "1px solid #e2e8f0",
          background: "#fff",
        }}
      >
        <Button
          onClick={handleDecline}
          color="inherit"
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            px: 2.5,
            py: 1,
            fontWeight: 700,
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            color: "#475569",
            "&:hover": {
              backgroundColor: "#eef2f7",
            },
          }}
        >
          Decline
        </Button>

        <Button
          onClick={handleAccept}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            px: 2.5,
            py: 1,
            fontWeight: 800,
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            boxShadow: "0 12px 24px rgba(37,99,235,0.22)",
            "&:hover": {
              background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
            },
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>

    <style jsx>{`
      .custom-dots {
        bottom: 20px;
      }
      .custom-dots li button:before {
        color: white;
        opacity: 0.5;
        font-size: 12px;
      }
      .custom-dots li.slick-active button:before {
        opacity: 1;
        color: white;
      }
    `}</style>
  </>
);
};

export default Landing;

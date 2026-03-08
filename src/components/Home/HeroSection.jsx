import React, { useEffect, useState } from 'react';
import { Grid, Container, Box, Typography, Button, Card, CardMedia } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import {
  FaWhatsapp,
  FaGooglePlay,
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaIndustry,
} from 'react-icons/fa';
import Slider from 'react-slick';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import QuoteCarousel from './QuoteCarason';
import { Heading } from 'lucide-react';
import HeadingCarousel from './HeadingCarasol';
const imageList = [
  '/home-slide-1.jpeg',
  '/home-slide-2.jpeg',
  '/home-slide-3.jpeg',
  '/home-slide-4.jpeg',
];

const settings = {
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  dots: true,
  fade: true,
  cssEase: 'ease-in-out',
};

const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 50);
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setCount(Math.floor(start));
    }, 50);
    return () => clearInterval(interval);
  }, [end, duration]);

  return (
    <Typography variant="h6" fontWeight={600} color="primary">
      {count}+
    </Typography>
  );
};

const HeroSection = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: <FaUsers size={28} color="#1976d2" />,
      title: t('activeWorkersTitle'),
      value: 120000,
      desc: t('activeWorkersDesc'),
    },
    {
      icon: <FaUserTie size={28} color="#388e3c" />,
      title: t('workerAgentsTitle'),
      value: 6000,
      desc: t('workerAgentsDesc'),
    },
    {
      icon: <FaBuilding size={28} color="#f57c00" />,
      title: t('employersTitle'),
      value: 420,
      desc: t('employersDesc'),
    },
    {
      icon: <FaIndustry size={28} color="#6a1b9a" />,
      title: t('industriesTitle'),
      value: 75,
      desc: t('industriesDesc'),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Home: BookMyWorker</title>
        <link rel="canonical" href="https://www.bookmyworkers.com/hero" />
      </Helmet>

      <Box
        id="hero"
        sx={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 50%, #fff3e0 100%)',
          position: 'relative',
          overflow: 'visible',
          pt: { xs: 10, md: 9 },
          pb: { xs: 12, md: 16 },
        }}
      >
        {/* Background Blobs */}
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(33,150,243,0.2), transparent 70%)',
            borderRadius: '50%',
            top: '-10%',
            left: '-10%',
            zIndex: 0,
            animation: 'float 8s ease-in-out infinite alternate',
            '@keyframes float': {
              '0%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-15px) translateX(10px) rotate(5deg)' },
              '100%': { transform: 'translateY(0)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(76,175,80,0.2), transparent 70%)',
            borderRadius: '50%',
            bottom: '-10%',
            right: '-10%',
            zIndex: 0,
            animation: 'float2 10s ease-in-out infinite alternate',
            '@keyframes float2': {
              '0%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(15px) translateX(-10px) rotate(-5deg)' },
              '100%': { transform: 'translateY(0)' },
            },
          }}
        />

        <Container
          maxWidth={false}
          disableGutters
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 4, md: 6 },
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            // background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
            borderBottomLeftRadius: { xs: '40px', md: '80px' },
            borderBottomRightRadius: { xs: '40px', md: '80px' },
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* LEFT SIDE TEXT */}
            <Grid item xs={12} md={6}>
              <Box data-aos="fade-right">
                <Box display="flex" alignItems="center" mb={1}>
                  <EmojiEvents sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="body2" color="text.secondary">
                    Working for your success
                  </Typography>
                </Box>

                <HeadingCarousel />

                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: 'text.secondary', fontSize: '1.05rem' }}
                >
                  <span style={{ color: '#1976d2', fontWeight: 'bold'}}>BookMyWorker</span> {t('heroSubheading')}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary',  fontSize: '1.05rem' }}>
                  {t('heromsg')}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    href="/register"
                    sx={{
                      background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                      color: '#fff',
                      textTransform: 'capitalize',
                      borderRadius: 3,
                      px: 3,
                      boxShadow: '0 4px 12px rgba(25,118,210,0.35)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #1565c0, #1e88e5)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {t('getStartedForfree')}
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<FaWhatsapp />}
                    href="https://wa.me/15557193421"
                    target="_blank"
                    sx={{
                      borderColor: '#25D366',
                      color: '#25D366',
                      textTransform: 'capitalize',
                      borderRadius: 3,
                      px: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#eafff1',
                        borderColor: '#1ebe5d',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {t('whatsappNow')}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<FaGooglePlay />}
                    href="https://play.google.com/store/apps/details?id=com.app.myworker"
                    target="_blank"
                    sx={{
                      borderColor: '#34A853',
                      color: '#34A853',
                      textTransform: 'capitalize',
                      borderRadius: 3,
                      // px: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#e8f5e9',
                        borderColor: '#2c8c47',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {t('downloadApp')}
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* RIGHT SIDE SLIDER */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 10px 35px rgba(0,0,0,0.2)',
                  transform: 'translateY(0)',
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                  },
                }}
              >
                <Slider {...settings}>
                  {imageList.map((img, index) => (
                    <Card
                      key={index}
                      sx={{
                        borderRadius: 3,
                        transition: 'transform 0.5s',
                        '&:hover': { transform: 'scale(1.03) rotate(-0.5deg)' },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={img}
                        alt={`slide-${index}`}
                        sx={{ width: '100%', height: { xs: 280, md: 360 }, objectFit: 'cover' }}
                      />
                    </Card>
                  ))}
                </Slider>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <QuoteCarousel />
        {/* STATS SECTION */}
        <Container>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 6 }}>
            {stats.map((item, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 2.5,
                    px: 1.5,
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255,255,255,0.65)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    transition: 'all 0.3s ease',
                    height: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Box mb={1.5}>{item.icon}</Box>
                  <AnimatedCounter end={item.value} />
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Decorative Curve at Bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
            zIndex: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ width: '100%', height: 100, display: 'block' }}
          >
            <path
              d="M0,40 C360,100 1080,0 1440,60 L1440,120 L0,120 Z"
              style={{ fill: 'rgb(50 147 232)' }}
            />
          </svg>
        </Box>
      </Box>
    </>
  );
};

export default HeroSection;

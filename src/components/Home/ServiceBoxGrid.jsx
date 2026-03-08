import React, { useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Avatar } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import ConstructionIcon from '@mui/icons-material/Construction';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import CarpenterIcon from '@mui/icons-material/Handyman';
import PaintIcon from '@mui/icons-material/FormatPaint';
import WeldingIcon from '@mui/icons-material/Build';
import HouseIcon from '@mui/icons-material/House';
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FestivalIcon from '@mui/icons-material/Festival';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

const services = [
  { en: 'Building Construction', icon: <ConstructionIcon sx={{ fontSize: 36, color: '#fbc02d' }} /> },
  { en: 'Electrical and Wiring', icon: <ElectricalServicesIcon sx={{ fontSize: 36, color: '#f57c00' }} /> },
  { en: 'Plumbing and Sanitation', icon: <PlumbingIcon sx={{ fontSize: 36, color: '#00796b' }} /> },
  { en: 'Carpentry and Woodwork', icon: <CarpenterIcon sx={{ fontSize: 36, color: '#6d4c41' }} /> },
  { en: 'Painting and Finishing', icon: <PaintIcon sx={{ fontSize: 36, color: '#ef6c00' }} /> },
  { en: 'Fabrication and Welding', icon: <WeldingIcon sx={{ fontSize: 36, color: '#00695c' }} /> },
  { en: 'Domestic and House Help', icon: <HouseIcon sx={{ fontSize: 36, color: '#fbc02d' }} /> },
  { en: 'Cleaning and Maintenance', icon: <CleaningServicesIcon sx={{ fontSize: 36, color: '#388e3c' }} /> },
  { en: 'Security Services', icon: <SecurityIcon sx={{ fontSize: 36, color: '#d32f2f' }} /> },
  { en: 'Transportation and Loading', icon: <LocalShippingIcon sx={{ fontSize: 36, color: '#f9a825' }} /> },
  { en: 'Tent House Works', icon: <FestivalIcon sx={{ fontSize: 36, color: '#7b1fa2' }} /> },
  { en: 'Cleaning Works', icon: <DeleteSweepIcon sx={{ fontSize: 36, color: '#43a047' }} /> },
  { en: 'Household Services', icon: <HomeWorkIcon sx={{ fontSize: 36, color: '#fbc02d' }} /> },
  { en: 'Farming and Gardening', icon: <AgricultureIcon sx={{ fontSize: 36, color: '#2e7d32' }} /> },
  { en: 'Driving and Delivery', icon: <DeliveryDiningIcon sx={{ fontSize: 36, color: '#f9a825' }} /> },
  { en: 'Specialized Services', icon: <MiscellaneousServicesIcon sx={{ fontSize: 36, color: '#0288d1' }} /> },
];

const getBackgroundColor = (title) => {
  switch (title) {
    case 'Building Construction': return '#E3F2FD';
    case 'Electrical and Wiring': return '#FFF3E0';
    case 'Plumbing and Sanitation': return '#E8F5E9';
    case 'Carpentry and Woodwork': return '#F3E5F5';
    case 'Painting and Finishing': return '#FFF3E0';
    case 'Fabrication and Welding': return '#E0F7FA';
    case 'Domestic and House Help': return '#FFFDE7';
    case 'Cleaning and Maintenance': return '#E8F5E9';
    case 'Security Services': return '#FFEBEE';
    case 'Transportation and Loading': return '#FFF3E0';
    case 'Tent House Works': return '#F3E5F5';
    case 'Cleaning Works': return '#E8F5E9';
    case 'Household Services': return '#FFFDE7';
    case 'Farming and Gardening': return '#E8F5E9';
    case 'Driving and Delivery': return '#FFF3E0';
    case 'Specialized Services': return '#E0F7FA';
    default: return '#FFFFFF';
  }
};

const ServiceCarousel = ({ onServiceClick }) => {
  const { i18n } = useTranslation();
  const carouselRef = useRef();

  // Auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth / 2;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -width : width, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ position: 'relative', py: 1, backgroundColor: '#f9f9f9' }}>
      {/* Left/Right Arrows */}
      <IconButton
        sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
        onClick={() => handleScroll('left')}
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
        onClick={() => handleScroll('right')}
      >
        <ArrowForwardIos />
      </IconButton>

      {/* Carousel */}
      <Box
        ref={carouselRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {[...services, ...services].map((service, index) => {
          const title = service.en; // apply i18n if needed

          return (
            <Card
              key={index}
              onClick={() => onServiceClick && onServiceClick(title)}
              sx={{
                flex: '0 0 auto',
                scrollSnapAlign: 'center',
                width: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 2,
                mt: 2,
                mb: 2,
                borderRadius: 3,
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                backgroundColor: getBackgroundColor(title),
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'white',
                  width: 72,
                  height: 72,
                  mb: 2,
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {service.icon}
              </Avatar>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="body1" fontWeight={700} textAlign="center">
                  {title}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default ServiceCarousel;

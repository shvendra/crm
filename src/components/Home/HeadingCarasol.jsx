import React from 'react';
import Slider from 'react-slick';
import { Typography, Box } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const headlines = [
  'Your Trusted Partner in Workforce Solutions',
  'Connecting Skill with Opportunity',
  'Building India’s Workforce Future',
  'Reliable Workers, On Time, Every Time',
  'Smart Solutions for Every Job Site',
  'Empowering Workers. Supporting Employers.',
  'Simplifying Hiring, Amplifying Productivity',
  'The Right Worker for Every Work Need',
];

export default function HeadlineCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <Box sx={{ py: 1 }}>
      <Slider {...settings}>
        {headlines.map((text, i) => (
          <Typography
            key={i}
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#0d47a1',
              mb: 1,
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
            }}
          >
            {text}
          </Typography>
        ))}
      </Slider>
    </Box>
  );
}

import React from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const quotes = [
  'Every great project begins with the right hands.',
  'Connecting skilled workers with opportunities that build the future.',
  'Your project, our people — perfectly matched.',
  'Building trust, one worker at a time.',
  'From foundation to finish, we’ve got the workforce you need.',
  'Empowering employers, uplifting workers.',
  'Work made simple. Results made strong.',
  'Skilled. Reliable. Ready to build.',
  'The bridge between skill and success.',
  'India’s workforce, just a click away.',
];

export default function QuoteCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <Box
      sx={{
        backgroundColor: '#1976d2', // MUI blue
        color: '#fff',
        textAlign: 'center',
        py: 5,
        mt: 4,
      }}
    >
      <Slider {...settings}>
        {quotes.map((quote, index) => (
          <Box key={index}>
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontWeight: 700,
                lineHeight: 1.4,
                fontSize: { xs: '1.4rem', md: '2rem' },
                letterSpacing: '0.5px',
                textShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              {quote}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

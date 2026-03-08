import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, IconButton, Link, Fab } from '@mui/material';
import { Twitter, Facebook, Instagram, LinkedIn, KeyboardArrowUp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ScrollToTopButton } from './ScrollToTopButton'; 
const Footer = ({ onFooterMenuClick }) => {
  const { t } = useTranslation();
  const [showScroll, setShowScroll] = useState(false);

  const menuItems = [
    { name: 'Home', link: '#hero', page: 'home' },
    { name: 'About Us', link: '#about', page: 'home' },
    { name: 'Workforce Category', link: '#features', page: 'home' },
    { name: 'Services', link: '#services', page: 'home' },
    { name: 'Privacy Policy', link: '#privacy', page: 'privacy' },
    { name: 'Terms & Conditions', link: '#terms', page: 'terms' },
  ];

  const handleMenuClick = item => {
    if (item.page) onFooterMenuClick(item.page);
  };

  // Scroll-to-top button logic
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'rgb(10 124 202)',
        pt: 8,
        pb: 4,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container
        maxWidth={false}
        sx={{ px: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}
      >
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
                <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 1,
                        color: "white",
                      }}
                    >
                      <img
                        src="/app/logo.jpg"
                        alt="BookMyWorker"
                        style={{ height: 54, width: 48 }}
                      />
            
                      <Box sx={{ lineHeight: 1 }}>
                        <Box sx={{ fontWeight: "bolder" }}>BookMyWorker</Box>
                        <Box
                          sx={{
                            fontSize: 9,
                            fontWeight: "bolder",
                            color: "rgba(255,255,255,0.8)",
                          }}
                        >
                          Trusted workforce solutions in india
                        </Box>
                      </Box>
                    </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "bolder" }}>
              KHASARA NO 34/1/33, Karahiya, Rewa, Madhya Pradesh 486001, India
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "bolder" }}>
              <span>GST:</span> 23NBJPS3070R1ZQ
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <span>Phone:</span>{' '}
              <Link href="tel:+917389791873" sx={{ color: '#fff', textDecoration: 'underline' }}>
                +91 7389791873
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <span>Business Email:</span>{' '}
              <Link
                href="mailto:business@bookmyworkers.com"
                sx={{ color: '#fff', textDecoration: 'underline' }}
              >
                business@bookmyworkers.com
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                <span>Support Email:</span>{' '}
              <Link
                href="mailto:support@bookmyworkers.com"
                sx={{ color: '#fff', textDecoration: 'underline' }}
              >
                support@bookmyworkers.com
              </Link>
            </Typography>

            <Box mt={2} display="flex" gap={1}>
              {[
                { icon: <Twitter />, link: 'https://twitter.com' },
                {
                  icon: <Facebook />,
                  link: 'https://www.facebook.com/BookMyWorker',
                },
                {
                  icon: <Instagram />,
                  link: 'https://www.instagram.com/bookmyworker/',
                },
                {
                  icon: <LinkedIn />,
                  link: 'https://www.linkedin.com/company/bookmyworker',
                },
              ].map((social, idx) => (
                <IconButton
                  key={idx}
                  component="a"
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Menu Section */}
          <Grid item xs={6} sm={6} md={2}>
             <Typography
              variant="subtitle1" // visually similar to h6
              component="div" // renders as <div> instead of <h6>
              sx={{
                color: '#fff',
                fontSize: '1.25rem', // same as default h6
                fontWeight: 500, // same as default h6
              }}
              gutterBottom
            >
              {t('Useful Links') || 'Useful Links'}
            </Typography>

            {menuItems.map((item, idx) => (
              <Link
                href={item.link}
                key={idx}
                variant="body2"
                display="block"
                sx={{
                  my: 0.5,
                  color: '#fff',
                  '&:hover': { color: '#ffeb3b', textDecoration: 'underline' },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => handleMenuClick(item)}
              >
                {item.name}
              </Link>
            ))}

            <Typography
              variant="subtitle1" // visually similar to h6
              component="div" // renders as <div> instead of <h6>
              sx={{
                color: '#fff',
                fontSize: '1.25rem', // same as default h6
                fontWeight: 500, // same as default h6
              }}
              gutterBottom
              mt={2}
            >
              {t('Certificate') || 'Certificate'}
            </Typography>

            <Box mt={1}>
              <img
                src="./assets/img/gst.png"
                width={80}
                height={80}
                alt="GST Certificate"
                style={{ borderRadius: 8 }}
              />
            </Box>
          </Grid>

          {/* Map Section */}
          <Grid item xs={12} sm={12} md={6}>
            <Typography
              variant="subtitle1" // visually similar to h6
              component="div" // renders as <div> instead of <h6>
              sx={{
                color: '#fff',
                fontSize: '1.25rem', // same as default h6
                fontWeight: 500, // same as default h6
              }}
              gutterBottom
            >
              {t('Our Location') || 'Our Location'}
            </Typography>

            <Box
              component="iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3641.589745780852!2d81.28419597599159!3d24.532552078137116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39847e6a8f88b6b1%3A0x6f55a3e398205b55!2sGalla%20Mandi%2C%20Rewa%2C%20Madhya%20Pradesh%20486001!5e0!3m2!1sen!2sin!4v1712999305882!5m2!1sen!2sin"
              width="100%"
              height="250px"
              style={{ border: 0, borderRadius: 8 }}
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            />
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box mt={5} textAlign="center" pt={2} borderTop="1px solid rgba(255,255,255,0.3)">
          <Typography variant="body2" sx={{ color: '#fff' }}>
            © {new Date().getFullYear()} <span>BookMyWorker</span>. All Rights Reserved
          </Typography>
        </Box>
      </Container>

      {/* Scroll to Top */}
      {showScroll && (
        <ScrollToTopButton />
      )}
    </Box>
  );
};

export default Footer;

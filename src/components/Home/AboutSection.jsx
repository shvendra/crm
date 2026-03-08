import React from 'react';
import { Box, Container, Grid, Typography, List, ListItem, ListItemIcon } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const AboutSection = () => {
  const { t } = useTranslation();

  const featuresLeft = [t('about1'), t('about2'), t('about3')];
  const featuresRight = [t('about4'), t('about5'), t('about6')];

  return (
    <>
      <Helmet>
        <title>About Us: BookMyWorker</title>
        <link rel="canonical" href="https://www.bookmyworkers.com/about" />
      </Helmet>

      <Box 
      id="about"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f9fafb',
          pt: { xs: 8, md: 10 },
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          data-aos="fade-up"
          data-aos-delay="100"
          sx={{ px: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}
        >
          <Grid container spacing={6} alignItems="center">
            {/* LEFT CONTENT */}
            <Grid item xs={12} md={7}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#0d47a1' }}>
                {t('aboutUs')}
              </Typography>

              <Typography variant="body1" sx={{ mb: 2, fontSize: '1rem', color: '#555' }}>
                <strong>BookMyWorker</strong> {t('aboutDescription')}
              </Typography>
 <Typography variant="body1" sx={{ mb: 2, fontSize: '1rem', color: '#555' }}>
                 {t('aboutDescription1')}
              </Typography> <Typography variant="body1" sx={{ mb: 2, fontSize: '1rem', color: '#555' }}>
                {t('aboutDescription2')}
              </Typography> <Typography variant="body1" sx={{ mb: 2, fontSize: '1rem', color: '#555' }}>
                {t('aboutDescription3')}
              </Typography>
              <Grid container spacing={3}>
                {[featuresLeft, featuresRight].map((features, col) => (
                  <Grid item xs={6} key={col}>
                    <List>
                      {features.map((text, idx) => (
                        <ListItem
                          key={idx}
                          sx={{
                            px: 0,
                            mb: 2,
                            background: 'white',
                            borderRadius: 2,
                            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: '35px' }}>
                            <CheckCircle color="primary" sx={{ fontSize: 22 }} />
                          </ListItemIcon>
                          <Typography variant="body1" sx={{ color: '#444' }}>
                            {text}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* RIGHT IMAGE */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  '& img.main': { borderRadius: '12px' },
                }}
              >
                <img
                  src="/assets/images/about-us-1.png"
                  alt="Business Meeting"
                  className="main"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Animated Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    backgroundColor: 'white',
                    px: 2.5,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    textAlign: 'center',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%,100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    5+{' '}
                    <Typography component="span" sx={{ fontSize: 14 }}>
                      Years
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('workfocesolution')}
                  </Typography>
                </Box>

                {/* Overlapping Worker Image */}
                <Box
                  component="img"
                  src="/assets/images/worker-overlay.png"
                  alt="Worker Team"
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    right: -20,
                    width: '45%',
                    borderRadius: 2,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.18)',
                    transform: 'rotate(-5deg)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Curved Wave Below Content */}
        <Box sx={{ mt: 6 }}>
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ width: '100%', height: 100, display: 'block' }}
          >
            <path
              d="M0,0 C480,120 960,0 1440,120 L1440,0 L0,0 Z"
              style={{ fill: 'rgb(50, 147, 232)' }}
            />
          </svg>
        </Box>
      </Box>
    </>
  );
};

export default AboutSection;

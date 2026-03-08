import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import { FaUsers, FaTools, FaUserCog, FaHandsHelping } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <FaUsers />,
      title: t('servicesssss.groupLabor.title'),
      desc: t('servicesssss.groupLabor.desc'),
      color: '#1976d2',
    },
    {
      icon: <FaTools />,
      title: t('servicesssss.skilled.title'),
      desc: t('servicesssss.skilled.desc'),
      color: '#388e3c',
    },
    {
      icon: <FaUserCog />,
      title: t('servicesssss.semiSkilled.title'),
      desc: t('servicesssss.semiSkilled.desc'),
      color: '#f57c00',
    },
    {
      icon: <FaHandsHelping />,
      title: t('servicesssss.helpers.title'),
      desc: t('servicesssss.helpers.desc'),
      color: '#6a1b9a',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Home: BookMyWorker</title>
        <link rel="canonical" href={`https://www.bookmyworkers.com/services`} />
      </Helmet>

      <Box id="services" sx={{ py: 4, background: 'linear-gradient(135deg, #fff, #f2f7fb)' }}>
        <Container
          maxWidth={false}
          disableGutters
          data-aos="fade-up"
          data-aos-delay="100"
          sx={{
            px: { xs: 2, sm: 3, md: 6 },
          }}
        >
          <Fade cascade>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              {t('servicesssss.heading')}
            </Typography>
            <Typography variant="body1" align="center" mb={6} color="text.secondary">
              {t('servicesssss.subheading')}
            </Typography>
          </Fade>

          <Grid container spacing={4}>
            {services.map((service, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Fade delay={idx * 150}>
                  <Card
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 3,
                      borderRadius: 3,
                      background: '#fff',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${service.color}33, ${service.color}88)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        color: service.color,
                        mr: 3,
                        flexShrink: 0,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                      }}
                    >
                      {service.icon}
                    </Box>
                    <CardContent sx={{ p: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ServicesSection;

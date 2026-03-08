import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const plans = [
  {
    title: 'Login',
    price: 9.9,
    features: ['s'],
  },
  {
    title: 'Post Your Work',
    price: 19.9,
    features: ['s'],
    popular: true,
  },
  {
    title: 'Dashboard',
    price: 39.9,
    features: ['s'],
  },
  {
    title: 'Agent Intrest',
    price: 39.9,
    features: ['s'],
  },
  {
    title: 'Work Record',
    price: 9.9,
    features: ['s'],
  },
  {
    title: 'Payment',
    price: 19.9,
    features: ['s'],
    popular: true,
  },
];

const PricingSection = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Home: BookMyWorker</title>
        <link rel="canonical" href={`https://www.bookmyworkers.com/pricing`} />
      </Helmet>
      <Box id="pricing" sx={{ py: 8, backgroundColor: '#f0f0f5' }}>
        <Container
          maxWidth={false}
          disableGutters
          data-aos="fade-up"
          data-aos-delay="100"
          sx={{
            px: { xs: 1, sm: 2, md: 3 }, // Optional: small side padding if you don’t want content touching edges
          }}
        >
          {' '}
          <Fade cascade>
            <Typography variant="h4" align="center" gutterBottom>
              How Our App Working
            </Typography>
            <Typography variant="body1" align="center" mb={6}>
              Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit
            </Typography>
          </Fade>
          <Grid container spacing={1} justifyContent="center">
            {plans.map((plan, idx) => (
              <Grid item xs={12} md={2} key={idx}>
                <Fade delay={idx * 100}>
                  <Card
                    sx={{
                      p: 0,
                      position: 'relative',
                      backgroundColor: plan.popular ? '#fff7e6' : '#ffffff',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{plan.title}</Typography>

                      <List dense>
                        {plan.features.map((feature, i) => (
                          <img
                            src="assets/img/appview.jpeg"
                            alt="Phone Mockup"
                            style={{ width: '100%' }}
                          />
                        ))}
                      </List>
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

export default PricingSection;

import React from 'react';
import { Paper, Box, Container, Grid, Typography, Divider } from '@mui/material';
import { Helmet } from 'react-helmet';

const PrivacyPolicySection = () => {
  return (
    <>
      <Helmet>
        <title>Home: BookMyWorker</title>
        <link rel="canonical" href={`https://www.bookmyworkers.com/privacy`} />
      </Helmet>
      <Box id="privacy" component="section" sx={{ py: 8, backgroundColor: '#fafafa' }}>
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
          <Paper elevation={3} sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Privacy & Policy
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography variant="body1" paragraph>
                    At <strong>BookMyWorker</strong>, we care about your privacy. When you use our
                    website or app, we may collect personal details like your name, contact
                    information, Aadhaar, PAN, bank details (from Agents/Workers & Employers), job
                    details, and usage data. This information helps us connect employers with the
                    right workers through our registered Worker Service Agents, manage accounts, and
                    improve our services.{' '}
                  </Typography>

                  <Divider sx={{ my: 4 }} />

                  <Typography variant="body1" paragraph>
                    At <strong>BookMyWorker</strong>, We only share your information when
                    necessary—with verified Worker Service Agents for job coordination, with
                    employers for job assignments, or with legal authorities if required by law.
                    Your information is stored securely, and we take all possible steps to keep it
                    safe. We also use cookies to improve your browsing experience. You can control
                    cookie settings through your browser.{' '}
                  </Typography>

                  <Divider sx={{ my: 4 }} />
                  <Typography variant="body1" paragraph>
                    We are not responsible for other websites linked on our platform. Please read
                    their privacy policies separately. You have full rights to access, update, or
                    request the deletion of your data by contacting us.{' '}
                  </Typography>

                  <Typography sx={{ my: 4 }}>
                    We may update this privacy policy from time to time. Continued use of our
                    platform means you agree to any changes made. If you have any questions, feel
                    free to reach us at <strong>support@bookmyworkers.com</strong>.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default PrivacyPolicySection;

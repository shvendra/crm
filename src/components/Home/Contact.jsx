import React, { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
  Paper,
  Avatar,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { Fade } from 'react-awesome-reveal';
import axios from "../../utils/axiosConfig";
import config from '../../config';
import { Helmet } from 'react-helmet';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/email/send-email`, formData);
      if (response.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '', phone: '' });
      } else {
        setError('Failed to send email.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Home: BookMyWorker</title>
        <link rel="canonical" href={`https://www.bookmyworkers.com/contact`} />
      </Helmet>

      <Box
        id="contact"
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #f9f9f9, #e0f7fa)',
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{ px: { xs: 2, sm: 3, md: 6 } }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <Fade cascade>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, mb: 4 }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              align="center"
              mb={6}
              color="text.secondary"
            >
Let’s connect! Share your query or business requirement below, and our BookMyWorker team will respond with the right solution.            </Typography>
          </Fade>

          <Grid container spacing={6}>
            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <Fade direction="left" triggerOnce>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    background: 'linear-gradient(145deg, #ffffff, #e0f7f7)',
                  }}
                >
                  <Box mb={4}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Our Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      KHASARA NO 34/1/33, Karahiya, Rewa, Madhya Pradesh 486001, India
                    </Typography>
                  </Box>

                  <Box mb={4}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Phone Number
                    </Typography>
                    <Typography variant="body2">
                      <Link href="tel:+917389791873" underline="hover">
                        +91 7389791873
                      </Link>
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Email Address
                    </Typography>
                    <Typography variant="body2">support@bookmyworkers.com</Typography>
                    <Typography variant="body2">business@bookmyworkers.com</Typography>
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Fade direction="right" triggerOnce>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    background: 'linear-gradient(145deg, #ffffff, #e0f7f7)',
                  }}
                >
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          sx={{ borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="email"
                          label="Your Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={1}
                          label="Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </Grid>

                      {loading && (
                        <Grid item xs={12}>
                          <CircularProgress size={28} />
                        </Grid>
                      )}
                      {success && (
                        <Grid item xs={12}>
                          <Alert severity="success">
                            Your message has been sent. Thank you!
                          </Alert>
                        </Grid>
                      )}
                      {error && (
                        <Grid item xs={12}>
                          <Alert severity="error">{error}</Alert>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: '25px',
                            background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                            color: '#fff',
                            textTransform: 'none',
                            '&:hover': {
                              background: 'linear-gradient(to right, #0072ff, #00c6ff)',
                            },
                          }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ContactSection;

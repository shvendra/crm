import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CheckCircle } from '@mui/icons-material';
import { Fade, Slide } from 'react-awesome-reveal';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import config from '../../config';

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const { t } = useTranslation();
  const agentFaqs = t('agentFaqs', { returnObjects: true });
  const faqsEmp = t('employerFaqs', { returnObjects: true });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const featureData = [
    {
      title: t('featureTab1Title'),
      desc: t('featureTab1Desc'),
      points: [t('featureTab1Point1'), t('featureTab1Point2'), t('featureTab1Point3'), t('featureTab1Point4'), t('featureTab1Point5')],
      img: `${config.API_BASE_URL}/assets/img/worker1.jpg`,
    },
    {
      title: t('featureTab2Title'),
      desc: t('featureTab2Desc'),
      points: [t('featureTab2Point1'), t('featureTab2Point2'), t('featureTab2Point3'), t('featureTab2Point4')],
      img: 'semiskilled.png',
    },
    {
      title: t('featureTab3Title'),
      desc: t('featureTab3Desc'),
      points: [t('featureTab3Point1'), t('featureTab3Point2'), t('featureTab3Point3'), t('featureTab3Point4')],
      img: `${config.API_BASE_URL}/assets/img/grouplaber.jpg`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Home: BookMyWorker</title>
        <link rel="canonical" href={`https://www.bookmyworkers.com/feature`} />
      </Helmet>

      <Box id="features" sx={{ py: 4, background: 'linear-gradient(135deg, #f9f9f9, #e0f7fa)' }}>
        <Container
          maxWidth={false}
          disableGutters
          data-aos="fade-up"
          data-aos-delay="100"
          sx={{ px: { xs: 2, sm: 3, md: 6 } }}
        >
          <Fade cascade>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              {t('workforceCategory')}
            </Typography>
            <Typography variant="body1" align="center" mb={6} color="text.secondary">
              {t('catheading')}
            </Typography>
          </Fade>

          {/* Tabs */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label={t('skilled')} />
              <Tab label={t('semiskilled')} />
              <Tab label={t('unskilled')} />
            </Tabs>
          </Box>

          {/* Feature Tabs Content */}
          {featureData.map((feature, idx) => (
            <Slide
              key={idx}
              direction="up"
              triggerOnce
              cascade
              style={{ display: activeTab === idx ? 'block' : 'none', marginBottom: 60 }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} lg={6}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                      {feature.desc}
                    </Typography>
                    <List>
                      {feature.points.map((point, pidx) => (
                        <ListItem key={pidx} sx={{ mb: 1 }}>
                          <ListItemIcon>
                            <CheckCircle color="primary" />
                          </ListItemIcon>
                          <Typography variant="body1">{point}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-5px)' },
                    }}
                  >
                    <img
                      src={feature.img}
                      alt={feature.title}
                      style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </Card>
                </Grid>
              </Grid>
            </Slide>
          ))}
        </Container>
      </Box>

      {/* Premium Cards Section */}
      <Box sx={{ py: 4, background: '#e0f2f1' }}>
        <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3, md: 6 } }}>
          <Grid container spacing={4}>
            {[
              { title: t('workerAgent'), desc: t('workerAgentDescription'), icon: '👷‍♂️', link: '/register' },
              { title: t('employer'), desc: t('employerDescription'), icon: '🏢', link: '/register' },
            ].map((card, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    // textAlign: 'center',
                    background: 'linear-gradient(135deg, #fff, #e3f7f2)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 72,
                      height: 72,
                      mb: 3,
                      fontSize: 32,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Typography variant="h5" fontWeight="700" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" mb={3} color="text.secondary">
                    {card.desc}
                  </Typography>
                  <Button
                    variant="contained"
                    href={card.link}
                    sx={{
                      px: 5,
                      py: 1.5,
                      borderRadius: '25px',
                      fontWeight: 700,
                      background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                      color: '#fff',
                      '&:hover': { background: 'linear-gradient(to right, #0072ff, #00c6ff)' },
                    }}
                  >
                    {t('registerNow')}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      {/* <Box sx={{ py: 4, background: '#e0f7fa' }}>
        <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3, md: 6 } }}>
          <Fade cascade>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              {t('faqTitle')}
            </Typography>
            <Typography variant="body1" align="center" mb={6} color="text.secondary">
              {t('faqDescription')}
            </Typography>
          </Fade>

          <Grid container spacing={4}>
            {[{ title: t('workerAgent') + ' FAQs', data: agentFaqs }, { title: t('employer') + ' FAQs', data: faqsEmp }].map(
              (faqSet, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(145deg, #ffffff, #e0f7f7)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography variant="h5" fontWeight="700" gutterBottom>
                      {faqSet.title}
                    </Typography>
                    {Array.isArray(faqSet.data) &&
                      faqSet.data.map((faq, fidx) => (
                        <Accordion
                          key={fidx}
                          sx={{
                            mt: fidx === 0 ? 2 : 1,
                            '& .MuiAccordionSummary-content': { fontWeight: 600 },
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                            <Typography>{faq.question}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography whiteSpace="pre-line">{faq.answer}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box> */}
    </>
  );
};

export default FeaturesSection;

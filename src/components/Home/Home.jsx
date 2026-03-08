import React, { useState } from 'react';
import categories from '../../categories.json';
import { Box, Container, Grid, Button } from '@mui/material';
import { FaWhatsapp, FaDownload, FaGooglePlay, FaPhone } from 'react-icons/fa'; // Keep react-icons for custom icons
import { useTranslation } from 'react-i18next';
import DiwaliPopup from './DiwaliPopup';

import Header from './Header';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import FeaturesSection from './FeatureSection';
import ServiceBoxGrid from './ServiceBoxGrid';
import Footer from './Footer';
import PricingSection from './PricingSection';
import PrivacyPolicySection from './PrivacyPolicySection';
import EmployersTermsPage from './TermsCondition';
import ContactSection from './Contact';
import ServicesSection from './ServicesSection';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons
import CookieConsent from './CookieConsent';

import 'aos/dist/aos.css'; // AOS styles
import './home.css';
import { Helmet } from 'react-helmet';
import { ScrollToTopButton } from './ScrollToTopButton'; // Assuming this is the correct path for the ScrollToTopButton component
import { ChatPopup } from './Chat-popup';

const Home = () => {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'privacy' | 'terms'

  const handleFooterMenuClick = page => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // optional: scroll to top after click
  };

  const { t, i18n } = useTranslation();
  const chunkedCategories = [];
  const chunkSize = Math.ceil(categories.length / 3);
  const [lang, setLang] = useState(false);

  // Split categories into chunks
  for (let i = 0; i < categories.length; i += chunkSize) {
    chunkedCategories.push(categories.slice(i, i + chunkSize));
  }
  return (
    <>
      <Helmet>
        <title>Home: BookMyWorker</title>
        <link rel="canonical" href={`https://www.bookmyworkers.com/home`} />
      </Helmet>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <Header onFooterMenuClick={handleFooterMenuClick} />
        <Box id="main-scroll-container" component="main" sx={{ flex: 1}}>
          <>
            {/* <DiwaliPopup /> */}
            <HeroSection />
            <ServiceBoxGrid />
            <AboutSection />
            <ServicesSection />
            <FeaturesSection />
            {/* <PricingSection /> */}

            {currentPage === 'privacy' && <PrivacyPolicySection />}
            {currentPage === 'terms' && <EmployersTermsPage />}
            <ContactSection />
            <CookieConsent />

            <Footer onFooterMenuClick={handleFooterMenuClick} />
            <ChatPopup />
          </>
        </Box>
      </Box>
    </>
  );
};

export default Home;

import React, { useEffect, useContext } from 'react';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { Context } from '../../main';
import mobileTheme from '../../theme/mobileTheme';
import { initializeMobileOptimizations, isAndroidWebView, getDeviceInfo } from '../../utils/mobileUtils';

const MobileLayout = ({ children }) => {
  const { user } = useContext(Context);
  const isWebView = isAndroidWebView();

  useEffect(() => {
    // Only initialize mobile optimizations in Android WebView
    let cleanup;
    
    if (isWebView) {
      cleanup = initializeMobileOptimizations();
      
      // Log device info for debugging (only in development)
      if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
        console.log('📱 Device Info:', getDeviceInfo());
      }

      // Add mobile-specific body classes only for WebView
      document.body.classList.add('mobile-optimized', 'android-webview');

      // Set CSS variables for mobile only in WebView
      document.documentElement.style.setProperty('--mobile-safe-area-top', 'env(safe-area-inset-top, 0px)');
      document.documentElement.style.setProperty('--mobile-safe-area-bottom', 'env(safe-area-inset-bottom, 0px)');
      document.documentElement.style.setProperty('--mobile-header-height', '48px');
      document.documentElement.style.setProperty('--mobile-bottom-nav-height', '56px');
    }

    return () => {
      if (isWebView) {
        document.body.classList.remove('mobile-optimized', 'android-webview');
        cleanup && cleanup();
      }
    };
  }, [isWebView]);

  // Only apply special layout if in WebView, otherwise use normal layout
  if (!isWebView) {
    return (
      <ThemeProvider theme={mobileTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={mobileTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh', // Dynamic viewport height for Android WebView
          width: '100%',
          backgroundColor: 'background.default',
          overflow: 'hidden',
          // Safe area handling only in WebView
          paddingTop: 'var(--mobile-safe-area-top)',
          paddingBottom: user ? 'var(--mobile-bottom-nav-height)' : 'var(--mobile-safe-area-bottom)',
        }}
      >
        {/* Main content area - WebView optimized */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            overflow: 'auto',
            // Enable momentum scrolling on WebView
            WebkitOverflowScrolling: 'touch',
            // WebView specific scrolling behavior
            height: 'calc(100vh - var(--mobile-header-height) - var(--mobile-bottom-nav-height))',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MobileLayout;
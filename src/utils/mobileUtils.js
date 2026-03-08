// Mobile and WebView utility functions

/**
 * Detects if the app is running in Android WebView
 */
export const isAndroidWebView = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('android') && ua.includes('wv');
};

/**
 * Detects if the app is running in any WebView (Android or iOS)
 */
export const isWebView = () => {
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes('wv') || // Android WebView
    ua.includes('iphone os') && !ua.includes('safari') || // iOS WebView
    ua.includes('facebook') || // Facebook in-app browser
    ua.includes('instagram') || // Instagram in-app browser
    ua.includes('linkedin') || // LinkedIn in-app browser
    window.ReactNativeWebView !== undefined // React Native WebView
  );
};

/**
 * Detects if device is mobile (phone or tablet)
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Detects if device is specifically a phone (not tablet)
 */
export const isPhone = () => {
  return window.innerWidth <= 768 && isMobile();
};

/**
 * Gets the safe area insets for devices with notches
 */
export const getSafeAreaInsets = () => {
  const root = document.documentElement;
  return {
    top: getComputedStyle(root).getPropertyValue('--sat') || '0px',
    right: getComputedStyle(root).getPropertyValue('--sar') || '0px',
    bottom: getComputedStyle(root).getPropertyValue('--sab') || '0px',
    left: getComputedStyle(root).getPropertyValue('--sal') || '0px',
  };
};

/**
 * Sets CSS custom properties for safe area handling
 */
export const initializeSafeArea = () => {
  const setProperty = (name, value) => {
    document.documentElement.style.setProperty(name, value);
  };

  // Set safe area inset variables
  if (CSS.supports('padding: env(safe-area-inset-top)')) {
    setProperty('--sat', 'env(safe-area-inset-top)');
    setProperty('--sar', 'env(safe-area-inset-right)');
    setProperty('--sab', 'env(safe-area-inset-bottom)');
    setProperty('--sal', 'env(safe-area-inset-left)');
  } else {
    setProperty('--sat', '0px');
    setProperty('--sar', '0px');
    setProperty('--sab', '0px');
    setProperty('--sal', '0px');
  }
};

/**
 * Prevents zoom on double-tap (WebView specific)
 */
export const preventZoom = () => {
  let lastTouchEnd = 0;
  
  const preventZoomHandler = (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  };

  document.addEventListener('touchend', preventZoomHandler, { passive: false });
  
  return () => {
    document.removeEventListener('touchend', preventZoomHandler);
  };
};

/**
 * Handles keyboard events for better WebView experience
 */
export const handleWebViewKeyboard = () => {
  let initialViewportHeight = window.innerHeight;
  
  const handleResize = () => {
    const currentHeight = window.innerHeight;
    const heightDiff = initialViewportHeight - currentHeight;
    
    if (heightDiff > 150) { // Keyboard is likely open
      document.body.classList.add('keyboard-open');
      // Adjust viewport for keyboard
      document.documentElement.style.setProperty('--keyboard-height', `${heightDiff}px`);
    } else {
      document.body.classList.remove('keyboard-open');
      document.documentElement.style.setProperty('--keyboard-height', '0px');
    }
  };

  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
    document.body.classList.remove('keyboard-open');
  };
};

/**
 * Optimizes scrolling for WebView
 */
export const optimizeScrolling = () => {
  // Enable momentum scrolling on iOS WebView
  document.body.style.webkitOverflowScrolling = 'touch';
  document.body.style.overflowScrolling = 'touch';
  
  // Prevent bounce scrolling
  document.body.addEventListener('touchmove', (e) => {
    if (e.target === document.body) {
      e.preventDefault();
    }
  }, { passive: false });
};

/**
 * Gets device information for debugging
 */
export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    vendor: navigator.vendor,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: screen.width,
    screenHeight: screen.height,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    isWebView: isWebView(),
    isAndroidWebView: isAndroidWebView(),
    isMobile: isMobile(),
    isPhone: isPhone(),
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
    } : null,
  };
};

/**
 * Responsive breakpoint utilities
 */
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

/**
 * Media query helpers
 */
export const useMediaQuery = (query) => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
};

export const isXs = () => useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
export const isSm = () => useMediaQuery(`(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`);
export const isMd = () => useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`);
export const isLg = () => useMediaQuery(`(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`);
export const isXl = () => useMediaQuery(`(min-width: ${breakpoints.xl}px)`);

/**
 * Touch gesture utilities
 */
export const addTouchFeedback = (element) => {
  if (!element) return;
  
  element.addEventListener('touchstart', () => {
    element.style.transform = 'scale(0.98)';
    element.style.opacity = '0.8';
  });
  
  element.addEventListener('touchend', () => {
    element.style.transform = 'scale(1)';
    element.style.opacity = '1';
  });
  
  element.addEventListener('touchcancel', () => {
    element.style.transform = 'scale(1)';
    element.style.opacity = '1';
  });
};

/**
 * Performance optimization for mobile
 */
export const optimizePerformance = () => {
  // Disable hover effects on touch devices
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }
  
  // Optimize images for mobile
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.loading) {
      img.loading = 'lazy';
    }
  });
  
  // Reduce animation duration on low-end devices
  if (navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
  }
};

/**
 * Initialize all mobile optimizations
 */
export const initializeMobileOptimizations = () => {
  if (typeof window === 'undefined') return;
  
  initializeSafeArea();
  optimizeScrolling();
  optimizePerformance();
  
  const cleanupKeyboard = handleWebViewKeyboard();
  const cleanupZoom = preventZoom();
  
  return () => {
    cleanupKeyboard();
    cleanupZoom();
  };
};

export default {
  isAndroidWebView,
  isWebView,
  isMobile,
  isPhone,
  getSafeAreaInsets,
  initializeSafeArea,
  preventZoom,
  handleWebViewKeyboard,
  optimizeScrolling,
  getDeviceInfo,
  breakpoints,
  useMediaQuery,
  isXs,
  isSm,
  isMd,
  isLg,
  isXl,
  addTouchFeedback,
  optimizePerformance,
  initializeMobileOptimizations,
};
// Error tracking and monitoring utilities

export const initializeMonitoring = () => {
  // Initialize error tracking only in production
  if (import.meta.env.VITE_APP_ENVIRONMENT === 'production') {
    // Example with Sentry (install @sentry/react if needed)
    // import * as Sentry from '@sentry/react';
    // 
    // Sentry.init({
    //   dsn: import.meta.env.VITE_SENTRY_DSN,
    //   environment: import.meta.env.VITE_APP_ENVIRONMENT,
    //   tracesSampleRate: 0.1,
    // });
  }
};

export const logError = (error, context = {}) => {
  if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
    console.error('Error:', error, context);
  }
  
  // Send to error tracking service in production
  if (import.meta.env.VITE_APP_ENVIRONMENT === 'production') {
    // Example: Sentry.captureException(error, { extra: context });
  }
};

export const logInfo = (message, data = {}) => {
  if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
    console.info(message, data);
  }
};

export const logWarning = (message, data = {}) => {
  if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
    console.warn(message, data);
  }
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
  return fn();
};

// User session tracking (GDPR compliant)
export const initializeAnalytics = () => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    // Initialize analytics only with user consent
    // Example: Google Analytics, Mixpanel, etc.
    console.log('Analytics initialized');
  }
};

// Health check utility
export const healthCheck = async () => {
  try {
    const response = await fetch('/health');
    return response.ok;
  } catch (error) {
    logError('Health check failed', error);
    return false;
  }
};

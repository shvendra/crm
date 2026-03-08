import { useEffect } from 'react';
import { logInfo } from '../utils/monitoring';

// Web Vitals monitoring
const PerformanceMonitor = () => {
  useEffect(() => {
    // Only monitor performance in production
    if (import.meta.env.VITE_APP_ENVIRONMENT !== 'production') return;

    // Dynamic import to avoid loading in development
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(logWebVital);
      onFID(logWebVital);
      onFCP(logWebVital);
      onLCP(logWebVital);
      onTTFB(logWebVital);
    }).catch(() => {
      // Fallback if web-vitals is not available
      console.log('Web Vitals monitoring not available');
    });

    // Monitor resource loading times
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          logInfo('Navigation timing', {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            firstPaint: entry.responseEnd - entry.requestStart,
          });
        }
        
        if (entry.entryType === 'resource') {
          // Log slow resources
          if (entry.duration > 1000) {
            logInfo('Slow resource detected', {
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize,
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'resource'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Memory usage monitoring
  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_DEBUG !== 'true') return;

    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = performance.memory;
        logInfo('Memory usage', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB',
        });
      }
    };

    const interval = setInterval(monitorMemory, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
};

// Web vital logging function
const logWebVital = (metric) => {
  logInfo('Web Vital', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
  });

  // You could send this data to your analytics service here
  // Example: analytics.track('web-vital', metric);
};

export default PerformanceMonitor;

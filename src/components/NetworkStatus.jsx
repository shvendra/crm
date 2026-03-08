import React, { useState, useEffect } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { WifiOff, Wifi } from 'lucide-react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    // Detect connection type if available
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
        
        connection.addEventListener('change', () => {
          setConnectionType(connection.effectiveType || 'unknown');
        });
      }
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Auto-hide alert after connection is restored
    if (isOnline && showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, showAlert]);

  // Show alert for offline or slow connection
  const shouldShowAlert = !isOnline || (connectionType === 'slow-2g' || connectionType === '2g');

  if (!shouldShowAlert && !showAlert) return null;

  return (
    <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, maxWidth: 350 }}>
      <Alert
        severity={!isOnline ? 'error' : 'warning'}
        icon={!isOnline ? <WifiOff size={20} /> : <Wifi size={20} />}
        sx={{ mb: 1 }}
      >
        <Typography variant="body2">
          {!isOnline 
            ? 'No internet connection' 
            : `Slow connection detected (${connectionType})`
          }
        </Typography>
        {!isOnline && (
          <Typography variant="caption" color="text.secondary">
            Please check your network connection
          </Typography>
        )}
      </Alert>
    </Box>
  );
};

export default NetworkStatus;
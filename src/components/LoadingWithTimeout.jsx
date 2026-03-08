import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { RefreshCcw } from 'lucide-react';

const LoadingWithTimeout = ({
  timeout = 15000, // 15 seconds
  message = "Loading your experience...",
  minHeight = "100vh",
}) => {
  const [isTimeout, setIsTimeout] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);

      if (elapsed >= timeout) {
        setIsTimeout(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeout]);

  const handleReload = () => {
    window.location.reload();
  };

  if (isTimeout) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight,
          p: 3,
          bgcolor: 'background.default',
          textAlign: 'center',
        }}
      >
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 2,
            maxWidth: 420,
            boxShadow: 2,
          }}
        >
          The page is taking longer than expected to load.
        </Alert>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: 360 }}
        >
          This might be due to a slow internet connection or temporary server issue.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshCcw size={18} />}
          onClick={handleReload}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
        >
          Reload Page
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 3,
            display: 'block',
            opacity: 0.8,
            lineHeight: 1.8,
          }}
        >
          If the issue continues, please contact our support team:
          <br />
          <strong>Phone:</strong>{' '}
          <a href="tel:+917389791873" style={{ color: '#1976d2', textDecoration: 'none' }}>
            +91 7389791873
          </a>
          <br />
          <strong>Support Email:</strong>{' '}
          <a href="mailto:support@bookmyworkers.com" style={{ color: '#1976d2', textDecoration: 'none' }}>
            support@bookmyworkers.com
          </a>
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        p: 3,
        textAlign: 'center',
      }}
    >
      <CircularProgress size={50} thickness={4} color="primary" />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mt: 2, fontWeight: 500 }}
      >
        {message}
      </Typography>

      {elapsedTime > 5000 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, opacity: 0.7 }}
        >
          Still loading... ({Math.round(elapsedTime / 1000)}s)
        </Typography>
      )}
    </Box>
  );
};

export default LoadingWithTimeout;

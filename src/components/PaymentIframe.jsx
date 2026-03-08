import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  LinearProgress, 
  IconButton, 
  Typography, 
  Alert,
  Button,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { isAndroidWebView, isWebView } from '../utils/mobileUtils';

const PaymentIframe = ({ 
  open, 
  onClose, 
  paymentUrl, 
  onSuccess, 
  onError, 
  title = "Complete Payment" 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      setProgress(0);
      
      // Start progress simulation
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [open, paymentUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
    setProgress(100);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('Failed to load payment page. Please check your connection.');
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
    setProgress(0);
    
    // Force reload iframe
    if (iframeRef.current) {
      iframeRef.current.src = `${paymentUrl}?retry=${retryCount}`;
    }
  };

  const handleClose = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    onClose();
  };

  // WebView specific styles
  const iframeStyles = {
    width: '100%',
    height: '100%',
    minHeight: isAndroidWebView() ? '70vh' : '60vh',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    // WebView optimizations
    ...(isWebView() && {
      touchAction: 'manipulation',
      webkitOverflowScrolling: 'touch',
      overflow: 'auto',
    }),
  };

  const dialogStyles = {
    '& .MuiDialog-paper': {
      margin: 8,
      width: '100%',
      maxWidth: '100%',
      height: '95vh',
      maxHeight: '95vh',
      borderRadius: 12,
      ...(isAndroidWebView() && {
        margin: 0,
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        borderRadius: 0,
      }),
    },
    '& .MuiDialogContent-root': {
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullScreen={isAndroidWebView()}
      sx={dialogStyles}
      PaperProps={{
        sx: {
          backgroundColor: '#f5f5f5',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1976d2',
          color: 'white',
          padding: isAndroidWebView() ? '8px 12px' : '16px',
          minHeight: 48,
        }}
      >
        <Typography variant="h6" component="div" sx={{ 
          fontSize: isAndroidWebView() ? '1rem' : '1.125rem',
          fontWeight: 600,
        }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {error && (
            <IconButton 
              onClick={handleRetry} 
              sx={{ color: 'white', padding: '6px' }}
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          )}
          <IconButton 
            onClick={handleClose} 
            sx={{ color: 'white', padding: '6px' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: 0, position: 'relative' }}>
        {/* Loading Progress */}
        {loading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading secure payment page...
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ width: '80%', mt: 2 }}
            />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert 
              severity="error" 
              action={
                <Button size="small" onClick={handleRetry}>
                  Retry
                </Button>
              }
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
            {retryCount > 2 && (
              <Alert severity="info">
                <Typography variant="body2">
                  Having trouble loading? Try:
                  <br />• Check your internet connection
                  <br />• Close and reopen the payment
                  <br />• Use a different payment method
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* Payment Iframe */}
        {paymentUrl && !error && (
          <Box sx={{ 
            flex: 1, 
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: '8px 8px 0 0',
            overflow: 'hidden',
          }}>
            <iframe
              ref={iframeRef}
              src={paymentUrl}
              style={iframeStyles}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Payment Gateway"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              // WebView specific attributes
              {...(isAndroidWebView() && {
                allow: "payment; microphone; camera; geolocation",
                loading: "eager",
              })}
            />
          </Box>
        )}
      </DialogContent>

      {/* WebView specific bottom padding for safe area */}
      {isAndroidWebView() && (
        <Box sx={{ 
          height: 'env(safe-area-inset-bottom, 0px)', 
          backgroundColor: '#1976d2' 
        }} />
      )}
    </Dialog>
  );
};

// Hook for handling payment flow
export const usePaymentFlow = () => {
  const [paymentState, setPaymentState] = useState({
    isOpen: false,
    url: null,
    loading: false,
    error: null,
  });

  const initializePayment = (paymentUrl) => {
    setPaymentState({
      isOpen: true,
      url: paymentUrl,
      loading: false,
      error: null,
    });
  };

  const closePayment = () => {
    setPaymentState({
      isOpen: false,
      url: null,
      loading: false,
      error: null,
    });
  };

  const handlePaymentSuccess = (data) => {
    console.log('Payment successful:', data);
    closePayment();
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setPaymentState(prev => ({
      ...prev,
      error: error.message || 'Payment failed',
    }));
  };

  return {
    paymentState,
    initializePayment,
    closePayment,
    handlePaymentSuccess,
    handlePaymentError,
  };
};

// WebView message handler for payment callbacks
export const setupPaymentMessageHandler = (onSuccess, onError) => {
  const handleMessage = (event) => {
    try {
      // Handle messages from PhonePe or other payment gateways
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
      if (data.type === 'PAYMENT_SUCCESS') {
        onSuccess(data.payload);
      } else if (data.type === 'PAYMENT_ERROR' || data.type === 'PAYMENT_CANCELLED') {
        onError(data.payload || { message: 'Payment cancelled' });
      }
    } catch (error) {
      console.warn('Failed to parse payment message:', error);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => {
    window.removeEventListener('message', handleMessage);
  };
};

export default PaymentIframe;
import React, { useEffect } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import PaymentIframe, { 
  usePaymentFlow, 
  setupPaymentMessageHandler 
} from '../components/PaymentIframe';

// Example component showing how to use PaymentIframe for PhonePe
const PaymentExample = () => {
  const {
    paymentState,
    initializePayment,
    closePayment,
    handlePaymentSuccess,
    handlePaymentError,
  } = usePaymentFlow();

  useEffect(() => {
    // Setup message handler for payment callbacks
    const cleanup = setupPaymentMessageHandler(
      (data) => {
        console.log('Payment successful:', data);
        handlePaymentSuccess(data);
        // Handle successful payment (e.g., redirect, show success message)
      },
      (error) => {
        console.error('Payment failed:', error);
        handlePaymentError(error);
        // Handle payment failure (e.g., show error message, retry option)
      }
    );

    return cleanup;
  }, [handlePaymentSuccess, handlePaymentError]);

  const handleStartPayment = () => {
    // Example PhonePe payment URL - replace with actual payment URL from your backend
    const paymentUrl = 'https://mercury.phonepe.com/transact/pg?v=1&t=aHR0cHM6Ly9tZXJjdXJ5LnBob25lcGUuY29tL3RyYW5zYWN0L3BnP3Y9MSZ0PW1lcmN1cnkucGhvbmVwZS5jb20%3D';
    
    initializePayment(paymentUrl);
  };

  const handleStartDemoPayment = () => {
    // Demo payment URL for testing
    const demoPaymentUrl = 'https://demo.phonepe.com/payment-gateway';
    
    initializePayment(demoPaymentUrl);
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Payment Integration Example
      </Typography>
      
      <Typography variant="body1" paragraph>
        This example shows how to integrate PhonePe payments using the mobile-optimized 
        PaymentIframe component for Android WebView.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button 
          variant="contained" 
          onClick={handleStartPayment}
          size="large"
          sx={{ minHeight: 48 }}
        >
          Start PhonePe Payment
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={handleStartDemoPayment}
          size="large"
          sx={{ minHeight: 48 }}
        >
          Demo Payment
        </Button>
      </Box>

      {paymentState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Payment Error: {paymentState.error}
        </Alert>
      )}

      {/* Payment Features */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Mobile Payment Features:
        </Typography>
        <ul>
          <li>✅ Android WebView optimized</li>
          <li>✅ Full-screen payment experience</li>
          <li>✅ Loading progress indication</li>
          <li>✅ Network error handling</li>
          <li>✅ Retry mechanism</li>
          <li>✅ Safe area support (notches)</li>
          <li>✅ Touch-optimized controls</li>
          <li>✅ Payment callback handling</li>
        </ul>
      </Box>

      {/* Integration Code Example */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Basic Usage:
        </Typography>
        <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
{`import PaymentIframe, { usePaymentFlow } from './components/PaymentIframe';

const MyComponent = () => {
  const { paymentState, initializePayment, closePayment } = usePaymentFlow();
  
  const handlePayment = () => {
    initializePayment('YOUR_PAYMENT_URL_HERE');
  };

  return (
    <>
      <Button onClick={handlePayment}>Pay Now</Button>
      <PaymentIframe
        open={paymentState.isOpen}
        paymentUrl={paymentState.url}
        onClose={closePayment}
        onSuccess={(data) => console.log('Success:', data)}
        onError={(error) => console.error('Error:', error)}
        title="Complete Payment"
      />
    </>
  );
};`}
        </pre>
      </Box>

      {/* Payment iframe component */}
      <PaymentIframe
        open={paymentState.isOpen}
        paymentUrl={paymentState.url}
        onClose={closePayment}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        title="Complete Your Payment"
      />
    </Box>
  );
};

export default PaymentExample;
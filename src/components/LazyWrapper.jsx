import { Suspense } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      p: 3,
    }}
  >
    <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
      Something went wrong loading this page
    </Alert>
    <button onClick={resetErrorBoundary}>Try again</button>
  </Box>
);

// Loading component
const LoadingFallback = ({ minHeight = '50vh' }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight,
    }}
  >
    <CircularProgress color="primary" />
  </Box>
);

// Lazy wrapper component
const LazyWrapper = ({ 
  children, 
  minHeight = '50vh',
  onError = (error) => console.error('Lazy component error:', error)
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={onError}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={<LoadingFallback minHeight={minHeight} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyWrapper;

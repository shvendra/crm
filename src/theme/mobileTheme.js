import { createTheme } from '@mui/material/styles';
import { isAndroidWebView } from '../utils/mobileUtils';

// Enhanced theme that preserves your existing design but adds minimal mobile optimizations when needed
const createConditionalTheme = () => {
  const isWebView = typeof window !== 'undefined' && isAndroidWebView();
  
  // Base theme - keeps your existing design unchanged
  const baseTheme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      // No typography changes - keeps your existing sizes
    },
    components: {
      // Only add minimal WebView-specific optimizations
      ...(isWebView && {
        // Only for Android WebView - add safe area support
        MuiAppBar: {
          styleOverrides: {
            root: {
              paddingTop: 'env(safe-area-inset-top, 0px)',
            },
          },
        },
        // Only for WebView - ensure touch targets are accessible
        MuiButton: {
          styleOverrides: {
            root: {
              '@media (max-width: 480px)': {
                minHeight: 44, // Only on very small screens
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              '@media (max-width: 480px)': {
                minHeight: 44,
                minWidth: 44,
              },
            },
          },
        },
        // WebView-specific bottom navigation
        MuiBottomNavigation: {
          styleOverrides: {
            root: {
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            },
          },
        },
      }),
    },
  });

  return baseTheme;
};

// Export the conditional theme
const mobileTheme = createConditionalTheme();

export default mobileTheme;

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { AlertCircle } from "lucide-react";
import { Navigate } from "react-router-dom";

// Functional component to handle navigation/redirection
const RedirectToLanding = () => {
  return <Navigate to="/landing" replace />;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      unauthorized: false, // track unauthorized
    };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Error info:", errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Check if this error is "unauthorized"
    if (
      error?.response?.status === 401 ||
      error?.response?.data?.message?.toLowerCase().includes("user not authorized")
    ) {
      this.setState({ unauthorized: true });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1,
      unauthorized: false,
    });
    // Reload page or re-fetch data
    window.location.reload();
  };

  render() {
    if (this.state.unauthorized) {
      return <RedirectToLanding />;
    }

    if (this.state.hasError) {
      return (
       <Box
  sx={{
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    px: 3,
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
  }}
>
  {/* soft background glow */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(circle at top left, rgba(37,99,235,0.10), transparent 28%), radial-gradient(circle at bottom right, rgba(14,165,233,0.10), transparent 28%)",
      pointerEvents: "none",
    }}
  />

  <Box
    sx={{
      position: "relative",
      zIndex: 1,
      maxWidth: 460,
      width: "100%",
      borderRadius: "28px",
      border: "1px solid #e2e8f0",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
      boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
      p: { xs: 3, sm: 4 },
    }}
  >
    {/* icon circle */}
    <Box
      sx={{
        width: 92,
        height: 92,
        mx: "auto",
        mb: 2,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(96,165,250,0.18) 100%)",
        border: "1px solid rgba(37,99,235,0.14)",
        boxShadow: "0 14px 30px rgba(37,99,235,0.12)",
      }}
    >
      <AlertCircle size={46} color="#2563eb" />
    </Box>

    <Typography
      variant="h5"
      gutterBottom
      sx={{
        color: "#0f172a",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        mb: 1,
      }}
    >
      Oops! Something went wrong.
    </Typography>

    <Typography
      variant="body1"
      sx={{
        color: "#64748b",
        mb: 3,
        maxWidth: 380,
        mx: "auto",
        lineHeight: 1.7,
        fontWeight: 500,
      }}
    >
      Please try reloading the page.
    </Typography>

    <Button
      variant="contained"
      color="primary"
      onClick={this.handleRetry}
      sx={{
        minHeight: 46,
        px: 3.5,
        borderRadius: "14px",
        textTransform: "none",
        fontWeight: 800,
        fontSize: "0.95rem",
        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        boxShadow: "0 14px 28px rgba(37,99,235,0.22)",
        "&:hover": {
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
          boxShadow: "0 18px 36px rgba(37,99,235,0.30)",
        },
      }}
    >
      Reload Page
    </Button>
  </Box>
</Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

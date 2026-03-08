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
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "background.paper",
            px: 3,
            textAlign: "center",
          }}
        >
          <AlertCircle size={48} color="#1976d2" style={{ marginBottom: "16px" }} />

          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#1976d2", fontWeight: "bold" }}
          >
            Oops! Something went wrong.
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#555", mb: 2, maxWidth: 400 }}
          >
            Please try reloading the page.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={this.handleRetry}
            sx={{ minHeight: 44 }}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

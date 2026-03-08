import React, { useContext, useEffect, useState, Suspense, lazy } from "react";
import "./App.css";
import {
  useNavigate,
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Box, CircularProgress, Container, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import axios from "./utils/axiosConfig";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Layout/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import MobileLayout from "./components/Layout/MobileLayout";
import LogoLoader from "./LogoLoader";
import VerifiedAgentsPage from "./components/VerifiedAgentsPage";
import PricingPage from "./components/PricingPage";
import DashboardRequirements from "./components/Dashboard/DashboardRequirements";

const AdminAgreementsPage = lazy(
  () => import("./components/Agreements/AgreementCreator"),
);
const EmployerSignAgreement = lazy(
  () => import("./components/Agreements/EmployerSignAgreement"),
); // lazy load
const AgentBenefits = lazy(() => import("./components/Home/AgentBenefits")); // lazy load
const Home = lazy(() => import("./components/Home/Home"));
import PaymentCallback from "./components/Payout/PaymentCallback"; // direct import due to critical path
const BlogPost = lazy(() => import("./components/Blog/BlogPost"));
const BlogDisplay = lazy(() => import("./components/Home/publishedBlog"));
const SingleBlog = lazy(() => import("./components/Home/SingleBlog"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const HealthMonitor = lazy(
  () => import("./components/Dashboard/HealthMonitor"),
);
const Jobs = lazy(() => import("./components/Job/Jobs"));
const JobDetails = lazy(() => import("./components/Job/JobDetails"));
const Application = lazy(() => import("./components/Application/Application"));
const MyApplications = lazy(
  () => import("./components/Application/MyApplications"),
);
const PostJob = lazy(() => import("./components/Job/PostJob"));
const BrowseWorker = lazy(() => import("./components/Job/BrowseWorker"));
const RequestWorkerForm = lazy(() => import("./components/Job/RequestWorkers"));
const MyProfile = lazy(() => import("./components/profile/MyProfile"));
const NotFound = lazy(() => import("./components/NotFound/NotFound"));
const MyJobs = lazy(() => import("./components/Job/MyJobs"));
const Payout = lazy(() => import("./components/Payout/Payout"));
const SuperAdminPayout = lazy(() => import("./components/Payout/AdminPayout"));
const PaymentStatus = lazy(() => import("./components/Payout/PaymentStatus"));
const AdminLogin = lazy(() => import("./components/Auth/AdminLogin"));
const Login = lazy(() => import("./components/Auth/Login"));
const Register = lazy(() => import("./components/Auth/Register"));
const ForgotPassword = lazy(() => import("./components/Auth/ForgotPassword"));
const Landing = lazy(() => import("./components/Landing"));
const Unveryfied = lazy(() => import("./components/UnverifiedUsers"));
const Leads = lazy(() => import("./components/Leads"));
const HistoryPage = lazy(() => import("./components/History/WorkTable"));
const KycUpload = lazy(() => import("./components/KycUploadPage"));

import { useTranslation } from "react-i18next";
import { Context } from "./main";
import config from "../src/config";

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser, user } = useContext(Context);
  const { i18n } = useTranslation();
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setAuthError(false);

        // Create timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 15000); // 15 second timeout

        const response = await axios.get(
          `${config.API_BASE_URL}/api/v1/user/getuser`,
          {
            withCredentials: true,
            signal: controller.signal,
            timeout: 15000,
          },
        );

        clearTimeout(timeoutId);

        if (response.data.user) {
          setUser(response.data.user);
          setIsAuthorized(true);
          console.log(
            "User authenticated successfully:",
            response.data.user.name,
            response.data.user.role,
          );
        } else {
          setUser(null);
          setIsAuthorized(false);
          console.log("No user found in response");
        }
      } catch (error) {
        console.error("Auth check failed:", error.message);
        setUser(null);
        setIsAuthorized(false);

        // Set error state for retry option
        if (error.name === "AbortError" || error.code === "ECONNABORTED") {
          setAuthError(true);
        }
      } finally {
        setAuthChecked(true);
      }
    };

    // Only run auth check on initial load, not after logout
    fetchUser();
  }, []); // Remove isAuthorized dependency to prevent auto-login after logout

  useEffect(() => {
    i18n.changeLanguage("en"); // Always keep UI in English
  }, [user, i18n]);

  // Handle retry functionality
  const handleRetry = () => {
    setAuthChecked(false);
    setAuthError(false);
    setRetryCount((prev) => prev + 1);

    // Trigger auth check again
    const fetchUser = async () => {
      try {
        setAuthError(false);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 15000);

        const response = await axios.get(
          `${config.API_BASE_URL}/api/v1/user/getuser`,
          {
            withCredentials: true,
            signal: controller.signal,
            timeout: 15000,
          },
        );
        console.log(response);
        clearTimeout(timeoutId);

        if (response.user) {
          setUser(response.user);
          setIsAuthorized(true);
        } else {
          setUser(null);
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Retry auth check failed:", error.message);
        setUser(null);
        setIsAuthorized(false);

        if (error.name === "AbortError" || error.code === "ECONNABORTED") {
          setAuthError(true);
        }
      } finally {
        setAuthChecked(true);
      }
    };

    fetchUser();
  };

  if (!authChecked) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
          px: 2,
        }}
      >
        {authError ? (
          <>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <h3 style={{ color: "#1976d2", marginBottom: "8px" }}>
                Connection Issue
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  margin: "0 0 16px 0",
                }}
              >
                Unable to connect to server. Please check your internet
                connection.
              </p>
              <button
                onClick={handleRetry}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  minHeight: "44px",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#1565c0")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
              >
                Retry Connection {retryCount > 0 ? `(${retryCount})` : ""}
              </button>
            </Box>
          </>
        ) : (
          <>
            <LogoLoader />
          </>
        )}
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter basename="/app">
          <AppContent />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

const AppContent = () => {
  const { isAuthorized, user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const publicPaths = [
      "/", // Home - ALWAYS accessible for everyone
      "/landing",
      "/blogs",
      "/agent-benefits",
      "/agreements/",
      "/job/public",
    ];

    const authPages = [
      "/login",
      "/register",
      "/forgot-password",
      "/admin/login",
    ];

    const currentPath = location.pathname.toLowerCase();

    const isPublic =
      publicPaths.some((path) => currentPath.startsWith(path)) ||
      currentPath.startsWith("/blog/");
    const isAuthPage = authPages.some((path) => currentPath.startsWith(path));
    const isHomePage = currentPath === "/";

    // 🏠 HOMEPAGE: Always accessible for everyone (logged in or not)
    if (isHomePage) {
      console.log("🏠 HOMEPAGE ACCESS:", {
        isAuthorized,
        user: user?.name,
        currentPath,
        message: "Homepage accessible - NO REDIRECTS",
      });
      return; // Exit early, no redirects for homepage
    }

    // 1️⃣ Unauthorized user on protected route -> redirect to login
    if (isAuthorized === false && !isPublic && !isAuthPage) {
      console.log("🚫 REDIRECT TO LOGIN:", {
        currentPath,
        reason: "unauthorized user on protected route",
      });
      navigate("/login", { replace: true });
    }
    // 2️⃣ Authorized user visiting auth pages -> redirect to dashboard
    else if (isAuthorized === true && isAuthPage) {
      console.log("📋 REDIRECT TO DASHBOARD:", {
        currentPath,
        reason: "authorized user on auth page",
      });
      navigate("/dashboard", { replace: true });
    }
    // 3️⃣ Authorized user visiting other publicPaths -> Allow access
    // ✅ No redirect needed
  }, [isAuthorized, location.pathname, navigate]);

  return (
    <MobileLayout>
      {location.pathname !== "/" && <Navbar />}
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          width: "100%",
          padding: 0,
          // Add top padding when navbar is present
          ...(location.pathname !== "/" && {
            paddingTop: { xs: "48px", sm: "64px" }, // Space for fixed header
            paddingBottom: { xs: "0px", sm: "0px" }, // Space for mobile bottom nav
          }),
        }}
      >
        <ErrorBoundary>
          <Suspense
            fallback={
              <Box
                sx={{
                  height: "50vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress color="primary" size={32} />
                <p
                  style={{ color: "#666", marginTop: "12px", fontSize: "13px" }}
                >
                  Loading page...
                </p>
              </Box>
            }
          >
            {/* ✅ All your routes are still here */}
            <Routes>
              <Route path="/verified-agents" element={<VerifiedAgentsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route
                path="/dashboard/requirements"
                element={<DashboardRequirements />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-monitor" element={<HealthMonitor />} />
              <Route path="/blog/:id" element={<SingleBlog />} />
              <Route path="/job/getall" element={<Jobs />} />
              <Route path="/job/findworker" element={<BrowseWorker />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/application/:id" element={<Application />} />
              <Route path="/applications/me" element={<MyApplications />} />
              <Route path="/job/post" element={<PostJob />} />
              <Route path="/users/unveryfied" element={<Unveryfied />} />
              <Route path="/users/leads" element={<Leads />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />
              <Route path="/blogs" element={<BlogDisplay />} />
              <Route
                path="/job/requestworkers"
                element={<RequestWorkerForm />}
              />
              <Route path="/job/me" element={<MyJobs />} />
              <Route path="/my/profile" element={<MyProfile />} />
              <Route path="/payout" element={<Payout />} />
              <Route path="/adminPayout" element={<SuperAdminPayout />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route
                path="/payment/callback/success"
                element={<PaymentStatus />}
              />
              <Route path="/failure" element={<PaymentStatus />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/blogpost" element={<BlogPost />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/agent-benefits" element={<AgentBenefits />} />
              <Route
                path="/agreements/:id/sign"
                element={<EmployerSignAgreement />}
              />
              <Route
                path="/admin/agreements"
                element={<AdminAgreementsPage />}
              />
              <Route path="*" element={<NotFound />} />
              <Route path="/job/public/:jobId" element={<KycUpload />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Container>
      <Toaster />
    </MobileLayout>
  );
};

export default App;

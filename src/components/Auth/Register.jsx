import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import TermsAndConditions from "./TermsAndConditions";
import JobBanner from "./JobBanner";
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  Business,
  Person,
  Badge,
  Language,
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";
import { Context } from "../../main";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import config from "../../config";
import stateDistrictTehsil from "../../stateDistrict";

import {
  FormHelperText,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Container,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  AppBar,
  Toolbar,
  RadioGroup,
  Radio,
  FormLabel,
  Collapse,
} from "@mui/material"; // MUI Components

const Register = () => {
  const { t, i18n } = useTranslation(); // Access translation function
  const navigate = useNavigate(); // Get navigate function outside of event handler
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [step, setStep] = useState(1); // Only 2 steps now
  const [emailError, setEmailError] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [employerType, setEmployerType] = useState({
    // Employer types
    individual: false,
    contractor: false,
    agency: false,
    industry: false,
    // Agent types
    groupLabourSupplier: false,
    skilledLabourSupplier: false,
    unskilledLabourSupplier: false,
    contractLabourSupplier: false,
    // Job Seeker/SelfWorker types
    skilledWorker: false,
    unskilledWorker: false,
    domesticWorker: false,
    industrialWorker: false,
  });
  const [tehsil, setTehsil] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(60);
  const previousUserTypeRef = useRef("");

  useEffect(() => {
    let timer;
    if (cooldownTimer > 0 && isCooldown) {
      timer = setTimeout(() => setCooldownTimer((prev) => prev - 1), 1000);
    } else {
      setIsCooldown(false);
    }
    return () => clearTimeout(timer);
  }, [cooldownTimer, isCooldown]);
  useEffect(() => {
    i18n.changeLanguage("hi");
  }, []);

  // Note: Removed the useEffect that cleared checkboxes on role change
  // to prevent clearing when navigating between steps

  // Clear employer type only when actually switching between different user types (not when navigating steps)
  useEffect(() => {
    if (
      previousUserTypeRef.current &&
      previousUserTypeRef.current !== selectedUserType &&
      selectedUserType
    ) {
      setEmployerType({
        // Employer types
        individual: false,
        contractor: false,
        agency: false,
        industry: false,
        // Agent types
        groupLabourSupplier: false,
        skilledLabourSupplier: false,
        unskilledLabourSupplier: false,
        contractLabourSupplier: false,
        // Job Seeker/SelfWorker types
        skilledWorker: false,
        unskilledWorker: false,
        domesticWorker: false,
        industrialWorker: false,
      });
    }
    previousUserTypeRef.current = selectedUserType;
  }, [selectedUserType]);
  const handleCheckboxClick = (event) => {
    if (!accepted) {
      // Prevent checking until terms are shown
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleAccept = () => {
    setAccepted(true);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleStateChange = (e) => {
    setState(e.target.value);
    setDistrict("");
    setTehsil("");
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
    setTehsil("");
  };
  const handleTehsilChange = (e) => {
    setTehsil(e.target.value);
  };
  const handleOtpChange = async (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    if (value.length <= 6) {
      setEnteredOtp(value);

      if (value.length === 6) {
        try {
          const res = await fetch(
            `${config.API_BASE_URL}/api/v1/otp/verify-otp`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ phone, otp: value, role: "register" }),
            },
          );
          const data = await res.json();
          if (res.ok) {
            setIsOtpVerified(true);
            toast.success(t("phoneVerifiedSuccess"));
          } else {
            setIsOtpVerified(false);
            toast.error(data.message || t("otpVerificationFailed"));
          }
        } catch (error) {
          console.error("Error verifying OTP:", error);
          setIsOtpVerified(false);
          toast.error(t("errorVerifyingOTP"));
        }
      } else {
        setIsOtpVerified(false);
      }
    }
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return "";
    } else if (!emailRegex.test(value)) {
      return "Invalid email format";
    }
    return "";
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

const handleVerifyPhone = async () => {
  console.log("API:", config.API_BASE_URL);

  if (isCooldown) return;

  if (!phone || phone.length !== 10) {
    toast.error(t("enterValid10DigitPhone"));
    return;
  }

  if (!name) {
    toast.error(t("enterNameFirst"));
    return;
  }

  try {
    // STEP 1: Start session
    const sessionRes = await fetch(
      `${config.API_BASE_URL}/api/v1/session/start`
    );
    console.log(sessionRes);

    if (!sessionRes.ok) {
      throw new Error("Session start failed");
    }

    const { sessionToken } = await sessionRes.json();

    if (!sessionToken) {
      throw new Error("Session token missing");
    }

    // STEP 2: Send OTP
    const res = await fetch(
      `${config.API_BASE_URL}/api/v1/otp/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken,
        },
        body: JSON.stringify({
          phone,
          firstName: name,
          role: "register",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "OTP failed");
    }

    // STEP 3: SUCCESS ONLY
    setIsCooldown(true);
    setCooldownTimer(60);
    setShowOtpField(true);
    toast.success(t("otpSentSuccess"));

  } catch (error) {
    console.error("OTP Error:", error);
    setIsCooldown(false);
    toast.error(error.message || t("somethingWentWrong"));
  }
};


  const imageList = [
    "/8.jpg",
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
    "/7.jpg",
    "/8.jpg",
    "/9.jpg",
    "/10.jpg",
    "/11.jpg",
  ];
  const settings = {
    infinite: true,
    speed: 500, // Speed should not be 1; it’ll look broken
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
    dots: true,
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const isMatch = confirmPassword.length > 0 && confirmPassword === password;
  const isMismatch = confirmPassword.length > 0 && confirmPassword !== password;
  const [disabled, setDisabled] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !phone || !password || !confirmPassword) {
      toast.error(t("fillAllRequiredFields"));
      return;
    }

    if (phone.length !== 10) {
      toast.error(t("enterValid10DigitPhone"));
      return;
    }

    if (!isOtpVerified) {
      toast.error(t("verifyPhoneWithOTP"));
      return;
    }

    if (!state || !district || !tehsil) {
      toast.error(t("selectStateDistrictTehsil"));
      return;
    }

    // Check if at least one type is selected for any role
    if (!Object.values(employerType).some(Boolean)) {
      const roleTypeMap = {
        Employer: "employer type",
        Agent: "agent type",
        SelfWorker: "worker type",
      };
      toast.error(`Please select at least one ${roleTypeMap[role] || "type"}`);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("passwordsNotMatch"));
      return;
    }

    setDisabled(true);

    try {
      const payload = {
        name,
        phone,
        role,
        password,
        state,
        district,
        block: tehsil,
        referredBy,
      };

      // Include employerType for all roles if at least one type is selected
      if (Object.values(employerType).some(Boolean)) {
        payload.employerType = employerType;
      }

      if (email.trim() !== "") {
        payload.email = email;
      }

      const { data } = await axios.post(
        `${config.API_BASE_URL}/api/v1/user/register`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      toast.success(data.message || t("registrationSuccessful"));

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setRole("");
      setEmployerType({
        // Employer types
        individual: false,
        contractor: false,
        agency: false,
        industry: false,
        // Agent types
        groupLabourSupplier: false,
        skilledLabourSupplier: false,
        unskilledLabourSupplier: false,
        contractLabourSupplier: false,
        // Job Seeker/SelfWorker types
        skilledWorker: false,
        unskilledWorker: false,
        domesticWorker: false,
        industrialWorker: false,
      });
      setState("");
      setDistrict("");
      setTehsil("");
      setSelectedUserType("");

      navigate("/login");
    } catch (error) {
      setDisabled(false);
      toast.error(error?.response?.data?.message || t("registrationFailed"));
    }
  };
  useEffect(() => {
    if (isAuthorized && user) {
      navigate("/Dashboard"); // Redirect to home page if already authorized
    }
  }, [isAuthorized, navigate, user]);
  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
      // Note: Removed checkbox clearing to preserve user selections when navigating back
    }
  };
  const isAndroidWebView = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // Android WebView user agent usually contains "wv" or "; wv)"
    return (
      /Android/i.test(ua) && (/wv/.test(ua) || /Version\/\d+\.\d+/.test(ua))
    );
  };
  const isWebView = isAndroidWebView();

  useEffect(() => {
    if (!isWebView) {
      i18n.changeLanguage("en");
    }
  }, [isWebView, i18n]);
  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f5f5f5",
          mb: 4,
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}
        >
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Left side - BookMyWorker title with back button if on step 2 */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {step === 1 ? (
                <IconButton
                  onClick={() => navigate("/landing")}
                  sx={{ color: "#1976d2", mr: 1 }}
                >
                  <ArrowBack />
                </IconButton>
              ) : step === 2 ? (
                <IconButton
                  onClick={handleBackStep}
                  sx={{ color: "#1976d2", mr: 1 }}
                >
                  <ArrowBack />
                </IconButton>
              ) : null}
            </Box>

            {/* Right side - Language switcher */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {step === 1 && <LanguageSwitcher />}
              {step === 2 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Step 2/2
                  </Typography>
                  <LanguageSwitcher />
                </Box>
              )}
            </Box>
          </Toolbar>
        </AppBar>
<JobBanner isWebView={isWebView} />
        <Container
          maxWidth="sm"
          sx={{ flex: 1, display: "flex", flexDirection: "column", py: 1 }}
        >
       
          <form
            onSubmit={handleRegister}
              id="employerRegistrationForm"
            autoComplete="off"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            {step === 1 && (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  pt: 1,
                }}
              >
                {isWebView && (
                  <>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        mb: 1,
                        color: "#333",
                      }}
                    >
                      {t("selectRole")}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "center", mb: 1, color: "#666" }}
                    >
                      {t("chooseCategory")}
                    </Typography>
                  </>
                )}
                {isWebView && (
                  <>
                    {/* Job Seeker Card */}
                    <Card
                      onClick={() => setSelectedUserType("Job Seeker")}
                      sx={{
                        mb: 1,
                        p: 1,
                        cursor: "pointer",
                        bgcolor:
                          selectedUserType === "Job Seeker"
                            ? "#1976d2"
                            : "white",
                        borderRadius: 3,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                        border:
                          selectedUserType === "Job Seeker"
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                        "&:hover": {
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Badge
                          sx={{
                            fontSize: 40,
                            mr: 2,
                            color:
                              selectedUserType === "Job Seeker"
                                ? "#FF9800"
                                : "#1976d2", // Orange when selected, blue when not
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color:
                                selectedUserType === "Job Seeker"
                                  ? "white !important"
                                  : "#333 !important",
                              textShadow:
                                selectedUserType === "Job Seeker"
                                  ? "0 1px 2px rgba(0,0,0,0.3)"
                                  : "none",
                            }}
                          >
                            {t("jobSeeker")} ({t("individualWorker")})
                          </Typography>
                        </Box>
                      </Box>
                    </Card>

                    {/* Job Seeker Type Options */}
                    <Collapse
                      in={selectedUserType === "Job Seeker"}
                      timeout={500}
                    >
                      <Box
                        sx={{
                          mb: 3,
                          p: 1,
                          bgcolor: "rgba(25, 118, 210, 0.02)",
                          borderRadius: 3,
                          border: "1px solid rgba(25, 118, 210, 0.1)",
                          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.05)",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: "#1976d2",
                            fontSize: "1rem",
                            textAlign: "center",
                          }}
                        >
                          {t("selectOneOrMoreOptions")}
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 0.3,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={employerType.skilledWorker}
                                onChange={(e) =>
                                  setEmployerType((prev) => ({
                                    ...prev,
                                    skilledWorker: e.target.checked,
                                  }))
                                }
                                sx={{
                                  color: "#1976d2",
                                  "&.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label={t("skilledWorker")}
                            sx={{
                              bgcolor: employerType.skilledWorker
                                ? "rgba(25, 118, 210, 0.08)"
                                : "white",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: employerType.skilledWorker
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.04)",
                                borderColor: "#1976d2",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                              },
                              "& .MuiTypography-root": {
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: employerType.skilledWorker
                                  ? "#1976d2"
                                  : "#333",
                              },
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={employerType.unskilledWorker}
                                onChange={(e) =>
                                  setEmployerType((prev) => ({
                                    ...prev,
                                    unskilledWorker: e.target.checked,
                                  }))
                                }
                                sx={{
                                  color: "#1976d2",
                                  "&.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label={t("unskilledWorker")}
                            sx={{
                              bgcolor: employerType.unskilledWorker
                                ? "rgba(25, 118, 210, 0.08)"
                                : "white",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: employerType.unskilledWorker
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.04)",
                                borderColor: "#1976d2",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                              },
                              "& .MuiTypography-root": {
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: employerType.unskilledWorker
                                  ? "#1976d2"
                                  : "#333",
                              },
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={employerType.domesticWorker}
                                onChange={(e) =>
                                  setEmployerType((prev) => ({
                                    ...prev,
                                    domesticWorker: e.target.checked,
                                  }))
                                }
                                sx={{
                                  color: "#1976d2",
                                  "&.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label={t("domesticWorker")}
                            sx={{
                              bgcolor: employerType.domesticWorker
                                ? "rgba(25, 118, 210, 0.08)"
                                : "white",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: employerType.domesticWorker
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.04)",
                                borderColor: "#1976d2",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                              },
                              "& .MuiTypography-root": {
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: employerType.domesticWorker
                                  ? "#1976d2"
                                  : "#333",
                              },
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={employerType.industrialWorker}
                                onChange={(e) =>
                                  setEmployerType((prev) => ({
                                    ...prev,
                                    industrialWorker: e.target.checked,
                                  }))
                                }
                                sx={{
                                  color: "#1976d2",
                                  "&.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label={t("industrialWorker")}
                            sx={{
                              bgcolor: employerType.industrialWorker
                                ? "rgba(25, 118, 210, 0.08)"
                                : "white",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: employerType.industrialWorker
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.04)",
                                borderColor: "#1976d2",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                              },
                              "& .MuiTypography-root": {
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: employerType.industrialWorker
                                  ? "#1976d2"
                                  : "#333",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Collapse>

                    {/* Agent Card */}
                    <Card
                      onClick={() => setSelectedUserType("Agent")}
                      sx={{
                        mb: 1,
                        p: 1,
                        cursor: "pointer",
                        bgcolor:
                          selectedUserType === "Agent" ? "#1976d2" : "white",
                        borderRadius: 3,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                        border:
                          selectedUserType === "Agent"
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                        "&:hover": {
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Person
                          sx={{
                            fontSize: 40,
                            mr: 2,
                            color:
                              selectedUserType === "Agent"
                                ? "#4CAF50"
                                : "#1976d2", // Green when selected, blue when not
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color:
                              selectedUserType === "Agent"
                                ? "white !important"
                                : "#333 !important",
                            textShadow:
                              selectedUserType === "Agent"
                                ? "0 1px 2px rgba(0,0,0,0.3)"
                                : "none",
                          }}
                        >
                          {t("agent")}
                        </Typography>
                      </Box>
                    </Card>

                    {/* Agent Type Options */}
                    <Collapse in={selectedUserType === "Agent"} timeout={500}>
                      <Box
                        sx={{
                          mb: 3,
                          p: 1,
                          bgcolor: "rgba(25, 118, 210, 0.02)",
                          borderRadius: 3,
                          border: "1px solid rgba(25, 118, 210, 0.1)",
                          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.05)",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: "#1976d2",
                            fontSize: "1rem",
                            textAlign: "center",
                          }}
                        >
                          {t("selectOneOrMoreOptions")}
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 0.3,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={employerType.groupLabourSupplier}
                                onChange={(e) =>
                                  setEmployerType((prev) => ({
                                    ...prev,
                                    groupLabourSupplier: e.target.checked,
                                  }))
                                }
                                sx={{
                                  color: "#1976d2",
                                  "&.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label={t("groupLabourSupplier")}
                            sx={{
                              bgcolor: employerType.groupLabourSupplier
                                ? "rgba(25, 118, 210, 0.08)"
                                : "white",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: employerType.groupLabourSupplier
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.04)",
                                borderColor: "#1976d2",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                              },
                              "& .MuiTypography-root": {
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: employerType.groupLabourSupplier
                                  ? "#1976d2"
                                  : "#333",
                              },
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={employerType.skilledLabourSupplier}
                                onChange={(e) =>
                                  setEmployerType((prev) => ({
                                    ...prev,
                                    skilledLabourSupplier: e.target.checked,
                                  }))
                                }
                                sx={{
                                  color: "#1976d2",
                                  "&.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label={t("skilledLabourSupplier")}
                            sx={{
                              bgcolor: employerType.skilledLabourSupplier
                                ? "rgba(25, 118, 210, 0.08)"
                                : "white",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: employerType.skilledLabourSupplier
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.04)",
                                borderColor: "#1976d2",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                              },
                              "& .MuiTypography-root": {
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: employerType.skilledLabourSupplier
                                  ? "#1976d2"
                                  : "#333",
                              },
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={employerType.unskilledLabourSupplier}
                                onChange={(e) =>
                                  setEmployerType((prev) => ({
                                    ...prev,
                                    unskilledLabourSupplier: e.target.checked,
                                  }))
                                }
                                sx={{
                                  color: "#1976d2",
                                  "&.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label={t("unskilledLabourSupplier")}
                            sx={{
                              bgcolor: employerType.unskilledLabourSupplier
                                ? "rgba(25, 118, 210, 0.08)"
                                : "white",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: employerType.unskilledLabourSupplier
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.04)",
                                borderColor: "#1976d2",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                              },
                              "& .MuiTypography-root": {
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: employerType.unskilledLabourSupplier
                                  ? "#1976d2"
                                  : "#333",
                              },
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={employerType.contractLabourSupplier}
                                onChange={(e) =>
                                  setEmployerType((prev) => ({
                                    ...prev,
                                    contractLabourSupplier: e.target.checked,
                                  }))
                                }
                                sx={{
                                  color: "#1976d2",
                                  "&.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label={t("contractLabourSupplier")}
                            sx={{
                              bgcolor: employerType.contractLabourSupplier
                                ? "rgba(25, 118, 210, 0.08)"
                                : "white",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: employerType.contractLabourSupplier
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.04)",
                                borderColor: "#1976d2",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                              },
                              "& .MuiTypography-root": {
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: employerType.contractLabourSupplier
                                  ? "#1976d2"
                                  : "#333",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Collapse>
                  </>
                )}
                {/* Employer Card */}
                {!isWebView && (
                  <>
                    <Card
                      onClick={() => setSelectedUserType("Employer")}
                      sx={{
                        mb: 1,
                        p: 1,
                        cursor: "pointer",
                        bgcolor:
                          selectedUserType === "Employer" ? "#1976d2" : "white",
                        borderRadius: 3,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                        border:
                          selectedUserType === "Employer"
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                        "&:hover": {
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Business
                          sx={{
                            fontSize: 40,
                            mr: 2,
                            mt: 0.5,
                            color:
                              selectedUserType === "Employer"
                                ? "#FFD700"
                                : "#1976d2", // Gold when selected, blue when not
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color:
                                selectedUserType === "Employer"
                                  ? "white !important"
                                  : "#333 !important",
                              textShadow:
                                selectedUserType === "Employer"
                                  ? "0 1px 2px rgba(0,0,0,0.3)"
                                  : "none",
                            }}
                          >
                            {t("employerLabel")}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </>
                )}

                {/* Employer Type Options */}
                <Collapse in={selectedUserType === "Employer"} timeout={500}>
                  <Box
                    sx={{
                      mb: 3,
                      p: 1,
                      bgcolor: "rgba(25, 118, 210, 0.02)",
                      borderRadius: 3,
                      border: "1px solid rgba(25, 118, 210, 0.1)",
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.05)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        // mb: 2.5,
                        fontWeight: 600,
                        color: "#1976d2",
                        fontSize: "1rem",
                        textAlign: "center",
                      }}
                    >
                      {t("selectOneOrMoreOptions")}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 0.3,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={employerType.individual}
                            onChange={(e) =>
                              setEmployerType((prev) => ({
                                ...prev,
                                individual: e.target.checked,
                              }))
                            }
                            sx={{
                              color: "#1976d2",
                              "&.Mui-checked": {
                                color: "#1976d2",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 20,
                              },
                            }}
                          />
                        }
                        label={t("individual")}
                        sx={{
                          bgcolor: employerType.individual
                            ? "rgba(25, 118, 210, 0.08)"
                            : "white",
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          mx: 0,
                          border: employerType.individual
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "rgba(25, 118, 210, 0.04)",
                            borderColor: "#1976d2",
                            transform: "translateY(-1px)",
                            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                          },
                          "& .MuiTypography-root": {
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: employerType.individual ? "#1976d2" : "#333",
                          },
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={employerType.contractor}
                            onChange={(e) =>
                              setEmployerType((prev) => ({
                                ...prev,
                                contractor: e.target.checked,
                              }))
                            }
                            sx={{
                              color: "#1976d2",
                              "&.Mui-checked": {
                                color: "#1976d2",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 20,
                              },
                            }}
                          />
                        }
                        label={t("contractor")}
                        sx={{
                          bgcolor: employerType.contractor
                            ? "rgba(25, 118, 210, 0.08)"
                            : "white",
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          mx: 0,
                          border: employerType.contractor
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "rgba(25, 118, 210, 0.04)",
                            borderColor: "#1976d2",
                            transform: "translateY(-1px)",
                            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                          },
                          "& .MuiTypography-root": {
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: employerType.contractor ? "#1976d2" : "#333",
                          },
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={employerType.agency}
                            onChange={(e) =>
                              setEmployerType((prev) => ({
                                ...prev,
                                agency: e.target.checked,
                              }))
                            }
                            sx={{
                              color: "#1976d2",
                              "&.Mui-checked": {
                                color: "#1976d2",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 20,
                              },
                            }}
                          />
                        }
                        label={t("agency")}
                        sx={{
                          bgcolor: employerType.agency
                            ? "rgba(25, 118, 210, 0.08)"
                            : "white",
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          mx: 0,
                          border: employerType.agency
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "rgba(25, 118, 210, 0.04)",
                            borderColor: "#1976d2",
                            transform: "translateY(-1px)",
                            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                          },
                          "& .MuiTypography-root": {
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: employerType.agency ? "#1976d2" : "#333",
                          },
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={employerType.industry}
                            onChange={(e) =>
                              setEmployerType((prev) => ({
                                ...prev,
                                industry: e.target.checked,
                              }))
                            }
                            sx={{
                              color: "#1976d2",
                              "&.Mui-checked": {
                                color: "#1976d2",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 20,
                              },
                            }}
                          />
                        }
                        label={t("companyFactoryOwner")}
                        sx={{
                          bgcolor: employerType.industry
                            ? "rgba(25, 118, 210, 0.08)"
                            : "white",
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          mx: 0,
                          border: employerType.industry
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "rgba(25, 118, 210, 0.04)",
                            borderColor: "#1976d2",
                            transform: "translateY(-1px)",
                            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                          },
                          "& .MuiTypography-root": {
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: employerType.industry ? "#1976d2" : "#333",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Collapse>

                {/* Next Button */}
                <Button
                  onClick={() => {
                    if (!selectedUserType) {
                      toast.error(t("selectUserType"));
                      return;
                    }

                    // Check if at least one subcategory is selected
                    const hasSubcategorySelected =
                      Object.values(employerType).some(Boolean);
                    if (!hasSubcategorySelected) {
                      const roleTypeMap = {
                        Employer: t("employerSubcategoryRequired"),
                        Agent: t("agentSubcategoryRequired"),
                        "Job Seeker": t("workerSubcategoryRequired"),
                      };
                      toast.error(
                        roleTypeMap[selectedUserType] ||
                          t("subcategoryRequired"),
                      );
                      return;
                    }

                    setRole(
                      selectedUserType === "Job Seeker"
                        ? "SelfWorker"
                        : selectedUserType,
                    );
                    setStep(2);
                  }}
                  variant="contained"
                  fullWidth
                  sx={{
                    // py: 2,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    bgcolor: "#1976d2",
                    mb: 2,
                    "&:hover": {
                      bgcolor: "#1565c0",
                    },
                  }}
                >
                  {t("next")}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {t("alreadyHaveAccount")}{" "}
                    <Link
                      to="/login"
                      style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                      {t("login")}
                    </Link>
                  </Typography>
                </Box>

                {/* Support Contact */}
                <Box
                  sx={{
                    textAlign: "center",
                    mt: 4,
                    maxWidth: "320px",
                    mx: "auto",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      mb: 1.5,
                      lineHeight: 1.4,
                    }}
                  >
                    If you face any issues while using the application, feel
                    free to reach out:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "0.8rem",
                      lineHeight: 1.5,
                    }}
                  >
                    Phone:{" "}
                    <span style={{ color: "#1976d2", fontWeight: "bold" }}>
                      +91 7389791873
                    </span>
                    <br />
                    Email:{" "}
                    <span style={{ color: "#1976d2", fontWeight: "bold" }}>
                      support@bookmyworkers.com
                    </span>
                  </Typography>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box sx={{ flex: 1, py: 2 }}>
             <Typography
  variant="h4"
  sx={{
    fontWeight: "bold",
    textAlign: "center",
    mb: 1,
    color: "#333",
    fontSize: "1.6rem", // ⬅️ slightly smaller than default h4
  }}
>
  {t("enterYourDetails")}
</Typography>

                <Typography
                  variant="body1"
                  sx={{ textAlign: "center", mb: 2, color: "#666" }}
                >
                  {t("fillBasicInfo")}
                </Typography>

                {/* Full Name */}
                <TextField
                  label={t("name")}
                  type="text"
                  size="small"
                  placeholder={t("enterName")}
                  value={name}
                  onChange={(e) => {
                    const input = e.target.value;
                    const cleanedInput = input.replace(/[^\p{L}\s.'’-]/gu, "");
                    setName(cleanedInput);
                  }}
                  fullWidth
                  variant="outlined"
                  required
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />

                {/* Mobile Number */}
                <Box sx={{ position: "relative", mb: 1 }}>
                  <TextField
                    label={t("phone")}
                    type="tel"
                    size="small"
                    placeholder={t("enterPhone")}
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      if (value.length <= 10) {
                        setPhone(value);
                        if (showOtpField && value.length !== 10) {
                          setShowOtpField(false);
                          setIsOtpVerified(false);
                          setEnteredOtp("");
                        }
                      }
                    }}
                    fullWidth
                    variant="outlined"
                    required
                    error={showOtpField && !isOtpVerified}
                    helperText={
                      showOtpField && !isOtpVerified
                        ? t("verifyPhoneNumber")
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <Button
                          onClick={handleVerifyPhone}
                          disabled={
                            !phone ||
                            phone.length !== 10 ||
                            isCooldown ||
                            isOtpVerified
                          }
                          size="small"
                          sx={{
                            minWidth: "auto",
                            px: 1,
                            fontSize: "0.8rem",
                            color: isOtpVerified ? "#4caf50" : "#1976d2",
                          }}
                        >
                          {isOtpVerified
                            ? `✓ ${t("verified")}`
                            : isCooldown
                              ? `${cooldownTimer}s`
                              : t("verify")}
                        </Button>
                      ),
                    }}
                  />
                </Box>

                {/* OTP Field */}
                {showOtpField && (
                  <TextField
                    label={t("enterOTP")}
                    type="tel"
                    size="small"
                    placeholder={t("enter6DigitOTP")}
                    value={enteredOtp}
                    onChange={handleOtpChange}
                    fullWidth
                    variant="outlined"
                    required
                    inputProps={{ maxLength: 6 }}
                    error={enteredOtp.length === 6 && !isOtpVerified}
                    helperText={
                      enteredOtp.length === 6 && !isOtpVerified
                        ? t("invalidOTP")
                        : isOtpVerified
                          ? t("phoneVerifiedSuccess")
                          : t("enterOTPSentToPhone")
                    }
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  />
                )}

                {/* Email Address - Only show for Employer role */}
                {role === "Employer" && (
                  <TextField
                    label={t("email")}
                    type="email"
                    size="small"
                    placeholder={t("enterEmail")}
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    variant="outlined"
                    error={!!emailError}
                    helperText={emailError}
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  />
                )}

                {/* State Dropdown */}
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <InputLabel>{t("state")}</InputLabel>
                  <Select
                    value={state}
                    size="small"
                    onChange={handleStateChange}
                    required
                    label={t("state")}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <MenuItem value="">{t("selectState")}</MenuItem>
                    {Object.keys(stateDistrictTehsil).map((stateName) => (
                      <MenuItem key={stateName} value={stateName}>
                        {stateName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* City/District Dropdown */}
                <FormControl fullWidth sx={{ mb: 1 }} disabled={!state}>
                  <InputLabel>{t("cityDistrict")}</InputLabel>
                  <Select
                    value={district}
                    size="small"
                    onChange={handleDistrictChange}
                    required
                    label={t("cityDistrict")}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <MenuItem value="">{t("selectDistrict")}</MenuItem>
                    {state &&
                      Object.keys(stateDistrictTehsil[state] || {}).map(
                        (districtName) => (
                          <MenuItem key={districtName} value={districtName}>
                            {districtName}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                </FormControl>

                {/* Tehsil/Taluka */}
                <FormControl fullWidth sx={{ mb: 1 }} disabled={!district}>
                  <InputLabel>{t("tahsilTaluka")}</InputLabel>
                  <Select
                  size="small"
                    value={tehsil}
                    onChange={handleTehsilChange}
                    required
                    label={t("tahsilTaluka")}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <MenuItem value="">{t("selectTehsil")}</MenuItem>
                    {state &&
                      district &&
                      (stateDistrictTehsil[state]?.[district] || []).map(
                        (tehsilName) => (
                          <MenuItem key={tehsilName} value={tehsilName}>
                            {tehsilName}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                </FormControl>

                {/* Password */}
                <TextField
                  label={t("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("enterPassword")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />

                {/* Confirm Password */}
                <TextField
                  label={t("confirmPassword")}
                  type="password"
                  size="small"
                  placeholder={t("confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                  error={
                    confirmPassword.length > 0 && confirmPassword !== password
                  }
                  helperText={
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? t("passwordsNotMatch")
                      : ""
                  }
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
                {/* Referred By */}
                <TextField
                  label={t("referredBy")}
                  type="text"
                  size="small"
                  placeholder={t("enter10DigitMobile")}
                  value={referredBy}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setReferredBy(val);
                  }}
                  fullWidth
                  variant="outlined"
                  inputProps={{ maxLength: 10 }}
                  error={referredBy.length > 0 && referredBy.length !== 10}
                  helperText={
                    referredBy.length > 0 && referredBy.length !== 10
                      ? t("enterValid10DigitPhone")
                      : ""
                  }
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />

                {/* Register Button */}
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  fullWidth
                  disabled={
                    !name ||
                    !phone ||
                    !password ||
                    !confirmPassword ||
                    password !== confirmPassword
                  }
                  sx={{
                    // py: 2,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    bgcolor: "#1976d2",
                    // mb: 3,
                    "&:hover": {
                      bgcolor: "#1565c0",
                    },
                    "&:disabled": {
                      bgcolor: "#ccc",
                    },
                  }}
                >
                  {t("registerNow")}
                </Button>

                {/* Already have account */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {t("alreadyHaveAccount")}{" "}
                    <Link
                      to="/login"
                      style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                      {t("login")}
                    </Link>
                  </Typography>
                </Box>

                {/* Terms and Privacy */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "#999" }}>
                    {t("byRegistering")}{" "}
                    <span
                      style={{
                        color: "#1976d2",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => setOpen(true)}
                    >
                      {t("termsPrivacyPolicy")}
                    </span>
                  </Typography>
                </Box>
              </Box>
            )}
          </form>
          {/* Loader Overlay */}
          {disabled && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderRadius: "8px",
                zIndex: 10,
              }}
            >
              <CircularProgress color="primary" size={50} thickness={4} />
            </Box>
          )}
          {/* Terms and Conditions Dialog */}
          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogContent>
              <TermsAndConditions role={role} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="inherit">
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                variant="contained"
                color="primary"
              >
                Accept
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default Register;

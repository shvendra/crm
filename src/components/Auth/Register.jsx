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

   const createLead = async ({ role, name, phone }) => {
  try {
    const res = await fetch(`${config.API_BASE_URL}/api/v1/user/lead-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        name,
        phone,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Lead registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
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
    await createLead({
  role: selectedUserType || "Unknown",
  name,
  phone,
});
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

  const authFieldSx = {
  mb: 1.5,
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fafafa",
minHeight: { xs: 46, md: 48 },
    "& fieldset": {
      borderColor: "#d9dee7",
    },
    "&:hover fieldset": {
      borderColor: "#b8c0cc",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2bb7bb",
      borderWidth: "1px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#98a2b3",
  },
};

const authSelectSx = {
  borderRadius: "10px",
  backgroundColor: "#fafafa",
  minHeight: 48,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d9dee7",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#b8c0cc",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2bb7bb",
    borderWidth: "1px",
  },
};

const roleCardSx = (selected, accent = "#2bb7bb") => ({
  mb: 1,
  p: 1.4,
  cursor: "pointer",
  bgcolor: selected ? "#f0fbfb" : "#fff",
  borderRadius: "12px",
  boxShadow: "none",
  border: selected ? `1px solid ${accent}` : "1px solid #e6eaf0",
  transition: "all 0.25s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 8px 24px rgba(16,24,40,0.08)",
    borderColor: accent,
  },
});
return (
  <>
  <Box
  sx={{
    // minHeight: "100vh",
    width: "100%",
    // bgcolor: { xs: "#fff", md: "#f2f4f7" },
    display: "flex",
    flexDirection: "column", // important
    alignItems: "center",
    justifyContent: { xs: "flex-start", md: "center" },
    px: { xs: 0, md: 2 },
    py: { xs: 0, md: 1 },
  }}
>
<Box
  sx={{
    width: "100%",
    maxWidth: "1400px",
    mx: "auto",
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: { xs: "stretch", md: "stretch" },
    justifyContent: "center",
    gap: { xs: 0, md: 2, lg: 3 },
    px: { xs: 0, md: 2, lg: 3 },
  }}
>


<Box
  sx={{
    display: { xs: "none", md: "flex" },
    flex: { md: 1, xl: 1 },
    maxWidth: { md: 420, lg: 520, xl: 760 },
    minHeight: { md: "auto", lg: "80vh" },
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Box
    sx={{
      width: "100%",
      borderRadius: { md: "16px", xl: "20px" },
      overflow: "hidden",
      boxShadow: "0 16px 50px rgba(16,24,40,0.10)",
      bgcolor: "#fff",
    }}
  >
    <JobBanner isWebView={isWebView} />
  </Box>
</Box>

  {/* Right Form */}
<Container
  maxWidth="sm"
  disableGutters
  sx={{
    display: "flex",
    mt: 0,
    flexShrink: 0,
    ml: 0,
    mr: 0,
    width: { xs: "100%", md: "fit-content" },
    maxWidth: "none",
  }}
>
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", md: 460 },
        bgcolor: "#fff",
        borderRadius: { xs: 0, md: "14px" },
        boxShadow: { xs: "none", md: "0 10px 40px rgba(16,24,40,0.08)" },
        px: { xs: 2, sm: 3.5 },
        py: { xs: 2.5, sm: 3.5 },
        minHeight: {  md: "auto" },
        position: "relative",
      }}
    >
          {/* top utility row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {step === 1 ? (
                <IconButton
                  onClick={() => navigate("/landing")}
                  sx={{ color: "#344054", p: 0.8 }}
                >
                  <ArrowBack />
                </IconButton>
              ) : step === 2 ? (
                <IconButton
                  onClick={handleBackStep}
                  sx={{ color: "#344054", p: 0.8 }}
                >
                  <ArrowBack />
                </IconButton>
              ) : null}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {step === 2 && (
                <Typography sx={{ fontSize: 12, color: "#667085", fontWeight: 600 }}>
                  Step 2/2
                </Typography>
              )}
              <LanguageSwitcher />
            </Box>
          </Box>

          {/* logo / brand */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              component="img"
              src="/app/logo.svg"
              alt="BookMyWorker"
              sx={{
                height: 56,
                objectFit: "contain",
                mx: "auto",
                mb: 1.2,
              }}
            />
            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 800,
                color: "#101828",
                lineHeight: 1.2,
              }}
            >
              {step === 1 ? t("selectRole") : t("enterYourDetails")}
            </Typography>
            <Typography
              sx={{
                mt: 0.8,
                fontSize: 14,
                color: "#667085",
                maxWidth: 340,
                mx: "auto",
              }}
            >
              {step === 1 ? t("chooseCategory") : t("fillBasicInfo")}
            </Typography>
          </Box>
{isWebView && (
  <Box
    sx={{
      mb: 2.5,
      px: 2,
      py: 1.5,
      borderRadius: "12px",
      border: "1px solid #d5e3ff",
      bgcolor: "#f5f9ff",
      boxShadow: "0 4px 14px rgba(25,118,210,0.08)",
    }}
  >
    <Typography
      sx={{
        fontSize: "0.92rem",
        fontWeight: 700,
        color: "#1976d2",
        mb: 0.8,
      }}
    >
      Important Note
    </Typography>

    <Typography
      sx={{
        fontSize: "0.88rem",
        lineHeight: 1.7,
        color: "#344054",
      }}
    >
      This app is mainly for{" "}
      <Box component="span" sx={{ fontWeight: 700 }}>
        Agents
      </Box>{" "}
      and{" "}
      <Box component="span" sx={{ fontWeight: 700 }}>
        Self Workers
      </Box>
      .
      <br />
      If you are an{" "}
      <Box component="span" sx={{ fontWeight: 700 }}>
        Employer
      </Box>{" "}
      and want to hire workers, please visit{" "}
    <Box
  component="a"
  href="https://bookmyworkers.com"
  target="_blank"
  rel="noopener noreferrer"
  sx={{
    fontWeight: 700,
    color: "#1976d2",
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  }}
>
  bookmyworkers.com
</Box>{" "}
      and search for workers near your location.
    </Typography>
  </Box>
)}

          <form
            onSubmit={handleRegister}
            id="employerRegistrationForm"
            autoComplete="off"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {step === 1 && (
<Box
  sx={{
    width: "100%",
    maxWidth: { xs: "100%", md: 460 },
    bgcolor: "#fff",
    borderRadius: { xs: 0, md: "14px" },
    px: { xs: 0, sm: 0, md: 0 },
    py: { xs: 0, sm: 0, md: 0 },
    minHeight: { xs: "auto", md: "auto" },
    position: "relative",
  }}
>
                {isWebView && (
                  <>
                    <Card
                      onClick={() => setSelectedUserType("Job Seeker")}
                      sx={roleCardSx(selectedUserType === "Job Seeker")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Badge
                          sx={{
                            fontSize: 34,
                            mr: 1.5,
                            color:
                              selectedUserType === "Job Seeker"
                                ? "#2bb7bb"
                                : "#475467",
                          }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: "1rem",
                              color: "#101828",
                            }}
                          >
                            {t("jobSeeker")} ({t("individualWorker")})
                          </Typography>
                        </Box>
                      </Box>
                    </Card>

                    <Collapse in={selectedUserType === "Job Seeker"} timeout={300}>
                      <Box
                        sx={{
                          mb: 2,
                          p: 1.2,
                          borderRadius: "12px",
                          bgcolor: "#fcfcfd",
                          border: "1px solid #eaecf0",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#344054",
                            fontSize: "0.92rem",
                            textAlign: "center",
                            mb: 1,
                          }}
                        >
                          {t("selectOneOrMoreOptions")}
                        </Typography>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 0.8,
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
                                  color: "#2bb7bb",
                                  "&.Mui-checked": { color: "#2bb7bb" },
                                }}
                              />
                            }
                            label={t("skilledWorker")}
                            sx={{
                              m: 0,
                              px: 1.2,
                              py: 0.5,
                              borderRadius: "10px",
                              border: employerType.skilledWorker
                                ? "1px solid #2bb7bb"
                                : "1px solid #eaecf0",
                              bgcolor: employerType.skilledWorker ? "#f0fbfb" : "#fff",
                              "& .MuiTypography-root": {
                                fontSize: "0.9rem",
                                fontWeight: 500,
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
                                  color: "#2bb7bb",
                                  "&.Mui-checked": { color: "#2bb7bb" },
                                }}
                              />
                            }
                            label={t("unskilledWorker")}
                            sx={{
                              m: 0,
                              px: 1.2,
                              py: 0.5,
                              borderRadius: "10px",
                              border: employerType.unskilledWorker
                                ? "1px solid #2bb7bb"
                                : "1px solid #eaecf0",
                              bgcolor: employerType.unskilledWorker ? "#f0fbfb" : "#fff",
                              "& .MuiTypography-root": {
                                fontSize: "0.9rem",
                                fontWeight: 500,
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
                                  color: "#2bb7bb",
                                  "&.Mui-checked": { color: "#2bb7bb" },
                                }}
                              />
                            }
                            label={t("domesticWorker")}
                            sx={{
                              m: 0,
                              px: 1.2,
                              py: 0.5,
                              borderRadius: "10px",
                              border: employerType.domesticWorker
                                ? "1px solid #2bb7bb"
                                : "1px solid #eaecf0",
                              bgcolor: employerType.domesticWorker ? "#f0fbfb" : "#fff",
                              "& .MuiTypography-root": {
                                fontSize: "0.9rem",
                                fontWeight: 500,
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
                                  color: "#2bb7bb",
                                  "&.Mui-checked": { color: "#2bb7bb" },
                                }}
                              />
                            }
                            label={t("industrialWorker")}
                            sx={{
                              m: 0,
                              px: 1.2,
                              py: 0.5,
                              borderRadius: "10px",
                              border: employerType.industrialWorker
                                ? "1px solid #2bb7bb"
                                : "1px solid #eaecf0",
                              bgcolor: employerType.industrialWorker ? "#f0fbfb" : "#fff",
                              "& .MuiTypography-root": {
                                fontSize: "0.9rem",
                                fontWeight: 500,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Collapse>

                    <Card
                      onClick={() => setSelectedUserType("Agent")}
                      sx={roleCardSx(selectedUserType === "Agent")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Person
                          sx={{
                            fontSize: 34,
                            mr: 1.5,
                            color: selectedUserType === "Agent" ? "#2bb7bb" : "#475467",
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#101828",
                          }}
                        >
                          {t("agent")}
                        </Typography>
                      </Box>
                    </Card>

                    <Collapse in={selectedUserType === "Agent"} timeout={300}>
                      <Box
                        sx={{
                          mb: 2,
                          p: 1.2,
                          borderRadius: "12px",
                          bgcolor: "#fcfcfd",
                          border: "1px solid #eaecf0",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#344054",
                            fontSize: "0.92rem",
                            textAlign: "center",
                            mb: 1,
                          }}
                        >
                          {t("selectOneOrMoreOptions")}
                        </Typography>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 0.8,
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
                                  color: "#2bb7bb",
                                  "&.Mui-checked": { color: "#2bb7bb" },
                                }}
                              />
                            }
                            label={t("groupLabourSupplier")}
                            sx={{
                              m: 0,
                              px: 1.2,
                              py: 0.5,
                              borderRadius: "10px",
                              border: employerType.groupLabourSupplier
                                ? "1px solid #2bb7bb"
                                : "1px solid #eaecf0",
                              bgcolor: employerType.groupLabourSupplier ? "#f0fbfb" : "#fff",
                              "& .MuiTypography-root": {
                                fontSize: "0.9rem",
                                fontWeight: 500,
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
                                  color: "#2bb7bb",
                                  "&.Mui-checked": { color: "#2bb7bb" },
                                }}
                              />
                            }
                            label={t("skilledLabourSupplier")}
                            sx={{
                              m: 0,
                              px: 1.2,
                              py: 0.5,
                              borderRadius: "10px",
                              border: employerType.skilledLabourSupplier
                                ? "1px solid #2bb7bb"
                                : "1px solid #eaecf0",
                              bgcolor: employerType.skilledLabourSupplier ? "#f0fbfb" : "#fff",
                              "& .MuiTypography-root": {
                                fontSize: "0.9rem",
                                fontWeight: 500,
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
                                  color: "#2bb7bb",
                                  "&.Mui-checked": { color: "#2bb7bb" },
                                }}
                              />
                            }
                            label={t("unskilledLabourSupplier")}
                            sx={{
                              m: 0,
                              px: 1.2,
                              py: 0.5,
                              borderRadius: "10px",
                              border: employerType.unskilledLabourSupplier
                                ? "1px solid #2bb7bb"
                                : "1px solid #eaecf0",
                              bgcolor: employerType.unskilledLabourSupplier ? "#f0fbfb" : "#fff",
                              "& .MuiTypography-root": {
                                fontSize: "0.9rem",
                                fontWeight: 500,
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
                                  color: "#2bb7bb",
                                  "&.Mui-checked": { color: "#2bb7bb" },
                                }}
                              />
                            }
                            label={t("contractLabourSupplier")}
                            sx={{
                              m: 0,
                              px: 1.2,
                              py: 0.5,
                              borderRadius: "10px",
                              border: employerType.contractLabourSupplier
                                ? "1px solid #2bb7bb"
                                : "1px solid #eaecf0",
                              bgcolor: employerType.contractLabourSupplier ? "#f0fbfb" : "#fff",
                              "& .MuiTypography-root": {
                                fontSize: "0.9rem",
                                fontWeight: 500,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Collapse>
                  </>
                )}

                {!isWebView && (
                  <>
                    <Card
                      onClick={() => setSelectedUserType("Employer")}
                      sx={roleCardSx(selectedUserType === "Employer")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Business
                          sx={{
                            fontSize: 34,
                            mr: 1.5,
                            color:
                              selectedUserType === "Employer" ? "#2bb7bb" : "#475467",
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#101828",
                          }}
                        >
                          {t("employerLabel")}
                        </Typography>
                      </Box>
                    </Card>
                  </>
                )}

                <Collapse in={selectedUserType === "Employer"} timeout={300}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 1.2,
                      borderRadius: "12px",
                      bgcolor: "#fcfcfd",
                      border: "1px solid #eaecf0",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#344054",
                        fontSize: "0.92rem",
                        textAlign: "center",
                        mb: 1,
                      }}
                    >
                      {t("selectOneOrMoreOptions")}
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 0.8,
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
                              color: "#2bb7bb",
                              "&.Mui-checked": { color: "#2bb7bb" },
                            }}
                          />
                        }
                        label={t("individual")}
                        sx={{
                          m: 0,
                          px: 1.2,
                          py: 0.5,
                          borderRadius: "10px",
                          border: employerType.individual
                            ? "1px solid #2bb7bb"
                            : "1px solid #eaecf0",
                          bgcolor: employerType.individual ? "#f0fbfb" : "#fff",
                          "& .MuiTypography-root": {
                            fontSize: "0.9rem",
                            fontWeight: 500,
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
                              color: "#2bb7bb",
                              "&.Mui-checked": { color: "#2bb7bb" },
                            }}
                          />
                        }
                        label={t("contractor")}
                        sx={{
                          m: 0,
                          px: 1.2,
                          py: 0.5,
                          borderRadius: "10px",
                          border: employerType.contractor
                            ? "1px solid #2bb7bb"
                            : "1px solid #eaecf0",
                          bgcolor: employerType.contractor ? "#f0fbfb" : "#fff",
                          "& .MuiTypography-root": {
                            fontSize: "0.9rem",
                            fontWeight: 500,
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
                              color: "#2bb7bb",
                              "&.Mui-checked": { color: "#2bb7bb" },
                            }}
                          />
                        }
                        label={t("agency")}
                        sx={{
                          m: 0,
                          px: 1.2,
                          py: 0.5,
                          borderRadius: "10px",
                          border: employerType.agency
                            ? "1px solid #2bb7bb"
                            : "1px solid #eaecf0",
                          bgcolor: employerType.agency ? "#f0fbfb" : "#fff",
                          "& .MuiTypography-root": {
                            fontSize: "0.9rem",
                            fontWeight: 500,
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
                              color: "#2bb7bb",
                              "&.Mui-checked": { color: "#2bb7bb" },
                            }}
                          />
                        }
                        label={t("companyFactoryOwner")}
                        sx={{
                          m: 0,
                          px: 1.2,
                          py: 0.5,
                          borderRadius: "10px",
                          border: employerType.industry
                            ? "1px solid #2bb7bb"
                            : "1px solid #eaecf0",
                          bgcolor: employerType.industry ? "#f0fbfb" : "#fff",
                          "& .MuiTypography-root": {
                            fontSize: "0.9rem",
                            fontWeight: 500,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Collapse>

                <Button
                  onClick={() => {
                    if (!selectedUserType) {
                      toast.error(t("selectUserType"));
                      return;
                    }

                    const hasSubcategorySelected =
                      Object.values(employerType).some(Boolean);

                    if (!hasSubcategorySelected) {
                      const roleTypeMap = {
                        Employer: t("employerSubcategoryRequired"),
                        Agent: t("agentSubcategoryRequired"),
                        "Job Seeker": t("workerSubcategoryRequired"),
                      };
                      toast.error(
                        roleTypeMap[selectedUserType] || t("subcategoryRequired")
                      );
                      return;
                    }

                    setRole(
                      selectedUserType === "Job Seeker"
                        ? "SelfWorker"
                        : selectedUserType
                    );
                    setStep(2);
                  }}
                  variant="contained"
                  fullWidth
               sx={{
  height: 48,
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: 700,
  textTransform: "none",
  bgcolor: "#2bb7bb",
}}
                >
                  {t("next")}
                </Button>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography sx={{ color: "#475467", fontSize: 14 }}>
                    {t("alreadyHaveAccount")}{" "}
                    <Link
                      to="/login"
                      style={{
                        color: "#101828",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      {t("login")}
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography
                    sx={{
                      color: "#667085",
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                    }}
                  >
                    Phone:{" "}
                    <span style={{ color: "#2bb7bb", fontWeight: 700 }}>
                      +91 7389791873
                    </span>
                    <br />
                    Email:{" "}
                    <span style={{ color: "#2bb7bb", fontWeight: 700 }}>
                      support@bookmyworkers.com
                    </span>
                  </Typography>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box>
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
                  sx={authFieldSx}
                />

                <Box sx={{ position: "relative", mb: 1.5 }}>
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
                      showOtpField && !isOtpVerified ? t("verifyPhoneNumber") : ""
                    }
                    sx={authFieldSx}
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
                            px: 1.2,
                            fontSize: "0.8rem",
                            color: isOtpVerified ? "#12b76a" : "#2bb7bb",
                            fontWeight: 700,
                            textTransform: "none",
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
                    sx={authFieldSx}
                  />
                )}

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
                    sx={authFieldSx}
                  />
                )}

                <FormControl fullWidth sx={{ mb: 1.5 }}>
                  <InputLabel>{t("state")}</InputLabel>
                  <Select
                    value={state}
                    size="small"
                    onChange={handleStateChange}
                    required
                    label={t("state")}
                    sx={authSelectSx}
                  >
                    <MenuItem value="">{t("selectState")}</MenuItem>
                    {Object.keys(stateDistrictTehsil).map((stateName) => (
                      <MenuItem key={stateName} value={stateName}>
                        {stateName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 1.5 }} disabled={!state}>
                  <InputLabel>{t("cityDistrict")}</InputLabel>
                  <Select
                    value={district}
                    size="small"
                    onChange={handleDistrictChange}
                    required
                    label={t("cityDistrict")}
                    sx={authSelectSx}
                  >
                    <MenuItem value="">{t("selectDistrict")}</MenuItem>
                    {state &&
                      Object.keys(stateDistrictTehsil[state] || {}).map(
                        (districtName) => (
                          <MenuItem key={districtName} value={districtName}>
                            {districtName}
                          </MenuItem>
                        )
                      )}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 1.5 }} disabled={!district}>
                  <InputLabel>{t("tahsilTaluka")}</InputLabel>
                  <Select
                    size="small"
                    value={tehsil}
                    onChange={handleTehsilChange}
                    required
                    label={t("tahsilTaluka")}
                    sx={authSelectSx}
                  >
                    <MenuItem value="">{t("selectTehsil")}</MenuItem>
                    {state &&
                      district &&
                      (stateDistrictTehsil[state]?.[district] || []).map(
                        (tehsilName) => (
                          <MenuItem key={tehsilName} value={tehsilName}>
                            {tehsilName}
                          </MenuItem>
                        )
                      )}
                  </Select>
                </FormControl>

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
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={authFieldSx}
                />

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
                  sx={authFieldSx}
                />

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
                  sx={{ ...authFieldSx, mb: 2 }}
                />

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
                    height: 46,
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "#2bb7bb",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#24a3a7",
                      boxShadow: "none",
                    },
                    "&:disabled": {
                      bgcolor: "#d0d5dd",
                      color: "#fff",
                    },
                  }}
                >
                  {t("registerNow")}
                </Button>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography sx={{ color: "#475467", fontSize: 14 }}>
                    {t("alreadyHaveAccount")}{" "}
                    <Link
                      to="/login"
                      style={{
                        color: "#101828",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      {t("login")}
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography sx={{ color: "#667085", fontSize: 12 }}>
                    {t("byRegistering")}{" "}
                    <span
                      style={{
                        color: "#2bb7bb",
                        cursor: "pointer",
                        fontWeight: 600,
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

          {disabled && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(255,255,255,0.55)",
                borderRadius: "14px",
                zIndex: 10,
              }}
            >
              <CircularProgress color="primary" size={46} thickness={4} />
            </Box>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogContent>
              <TermsAndConditions role={role} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="inherit">
                Decline
              </Button>
              <Button onClick={handleAccept} variant="contained" color="primary">
                Accept
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
      </Box>
    </Box>
  </>
);
};

export default Register;

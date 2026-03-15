import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';

import {
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  CircularProgress,
  Button, Typography, IconButton, TextField
} from "@mui/material";
import axios from "axios";
import qs from "qs";
import config from "../../config";
import { useTranslation } from "react-i18next";
import { Context } from '../../main'; // Assuming Context provides setUser
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AboutWorkSection from "./AboutWorkSection";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PlaceIcon from "@mui/icons-material/Place";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PathLocationModal from "./pathLocationModel"; // Make sure path/case is correct
import ContactButtons from "./ContactButtons";
import GroupsIcon from "@mui/icons-material/Groups";
// 🔹 import all sub-components you already use
import InviteForWorkHeader from "./InviteForWorkHeader";
// import AboutWorkSection, helpers, icons etc...

const DashboardRequirements = () => {
  const [currentReq, setCurrentReq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requirementsLoading, setRequirementsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { t, i18n } = useTranslation();
  const { user } = useContext(Context);
  const [interestedMap, setInterestedMap] = useState({});
  const [wagesMap, setWagesMap] = useState({});
  const wageInputRefs = useRef({});
  const wageValidationTimeouts = useRef({});
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const searchTimeout = useRef(null);
  const currentLang = i18n.language || "en";
    const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const handleLocationClick = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setModalOpen(true);
  };
  const getPerHeadWages = (stream, wage, assignedAgentId) => {
    const agentMatch = stream?.intrestedAgents?.find(
      (agent) => agent.agentId === assignedAgentId
    );
    return agentMatch?.agentRequiredWage ?? wage;
  };
    const getUserWage = (stream, userId) => {
    const agentEntry = stream.intrestedAgents?.find(
      (agent) => agent?.agentId?.toString?.() === userId?.toString()
    );
    return agentEntry?.agentRequiredWage || "";
  };
    const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    fetchRequirements(nextPage, true, limits);
  };
    const hasUserShownInterest = (stream, userId) => {
    return stream.intrestedAgents?.some(
      (agent) => agent?.agentId?.toString?.() === userId?.toString()
    );
  };

    const handleWagesChange = (streamId, value, minwage) => {
      // ✅ Always update wages immediately
      setWagesMap((prev) => ({
        ...prev,
        [streamId]: value,
      }));
  
      // ⏱️ Debounced validation
      if (wageValidationTimeouts.current[streamId]) {
        clearTimeout(wageValidationTimeouts.current[streamId]);
      }
  
      wageValidationTimeouts.current[streamId] = setTimeout(() => {
        if (value < minwage) {
          toast.error(t("wageTooLow", { minwage }));
        }
      }, 800); // 800ms debounce
    };
    const handleExpressInterest = async (req_id, wage, minwage) => {
      try {
        if (user?.status === "Unverified") {
          toast.error(
            `${t("kycNotVerifiedMessage")} ${t("kycVerificationInstructions")}`
          );
          // wageInputRefs.current[req_id]?.focus();
          return;
        }
        if (!wage) {
          toast.error(`${t("pleaseEnterWage")}`);
          wageInputRefs.current[req_id]?.focus();
          return;
        }
        if (wage < minwage) {
          toast.error(t("wageTooLow", { minwage }));
          return;
        }
        const res = await axios.post(
          `${config.API_BASE_URL}/api/v1/application/${req_id}/express-interest`,
          { wage }, // send user's input wage
          { withCredentials: true }
        );
        if (res.data.success) {
          setInterestedMap((prev) => ({ ...prev, [req_id]: true }));
        }
        toast.success(res.data.message);
      } catch (err) {
        toast.error("Error expressing interest", err);
      }
    };
    const fetchRequirements = async (
  page = 1,
  append = false,
  limit = 20,
  search = ""
) => {
  try {
    if (append) {
      setLoadingMore(true);
    } else {
      setInitialLoading(true);
    }

    let url = `${config.API_BASE_URL}/api/v1/application`;
    let params = { page, limit };

    if (user?.role === "Employer") {
      params.employerId = user._id;
    } else if (user?.role === "Agent" || user?.role === "SelfWorker") {
      let serviceArea = Array.isArray(user.serviceArea)
        ? [...user.serviceArea]
        : [];
      if (user.district && !serviceArea.includes(user.district)) {
        serviceArea.push(user.district);
      }
      params.district = serviceArea;
    }

    if (search?.trim()) {
      params.search = search.trim();
    }

    const res = await axios.get(url, {
      params,
      paramsSerializer: (p) =>
        qs.stringify(p, { arrayFormat: "repeat" }),
      withCredentials: true,
    });

    const { requirements = [], pagination = {} } = res.data;
    const { totalPages = 1, currentPage: serverPage = 1 } = pagination;
   const transformedData = requirements.map((req) => ({
        site: req?.workLocation || "",
        workDays: 30,
        estimatedEndDate: req?.workerNeedDate || "",
        totalBalance: 0,
        totalWithdrawal: 0,
        longitude: req?.longitude || 0,
        latitude: req?.latitude || 0,
        totalWorkers:
          (req?.workerQuantitySkilled || 0) +
          (req?.workerQuantityUnskilled || 0),
        ern_num: req?.ERN_NUMBER || "",
        inTime: req?.inTime || "",
        outTime: req?.outTime || "",
        workType: req?.workType || "",
        emp_name: req?.employerName || "",
        city: req?.district || "",
        status: req?.status || "Pending",
        min_wages: req?.minBudgetPerWorker || 0,
        max_wages: req?.maxBudgetPerWorker || 0,
        assignedAgentId: req?.assignedAgentId || "",
        assignedAgentName: req?.assignedAgentName || "",
        assignedAgentPhone: req?.assignedAgentPhone || "",
        employerPhone: req?.employerPhone || "",
        intrestedAgents: req?.intrestedAgents || [],
        _id: req?._id,
        tehsil: req?.tehsil || "",
        employerId: req?.employerId || "",
        district: req?.district || "",
        isAgentAccepted: req?.isAgentAccepted,
        subCategory: req?.subCategory || "",
        remarks: req?.remarks,
        req_type: req?.req_type,
        estimated_days: req?.estimated_days,
        accommodationAvailable: req?.accommodationAvailable,
        foodAvailable: req?.foodAvailable,
        incentive: req?.incentive,
        overtimeAvailable: req?.overtimeAvailable,
        bonus: req?.bonus,
        transportProvided: req?.transportProvided,
        weeklyOff: req?.weeklyOff,
        finalAgentRequiredWage: req?.finalAgentRequiredWage,
        maxBudgetPerWorker: req?.maxBudgetPerWorker,
        minBudgetPerWorker: req?.minBudgetPerWorker,
        ern: req?.ERN_NUMBER || "",
        workerNeedDate: req?.workerNeedDate
          ? new Date(req.workerNeedDate).toLocaleDateString("en-GB")
          : "",
      }));


    setCurrentReq((prev) =>
      append ? [...prev, ...transformedData] : transformedData
    );

    setHasMore(serverPage < totalPages);
    setCurrentPage(serverPage);
  } catch (err) {
    console.error("Failed to fetch requirements:", err);
  } finally {
    setInitialLoading(false);
    setLoadingMore(false);
  }
};
const whatsappTemplates = {
  en: ({ name, phone, workType, subCategory, ern }) =>
    `Hello, I’m interested in this requirement.
Name: ${name},
Mobile: ${phone},
Work Type: ${workType}, ${subCategory},
ERN Number: ${ern}`,

  hi: ({ name, phone, workType, subCategory, ern }) =>
    `नमस्ते, मुझे इस कार्य आवश्यकता में रुचि है।
नाम: ${name},
मोबाइल नंबर: ${phone}.
कार्य का प्रकार: ${workType}, ${subCategory}.
ERN नंबर: ${ern}`,

  mr: ({ name, phone, workType, subCategory, ern }) =>
    `नमस्कार, मला या कामाच्या आवश्यकतेमध्ये रस आहे.
नाव: ${name},
मोबाईल नंबर: ${phone},
कामाचा प्रकार: ${workType}, ${subCategory},
ERN क्रमांक: ${ern}`,

  gu: ({ name, phone, workType, subCategory, ern }) =>
    `નમસ્તે, મને આ કામની જરૂરિયાતમાં રસ છે.
નામ: ${name},
મોબાઇલ નંબર: ${phone},
કામનો પ્રકાર: ${workType}, ${subCategory},
ERN નંબર: ${ern}`,
};

const buildWhatsappMessage = (stream, lang = "en") => {
  const template = whatsappTemplates[lang] || whatsappTemplates.en;

  return template({
    name: user?.name || "N/A",
    phone: user?.phone || "N/A",
    workType: stream.workType,
    subCategory: stream.subCategory,
    ern: stream.ern_num,
  });
};

const handleScroll = useCallback(() => {
  const container = scrollContainerRef.current;
  if (!container) return;

  const { scrollTop, scrollHeight, clientHeight } = container;

  if (
    scrollTop + clientHeight >= scrollHeight - 200 &&
    hasMore &&
    !loadingMore &&
    !initialLoading
  ) {
    fetchRequirements(currentPage + 1, true, 20);
  }
}, [currentPage, hasMore, loadingMore, initialLoading]);


    // 🔹 Attach scroll listener
useEffect(() => {
  const container = scrollContainerRef.current;
  if (!container) return;

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [handleScroll]);


 const sliderImages = [
  `${config.FILE_BASE_URL}/ImagesWeb/Industrial_Workers.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Construction_Workers.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Electrical_and_Wiring.jpg`,
    `${config.FILE_BASE_URL}/ImagesWeb/Logistics_Warehouse.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Painting_and_Finishing.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Fabrication_and_Welding.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Cleaning_and_Maintenance.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Household_Domestic.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Household_Services.jpg`,
  `${config.FILE_BASE_URL}/ImagesWeb/Agriculture_Farm_Workers.jpg`,
    `${config.FILE_BASE_URL}/ImagesWeb/Hospitality_Workers.jpg`,
    `${config.FILE_BASE_URL}/ImagesWeb/Automobile_Workshop.jpg`,

  `${config.FILE_BASE_URL}/ImagesWeb/General.jpg`,
];
// const isPageLoading = requirementsLoading || agentsLoading;

  const getBestMatchingImage = (workType) => {
    if (!workType) return "/General.jpg"; // fallback

    // Normalize work type (lowercase, trim spaces, replace spaces/underscores)
    const normalizedType = workType
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/_/g, "");

    // Try exact match ignoring underscores/spaces
    const match = sliderImages.find((img) => {
      const name = img
        .split("/")
        .pop()
        .split(".")[0]
        .toLowerCase()
        .replace(/_/g, "")
        .replace(/\s+/g, "");
      return name === normalizedType;
    });

    // Return exact match or fallback
    return match || "/app/General.jpg";
  };
  // 🚀 Initial load
  useEffect(() => {
    fetchRequirements(1, false, 20);
  }, []);

  return (
<Grid
  className="dash-card"
  item
  xs={12}
  ref={scrollContainerRef}
  sx={{
    maxHeight: "100vh",
    overflowY: "auto"
  }}
>         <Box 
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2,  mx: "auto"
                }}
              >
                <Box
                   onClick={() => navigate(-1)}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    "&:hover": { backgroundColor: "#f1f1f1" },
                  }}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                </Box>
             <Box>
  <Typography fontSize={16} fontWeight={700}>
    {t('workRequirements')}
  </Typography>

  <Typography fontSize={12} color="text.secondary">
    {t('newWorkOpportunities')}
  </Typography>
</Box>

              </Box>
      <Card sx={{ boxShadow: 0, borderRadius: 2 }}>
          {/* <Divider sx={{ borderColor: "#1876d2", borderBottomWidth: 5 }} /> */}

          {/* <InviteForWorkHeader
            t={t}
            onSearch={(value) => {
              if (searchTimeout.current)
                clearTimeout(searchTimeout.current);

              searchTimeout.current = setTimeout(() => {
                fetchRequirements(1, false, 20, value);
              }, 500);
            }}
          /> */}

          {/* <Divider sx={{ mb: 1, borderColor: "#1876d2", borderBottomWidth: 5 }} /> */}

          {/* {loading && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          )} */}

  <Grid item xs={12}>
  <Grid item xs={12} sx={{ mb: 5 }}>
    <Card
      sx={{
        borderRadius: "28px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
      }}
    >
      {/* Top header strip */}
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 30%), radial-gradient(circle at bottom left, rgba(255,255,255,0.08), transparent 30%)",
            pointerEvents: "none",
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <InviteForWorkHeader
            t={t}
            onSearch={(value) => {
              if (searchTimeout.current) clearTimeout(searchTimeout.current);

              searchTimeout.current = setTimeout(() => {
                fetchRequirements(1, false, 20, value);
              }, 500);
            }}
          />
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: "#3b82f6",
          borderBottomWidth: "3px",
          opacity: 1,
        }}
      />

      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2, md: 2.5 },
          background:
            "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {initialLoading && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              borderRadius: "22px",
              border: "1px solid #e2e8f0",
              background: "#fff",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
            }}
          >
            <CircularProgress size={34} />
            <Typography fontSize={13} color="text.secondary" mt={1.5}>
              {t("SearchingPleaseWait")}
            </Typography>
          </Box>
        )}

        <Grid sx={{ mt: 0.5 }} container spacing={2}>
          {!initialLoading &&
          !currentReq &&
          currentReq.length === 0 &&
          (currentReq.every(
            (stream) => stream.status?.toLowerCase() !== "assigned"
          ) &&
            currentReq.every(
              (stream) =>
                stream.status?.toLowerCase() !== "pending" ||
                stream.req_type == "Contract_Based" ||
                stream.req_type == "Office_Staff"
            )) ? (
            <Grid item xs={12} sx={{ pt: 0, pb: 0 }}>
              {loading ? (
                <Box
                  sx={{
                    height: "280px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "22px",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
                  }}
                >
                  <CircularProgress sx={{ color: "#2563eb" }} />
                </Box>
              ) : (
                <Box
                  sx={{
                    minHeight: "280px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    backgroundImage: {
                      xs: 'url("/home-slide-2.jpeg")',
                      sm: 'url("/agent_desk.jpg")',
                    },
                    backgroundSize: {
                      xs: "cover",
                      sm: "cover",
                    },
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.14)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.82) 100%)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      px: 3,
                      py: 4,
                      color: "#fff",
                      textAlign: "center",
                      maxWidth: 540,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      {t("noRequirementsFound")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: ".95rem",
                        color: "rgba(255,255,255,0.82)",
                      }}
                    >
                      Keep your profile active and check again for fresh
                      opportunities.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>
          ) : (
            currentReq
              .filter((stream) => {
                return (
                  (stream.status || "").trim().toLowerCase() !== "assigned" &&
                  stream.assignedAgentId !== user?._id &&
                  stream.req_type !== "Contract_Based" &&
                  stream.req_type !== "Office_Staff"
                );
              })
              .map((stream, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  key={index}
                  sx={{
                    pt: "10px !important",
                    pb: 0,
                    mt: 0,
                    mb: 0,
                  }}
                >
                  <Card
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "24px",
                      border: "1px solid rgba(148,163,184,0.18)",
                      boxShadow: "0 18px 50px rgba(15, 23, 42, 0.10)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      background: "#fff",
                      transition: "all .25s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.14)",
                      },
                      "&::before": {
                        content: `"${t("companyName")}"`,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "2.8rem",
                        fontWeight: 800,
                        color: "rgba(255,255,255,0.06)",
                        zIndex: 0,
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        p: 2,
                        backgroundImage: `url(${getBestMatchingImage(
                          stream.workType
                        )})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        color: "#fff",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(180deg, rgba(2,6,23,0.72) 0%, rgba(2,6,23,0.88) 100%)",
                          zIndex: 0,
                        },
                        "& > *": {
                          position: "relative",
                          zIndex: 1,
                        },
                      }}
                      className="invitecard"
                    >
                      <Grid container spacing={1.2} sx={{ pt: 0 }}>
                        <Grid
                          item
                          xs={12}
                          sx={{
                            pt: "0 !important",
                            pb: 0,
                            mt: 0,
                            mb: 0,
                          }}
                        >
                          <Box
                            sx={{
                              pt: 0,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{
                                mb: 1.2,
                                p: 1,
                                borderRadius: "14px",
                                background: "rgba(255,255,255,0.08)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  color: "#aeeaff",
                                  fontWeight: 700,
                                }}
                              >
                                {t("ernLabel")}: {stream.ern_num}
                              </Typography>

                              <Box display="flex" alignItems="center" gap={1}>
                                <ContactButtons
                                  stream={stream}
                                  currentLang={currentLang}
                                  isVerified={user.veryfiedBage}
                                />

                                <IconButton
                                  onClick={() =>
                                    handleLocationClick(
                                      stream?.latitude,
                                      stream?.longitude
                                    )
                                  }
                                  sx={{
                                    p: 0.75,
                                    m: 0,
                                    minWidth: 34,
                                    color: "#ffd180",
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.10)",
                                    "&:hover": {
                                      background: "rgba(255,255,255,0.16)",
                                    },
                                  }}
                                >
                                  <LocationOnIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <AboutWorkSection stream={stream} t={t} />
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.8,
                              }}
                            >
                              <LocationCityIcon
                                sx={{ color: "#81d4fa" }}
                                fontSize="small"
                              />
                              <Typography variant="body2" fontWeight={700}>
                                <strong>{t("city")}:</strong>
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                                {stream.city}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1,
                              }}
                            >
                              <PlaceIcon
                                sx={{ color: "#ffcc80", mt: "2px" }}
                                fontSize="small"
                              />
                              <Typography
                                variant="body2"
                                sx={{ wordBreak: "break-word", opacity: 0.95 }}
                              >
                                <strong>{t("site")}:</strong>{" "}
                                {stream?.tehsil + " " + stream?.site}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Grid container spacing={1.5} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  p: 1.2,
                                  borderRadius: "14px",
                                  background: "rgba(255,255,255,0.08)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }}
                              >
                                <GroupsIcon
                                  fontSize="small"
                                  sx={{ color: "#fff59d" }}
                                />
                                <Typography variant="body2">
                                  <strong>{t("requiredWorkers")}:</strong>{" "}
                                  <span style={{ fontSize: "14px" }}>
                                    {stream.totalWorkers}
                                  </span>
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={6}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  p: 1.2,
                                  borderRadius: "14px",
                                  background: "rgba(255,255,255,0.08)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }}
                              >
                                <CurrencyRupeeIcon
                                  fontSize="small"
                                  sx={{ color: "#c5e1a5" }}
                                />
                                <Typography variant="body2">
                                  <strong>{t("perHeadWages")}:</strong>{" "}
                                  <span style={{ fontSize: "14px" }}>
                                    {getPerHeadWages(
                                      stream,
                                      stream.max_wages * 0.9,
                                      stream?.assignedAgentId
                                    )}
                                    /-
                                  </span>
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            {[
                              {
                                key: "accommodationAvailable",
                                label: t("accommodationAvailable"),
                              },
                              {
                                key: "foodAvailable",
                                label: t("foodAvailable"),
                              },
                              {
                                key: "incentive",
                                label: t("incentive"),
                              },
                              { key: "bonus", label: t("bonus") },
                              {
                                key: "transportProvided",
                                label: t("transportProvided"),
                              },
                              {
                                key: "weeklyOff",
                                label: t("weeklyOff"),
                              },
                              {
                                key: "overtimeAvailable",
                                label: t("overtimeAvailable"),
                              },
                            ]
                              .filter((item) => stream?.[item.key] === true)
                              .map((item) => (
                                <Box
                                  key={item.key}
                                  sx={{
                                    display: "inline-block",
                                    background:
                                      "linear-gradient(135deg, rgba(34,197,94,0.95) 0%, rgba(22,163,74,0.95) 100%)",
                                    color: "#fff",
                                    px: 1.4,
                                    py: 0.7,
                                    borderRadius: "999px",
                                    mr: 1,
                                    mb: 1,
                                    fontSize: "0.76rem",
                                    fontWeight: 700,
                                    boxShadow:
                                      "0 8px 18px rgba(34,197,94,0.22)",
                                  }}
                                >
                                  {item.label}
                                </Box>
                              ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>

                    <Box
                      sx={{
                        display: "flex",
                        p: 1.5,
                        gap: 1.2,
                        pt: 1.2,
                        zIndex: 1,
                        background:
                          "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                        borderTop: "1px solid #e2e8f0",
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <TextField
                        type="number"
                        label={t("quotePerHead")}
                        size="small"
                        required
                        fullWidth
                        variant="outlined"
                        inputProps={{
                          min: 0,
                          max: 99,
                        }}
                        disabled={
                          interestedMap[stream._id] ||
                          hasUserShownInterest(stream, user._id)
                        }
                        value={
                          wagesMap[stream._id] !== undefined
                            ? wagesMap[stream._id]
                            : getUserWage(stream, user._id)
                        }
                        onChange={(e) =>
                          handleWagesChange(
                            stream._id,
                            e.target.value,
                            stream?.min_wages
                          )
                        }
                        inputRef={(el) =>
                          (wageInputRefs.current[stream._id] = el)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "14px",
                            background: "#fff",
                          },
                        }}
                      />

                      <Button
                        onClick={() =>
                          handleExpressInterest(
                            stream._id,
                            wagesMap[stream._id],
                            stream?.min_wages
                          )
                        }
                        disabled={
                          interestedMap[stream._id] ||
                          hasUserShownInterest(stream, user._id)
                        }
                        variant="contained"
                        size="small"
                        fullWidth
                        sx={{
                          whiteSpace: "nowrap",
                          borderRadius: "14px",
                          textTransform: "none",
                          fontWeight: 800,
                          minHeight: 42,
                          background:
                            interestedMap[stream._id] ||
                            hasUserShownInterest(stream, user._id)
                              ? undefined
                              : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                          boxShadow:
                            interestedMap[stream._id] ||
                            hasUserShownInterest(stream, user._id)
                              ? undefined
                              : "0 12px 24px rgba(37, 99, 235, 0.22)",
                        }}
                      >
                        {interestedMap[stream._id] ||
                        hasUserShownInterest(stream, user._id)
                          ? t("interestShown")
                          : t("showInterest")}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
          )}
        </Grid>
      </CardContent>
    </Card>
  </Grid>
</Grid>

{loadingMore && (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 1.2,
      py: 2.5,
      mt: 1.5,
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      background: "#fff",
      color: "text.secondary",
      boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)",
    }}
  >
    <CircularProgress size={18} />
    <Typography fontSize={13} fontWeight={500}>
      Loading more opportunities…
    </Typography>
  </Box>
)}
       
      </Card>
        <PathLocationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                selectedLocation={selectedLocation}
              />
    </Grid>
  );
};

export default DashboardRequirements;

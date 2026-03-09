import {
  Box,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  Chip,
  TextField,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState, useContext, useRef } from "react";
import config from "../config/";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { indianStates } from "../stateDistrict";
import { Context } from "../main";
import RatingStars from "./RatingStars";
import WORKER_CATEGORIES from "../categories.json";
import FilterListIcon from "@mui/icons-material/FilterList";
import PricingBanner from "./PricingBanner";  
const PAGE_LIMIT = 25;
// const WORKER_TYPES = [
//   "Construction Worker",
//   "Industrial Worker",
//   "Agriculture Worker",
//   "Household Worker",
//   "Security Worker",
//   "Driver",
// ];

const VerifiedAgentsPage = ({ users = {} }) => {
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:768px)");

  const [agents, setAgents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const scrollContainerRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [state, setState] = useState(user?.state || "");
  const [district, setDistrict] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [ageRange, setAgeRange] = useState([]);
  const [workerType, setWorkerType] = useState("");
  const [gender, setGender] = useState("");
  const [workerGroup, setWorkerGroup] = useState("");

  const [unlockedPhones, setUnlockedPhones] = useState({});
  const [loadingNumber, setLoadingNumber] = useState({});
  const [callStatus, setCallStatus] = useState({});
  const [savingStatus, setSavingStatus] = useState({});
  const blinkAnimationagent = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  `;

  const stateOptions = Object.keys(indianStates);
  const districtOptions = state ? Object.keys(indianStates[state] || {}) : [];
  const tehsilOptions =
    state && district ? indianStates[state][district] || [] : [];

  const isSubscriptionExpired =
    user?.isSubscribed &&
    user?.subscriptionExpery &&
    new Date(user.subscriptionExpery).getTime() <= Date.now();

  const getAge = (dob) => {
    if (dob == null || dob === "") return "";

    const timestamp = Number(dob);
    if (isNaN(timestamp)) return "";

    // Case 1: Small numbers (age OR year)
    if (dob.toString().length <= 5) {
      // If year like 1995
      if (timestamp > 1900 && timestamp <= new Date().getFullYear()) {
        return new Date().getFullYear() - timestamp;
      }
      // Otherwise assume it's already age (25)
      return timestamp;
    }

    // Case 2: Unix timestamp (seconds or milliseconds)
    let finalTimestamp = timestamp;

    // seconds → milliseconds
    if (timestamp < 10000000000) {
      finalTimestamp *= 1000;
    }

    const birthDate = new Date(finalTimestamp);
    if (isNaN(birthDate.getTime())) return "";

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };
  const sectionTitle = {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "text.secondary",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    mt: 2,
    mb: 0.6,
  };
  const getRandom10DigitNumber = () => {
    const str = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const last2 = str.slice(-2);
    return `********${last2}`;
  };
const [isLimitExhausted, setIsLimitExhausted] = useState(user?.remainingContacts <= 0);
  const handleViewNumber = async (agentId) => {
    if (isSubscriptionExpired) {
      toast.error("Your plan has expired. Please renew to view more contacts.");
      navigate("/pricing");
      return;
    }
    if (unlockedPhones[agentId] || loadingNumber[agentId]) return;

    try {
      setLoadingNumber((prev) => ({ ...prev, [agentId]: true }));
      const res = await axios.get(
        `${config.API_BASE_URL}/api/v1/user/unlock-number/${agentId}`,
        { withCredentials: true },
      );

      if (res.data?.phone) {
        setUnlockedPhones((prev) => ({ ...prev, [agentId]: res.data.phone }));
      } else {
        toast.error("Unable to fetch number");
      }
    } catch (err) {
  console.error(err);
  let message = "Failed to unlock number. Please try again.";

  if (err.response?.data?.message) {
    if (err.response.data.message === "Contact limit exhausted") {
      setIsLimitExhausted(true);
      message =
        "Your contact limit has been exhausted. Please take a top‑up plan to unlock more contacts. This ensures uninterrupted access while maintaining trust and safety for all users.";
      toast.error(message);
      navigate("/pricing"); // 👈 redirect user to pricing page
      return; // stop further execution
    } else {
      message = err.response.data.message;
    }
  }

  toast.error(message);
} finally {
  setLoadingNumber((prev) => ({ ...prev, [agentId]: false }));
}
  };

  const fetchUserRemarks = async () => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/api/v1/user/worker-remarks`,
        { withCredentials: true },
      );

      /**
       * Expected response:
       * [
       *   { workerId: "abc", status: "not_picked" },
       *   { workerId: "xyz", status: "not_interested" }
       * ]
       */

      const mapped = {};
      res.data.forEach((item) => {
        mapped[item.workerId] = item.status;
      });

      setCallStatus(mapped);
    } catch (err) {
      console.error("Failed to load remarks");
    }
  };

  useEffect(() => {
    if (isAuthorized) fetchUserRemarks();
  }, [isAuthorized]);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 100
      ) {
        if (!loadingMore && !loading && agents.length < total) {
          setPage((prev) => prev + 1);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, agents, total]);
  const clearAllFilters = () => {
    setState("");
    setDistrict("");
    setTehsil("");
    setAgeRange([]);
    setWorkerType("");
    setGender("");
    setWorkerGroup("");
  };

  const saveCallStatus = async (agentId, status) => {
    try {
      setSavingStatus((prev) => ({ ...prev, [agentId]: true }));

      // Optimistic UI update
      setCallStatus((prev) => ({ ...prev, [agentId]: status }));

      await axios.post(
        `${config.API_BASE_URL}/api/v1/user/worker-remark`,
        {
          workerId: agentId,
          status, // not_picked | not_interested | call_later | etc
        },
        { withCredentials: true },
      );
    } catch (err) {
      toast.error("Failed to save remark");
    } finally {
      setSavingStatus((prev) => ({ ...prev, [agentId]: false }));
    }
  };

  const handleUnlock = (agentId) => {
    navigate("/pricing", {
      state: { agentId, source: "verified_agents" },
    });
  };
  const fetchAgents = async (reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = { page, limit: PAGE_LIMIT };
      if (state) params.state = state;
      if (district) params.city = district;
      if (tehsil) params.block = tehsil;
      if (workerType) params.workerType = workerType;
      if (ageRange[0] || ageRange[1]) {
        params.minAge = ageRange[0];
        params.maxAge = ageRange[1];
      }
      if (gender) params.gender = gender;
      if (workerGroup) params.workerGroup = workerGroup;

      const res = await axios.get(
        `${config.API_BASE_URL}/api/v1/user/getAllAgents`,
        { params, withCredentials: true },
      );

      if (res.data.success) {
        setAgents((prev) =>
          reset || page === 1 ? res.data.agents : [...prev, ...res.data.agents],
        );
        setTotal(res.data.pagination.total);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch workers. Please try again.");
    } finally {
      if (reset) setLoading(false);
      else setLoadingMore(false);
    }
  };

  // const applyFilters = () => {
  //   if (user.isSubscribed) {
  //     setPage(1);
  //     setAgents([]); // Clear old list
  //     fetchAgents(true); // Reset fetch
  //   } else {
  //     navigate("/pricing");
  //   }
  // };

  const applyFilters = () => {
    if (user.isSubscribed) {
      setPage(1);
      setAgents([]); // clear old list
      setLoading(true); // show loader
      fetchAgents(true);

      // Auto-close filter only on mobile
      if (window.innerWidth <= 768) {
        // adjust breakpoint as needed
        setShowFiltersMobile(false); // assuming you have a state controlling the filter panel
      }
    } else {
      navigate("/pricing");
    }
  };

  const formatAreas = (areas = []) =>
    areas
      .filter(Boolean)
      .map((a) => a.trim())
      .filter((a) => a.length > 0)
      .map((a) =>
        a.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()),
      )
      .join(", ");

  const formatName = (name = "") =>
    name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    fetchAgents(true);
  }, []);

  useEffect(() => {
    if (!isAuthorized) navigate("/landing");
  }, [isAuthorized, navigate]);

  useEffect(() => {
    fetchAgents();
  }, [page]);

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 2, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2,
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
            Verified Workers & Agents
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            Trusted verified workers
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: isMobile ? "block" : "flex",
          gap: 2,
          mb: 1,
        }}
      >
        {/* Mobile Filter Toggle */}
        {isMobile && !showFiltersMobile && (
          <Box
            sx={{
              position: "fixed",
              top: 80,
              right: 16,
              zIndex: 999,
              cursor: "pointer",
              backgroundColor: "#fff",
              p: 1,
              borderRadius: 1,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
            onClick={() => setShowFiltersMobile(true)}
          >
            <FilterListIcon />
          </Box>
        )}

        {/* Filters Panel */}
        {(!isMobile || showFiltersMobile) && (
          <Box
            sx={{
              width: isMobile ? "100%" : 300,
              height: isMobile ? "calc(100vh - 60px)" : "auto",
              p: 2,
              borderRadius: isMobile ? "16px 16px 0 0" : 2,
              backgroundColor: "#ffffff",
              boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
              position: isMobile ? "fixed" : "relative",
              top: isMobile ? 60 : "auto",
              left: 0,
              zIndex: 1,
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
            }}
          >
            {/* HEADER */}
            {/* HEADER */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "text.primary",
                }}
              >
                Filter Workers
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                 <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                }}
                onClick={applyFilters}
              >
                Apply
              </Button>
              

                {isMobile && (
                  <Box
                    onClick={() => setShowFiltersMobile(false)}
                    sx={{
                      cursor: "pointer",
                      px: 1,
                      py: 0.5,
                      borderRadius: "50%",
                      fontSize: "0.9rem",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    ✕
                  </Box>
                )}
              </Box>
            </Box>

            {/* CLEAR ALL (TOP) */}
            {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
    <Button
      size="small"
      variant="text"
      onClick={clearAllFilters}
      sx={{
        fontSize: "0.7rem",
        fontWeight: 700,
        textTransform: "none",
      }}
    >
      Clear All
    </Button>
  </Box> */}

            {/* LOCATION */}
            <Typography sx={sectionTitle}>Location</Typography>

            <Select
              size="small"
              fullWidth
              value={state}
              displayEmpty
              onChange={(e) => {
                setState(e.target.value);
                setDistrict("");
                setTehsil("");
              }}
            >
              <MenuItem value="">Select State</MenuItem>
              {stateOptions.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
                </MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              fullWidth
              value={district}
              displayEmpty
              disabled={!state}
              sx={{ mt: 1 }}
              onChange={(e) => {
                setDistrict(e.target.value);
                setTehsil("");
              }}
            >
              <MenuItem value="">Select District</MenuItem>
              {districtOptions.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              fullWidth
              value={tehsil}
              displayEmpty
              disabled={!district}
              sx={{ mt: 1 }}
              onChange={(e) => setTehsil(e.target.value)}
            >
              <MenuItem value="">Select Tehsil / Block</MenuItem>
              {tehsilOptions.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>

            {/* AGE RANGE */}
            <Typography sx={sectionTitle}>Age Range</Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                value={ageRange[0]}
                onChange={(e) =>
                  setAgeRange([Number(e.target.value), ageRange[1]])
                }
              />
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                value={ageRange[1]}
                onChange={(e) =>
                  setAgeRange([ageRange[0], Number(e.target.value)])
                }
              />
            </Box>

            {/* WORK CATEGORY */}
            <Typography sx={sectionTitle}>Worker Category</Typography>

            <Select
              size="small"
              fullWidth
              value={workerType}
              displayEmpty
              onChange={(e) => setWorkerType(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {WORKER_CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>

            {/* GENDER */}
            <Typography sx={sectionTitle}>Gender</Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["Male", "Female", "Other"].map((g) => (
                <Chip
                  key={g}
                  label={g}
                  clickable
                  variant={gender === g ? "filled" : "outlined"}
                  color={gender === g ? "primary" : "default"}
                  onClick={() => setGender(gender === g ? "" : g)}
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
            </Box>

            {/* WORKER TYPE */}
            <Typography sx={sectionTitle}>Worker Type</Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label="Individual"
                clickable
                variant={workerGroup === "individual" ? "filled" : "outlined"}
                color={workerGroup === "individual" ? "primary" : "default"}
                onClick={() =>
                  setWorkerGroup(
                    workerGroup === "individual" ? "" : "individual",
                  )
                }
              />
              <Chip
                label="Group / Agent"
                clickable
                variant={workerGroup === "group" ? "filled" : "outlined"}
                color={workerGroup === "group" ? "primary" : "default"}
                onClick={() =>
                  setWorkerGroup(workerGroup === "group" ? "" : "group")
                }
              />
            </Box>

            {/* FOOTER ACTIONS */}
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                mt: 1,
                pt: 1,
                mb: 2,
                backgroundColor: "#fff",
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                }}
                onClick={clearAllFilters}
              >
                Clear
              </Button>

              <Button
                variant="contained"
                fullWidth
                size="small"
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                }}
                onClick={applyFilters}
              >
                Apply
              </Button>
            </Box>
          </Box>
        )}

        {/* Agents List */}
        <Box
          ref={scrollContainerRef}
          sx={{
            flex: 1,
            maxHeight: "calc(100vh - 160px)",
            overflowY: "auto",
            mt: 1,
            pr: 0.5,
          }}
        >
          {isLimitExhausted && (
  <div>
    <PricingBanner userRole={user?.userRole} />
  </div>
)}

          {loading ? (
            <Box
              sx={{
                height: "20vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Typography fontSize={13} color="text.secondary">
                Fetching best matches for you…
              </Typography>
              <CircularProgress size={40} />
            </Box>
          ) : agents.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                mt: 4,
                fontSize: "1rem",
                fontWeight: 600,
                color: "text.secondary",
              }}
            >
              ❌ No workers/agents available for the current combination of
              filters
            </Typography>
          ) : (
            agents.map((agent) => {
              const areas = Array.isArray(agent?.areasOfWork)
                ? agent.areasOfWork.flatMap((item) =>
                    typeof item === "string" && item.startsWith("[")
                      ? JSON.parse(item)
                      : item,
                  )
                : [];

             return (
<Box
  key={agent._id}
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    p: 1.5,
    pt: 2,
    mb: "5px",
    borderRadius: 2,
    backgroundColor: "#fff",   // card background
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", // card shadow
    border: "1px solid #e0e0e0", // subtle border
  }}
>
    {/* ===== TOP ROW: Avatar + Main Details ===== */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1.5,
        alignItems: "flex-start",
      }}
    >
      {/* ===== AVATAR COLUMN ===== */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 100,
        }}
      >
        {/* Avatar + Verified Badge */}
        {agent?.veryfiedBage ? (
          <Box
            sx={{
              position: "relative",
              p: 1,
              borderRadius: "50%",
              backdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            }}
          >
            <Avatar
              src={
                agent?.profilePhoto
                  ? `${config.FILE_BASE_URL}/${agent.profilePhoto}`.replace(/([^:]\/)\/+/g, "$1")
                  : "/usericon.png"
              }
              sx={{ width: 80, height: 80, border: "3px solid #4caf50" }}
            />
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -10,
                background: "linear-gradient(135deg, #43cea2, #185a9d)",
                px: 1.2,
                py: 0.4,
                borderRadius: 12,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
              }}
            >
              VERIFIED
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: -2,
                right: -2,
                backgroundColor: "#4caf50",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              ✔
            </Box>
          </Box>
        ) : (
          <Avatar
            src={
              agent?.profilePhoto
                ? `${config.FILE_BASE_URL}/${agent.profilePhoto}`.replace(/([^:]\/)\/+/g, "$1")
                : "/usericon.png"
            }
            sx={{ width: 80, height: 80, border: "2px solid #1976d2" }}
          />
        )}

        {/* ===== DETAILS BELOW AVATAR ===== */}
        <Box
          sx={{
            mt: 0.8,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 0.3,
          }}
        >
          {(agent?.dob || agent?.gender) && (
            <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", fontWeight: 600 }}>
              {agent?.dob ? `${getAge(agent.dob)} yrs` : ""}
              {agent?.dob && agent?.gender ? " • " : ""}
              {agent?.gender || ""}
            </Typography>
          )}
          {agent?.workExperience !== undefined && (
            <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", fontWeight: 600 }}>
              {Number(agent.workExperience) > 0 ? Number(agent.workExperience) : 3} yrs exp
            </Typography>
          )}
          {(agent?.fixedSalary > 0 || agent?.salaryFrom > 0) && (
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#1b5e20" }}>
              ₹
              {agent?.fixedSalary > 0 ? agent.fixedSalary : `${agent.salaryFrom} - ${agent.salaryTo}`}
              <span style={{ fontWeight: 500, color: "#2e7d32" }}> /day</span>
            </Typography>
          )}
          {workerType && (
            <Chip
              label={workerType}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.65rem",
                mt: 0.3,
                height: "auto",
                "& .MuiChip-label": { whiteSpace: "normal", lineHeight: 1.3, padding: "2px 6px" },
              }}
            />
          )}
        </Box>
      </Box>

      {/* ===== MAIN DETAILS COLUMN ===== */}
      <Box sx={{ flex: 1, mt: isMobile ? 1 : 0 }}>
        {/* Name & Rating */}
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "text.primary", display: "flex", flexWrap: "wrap", gap: 0.6, lineHeight: 1.2 }}>
          {formatName(agent?.name)}
          <RatingStars rating={agent?.rating} size={14} />
        </Typography>

        {/* Location */}
        <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", mt: 0.3 }}>
          📍 {agent.district}, {agent.state}
        </Typography>

        {/* Area Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 1 }}>
          <Chip
            label={agent?.role === "Agent" ? "Skilled Worker • Agent Managed" : "Skilled Worker"}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.68rem", height: 24, fontWeight: 600, borderColor: "#bbdefb", color: "#0d47a1" }}
          />
          <Chip
            label={formatAreas(areas) || "Any Work"}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.68rem",
              fontWeight: 700,
              minHeight: 24,
              height: "auto",
              alignItems: "flex-start",
              "& .MuiChip-label": { whiteSpace: "normal", lineHeight: 1.35, padding: "6px 8px", wordBreak: "break-word" },
            }}
          />
        </Box>

        {/* Contact Info */}
{/* Contact Info */}
<Box sx={{ mt: 1.2 }}>
  {unlockedPhones[agent._id] ? (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        size="small"
        variant="contained"
        color="success"
        href={`tel:${unlockedPhones[agent._id]}`}
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#fff",
          textTransform: "none",
          borderRadius: 2,
        }}
      >
       📞 Call {unlockedPhones[agent._id]}
      </Button>

      <Button
        size="small"
        variant="contained"
        href={`https://wa.me/91${unlockedPhones[agent._id]}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#fff",
          backgroundColor: "#25D366",
          textTransform: "none",
          borderRadius: 2,
          "&:hover": {
            backgroundColor: "#1ebe5d",
          },
        }}
      >
        💬 WhatsApp
      </Button>
    </Box>
  ) : user?.isSubscribed ? (
    <Button
      size="small"
      variant="contained"
      color="primary"
      onClick={() => handleViewNumber(agent._id)}
      sx={{
        fontSize: "0.75rem",
        fontWeight: 700,
        color: "#fff",
        textTransform: "none",
        borderRadius: 2,
      }}
    >
      👁️ View Contact
    </Button>
  ) : (
    <Button
      size="small"
      variant="contained"
      color="inherit"
      onClick={() => handleUnlock(agent._id)}
      sx={{
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#fff",
        backgroundColor: "text.secondary",
        textTransform: "none",
        borderRadius: 2,
        "&:hover": {
          backgroundColor: "grey.700",
        },
      }}
    >
      🔒 {getRandom10DigitNumber()} — Unlock to Connect
    </Button>
  )}
</Box>

      </Box>
    </Box>

    {/* ===== FOOTER ===== */}
    <Box sx={{ mt: 0, width: "100%" }}>
      {/* Agent Group */}
      {agent?.role === "Agent" && (
        <Box sx={{ p: 1, borderRadius: 2, background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", border: "1px solid #90caf9", mb: 1 }}>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#0d47a1" }}>👥 Group of Workers Available</Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#1a237e", mt: 0.3 }}>Ideal for <b>Company</b>, <b>Contractor</b> & <b>Agency</b>.</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.6, flexWrap: "wrap" }}>
            <Chip size="small" label="✔ Bulk Hiring" sx={{ fontSize: "0.65rem", height: 22 }} />
            <Chip size="small" label="✔ Managed Workforce" sx={{ fontSize: "0.65rem", height: 22 }} />
            <Chip size="small" label="✔ Faster Deployment" sx={{ fontSize: "0.65rem", height: 22 }} />
          </Box>
        </Box>
      )}

      {/* Call Outcome */}
      {user?.isSubscribed && (
    <Box sx={{ mt: 0 }}>
  <Select
    size="small"
    fullWidth
    displayEmpty
    value={callStatus[agent._id] || ""}
    disabled={savingStatus[agent._id]}
    onChange={(e) => saveCallStatus(agent._id, e.target.value)}
    sx={{
      fontSize: "0.78rem",
      height: 34,
      borderRadius: 1.5,
    }}
    renderValue={(selected) => {
      if (!selected) {
        return (
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            Call Outcome
          </Typography>
        );
      }
      return selected
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }}
  >
    <MenuItem disabled value="">
      Call Outcome
    </MenuItem>

    <MenuItem value="not_picked">📵 Not Picked</MenuItem>
    <MenuItem value="switched_off">🔕 Switched Off</MenuItem>
    <MenuItem value="call_later">⏳ Call Later</MenuItem>
    <MenuItem value="not_interested">❌ Not Interested</MenuItem>
    <MenuItem value="wrong_number">☎️ Wrong Number</MenuItem>
    <MenuItem value="relevant">✅ Relevant</MenuItem>
  </Select>

  {savingStatus[agent._id] && (
    <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", mt: 0.3 }}>
      Saving call status…
    </Typography>
  )}
</Box>

      )}
    </Box>
  </Box>
);

            })
          )}

          {!loading && loadingMore && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {/* {!loading && agents.length < total && (
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 1, borderRadius: 2, mb: 15 }}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Load More
            </Button>
          )} */}
        </Box>
      </Box>
    </Box>
  );
};

export default VerifiedAgentsPage;

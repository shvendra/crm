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
    const isExpired = new Date(user?.subscriptionExpiry).getTime() <= Date.now();

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
  <Box
    sx={{
      px: { xs: 1.5, md: 2 },
      pt: 2,
      pb: 2,
      mx: "auto",
      backgroundColor: "#f4f6fb",
      minHeight: "100vh",
    }}
  >
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
          width: 38,
          height: 38,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "0.2s ease",
          backgroundColor: "#fff",
          border: "1px solid #e6eaf2",
          "&:hover": { backgroundColor: "#f7f8fc" },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
      </Box>

      <Box>
        <Typography fontSize={18} fontWeight={700} color="#1f2a44">
          Verified Workers & Agents
        </Typography>
        <Typography fontSize={12} color="#6b7280">
          Search trusted skilled and unskilled workers across locations
        </Typography>
      </Box>
    </Box>

    {/* Main Content */}
    <Box
      sx={{
        display: isMobile ? "block" : "grid",
        gridTemplateColumns: isMobile ? "1fr" : "280px minmax(0,1fr)",
        gap: 2,
        alignItems: "start",
      }}
    >
      {/* Mobile Filter Toggle */}
      {isMobile && !showFiltersMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 84,
            right: 14,
            zIndex: 1200,
            cursor: "pointer",
            backgroundColor: "#fff",
            p: 1,
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 24px rgba(15,23,42,0.14)",
          }}
          onClick={() => setShowFiltersMobile(true)}
        >
          <FilterListIcon sx={{ color: "#374151" }} />
        </Box>
      )}

      {/* Filters Panel */}
      {(!isMobile || showFiltersMobile) && (
        <Box
          sx={{
            width: "100%",
            p: 2,
            borderRadius: isMobile ? "18px 18px 0 0" : "18px",
            backgroundColor: "#fff",
            border: "1px solid #e8edf5",
            boxShadow: "0 8px 28px rgba(15,23,42,0.06)",
            position: isMobile ? "fixed" : "sticky",
            top: isMobile ? 60 : 12,
            left: 0,
            zIndex: isMobile ? 1300 : 1,
            height: isMobile ? "calc(100vh - 60px)" : "auto",
            maxHeight: isMobile ? "calc(100vh - 60px)" : "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#111827",
              }}
            >
              Filters
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={clearAllFilters}
                sx={{
                  minWidth: "auto",
                  px: 1,
                  color: "#4f46e5",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Clear
              </Button>

              {isMobile && (
                <Box
                  onClick={() => setShowFiltersMobile(false)}
                  sx={{
                    cursor: "pointer",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    fontSize: "0.95rem",
                    backgroundColor: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#374151",
                  }}
                >
                  ✕
                </Box>
              )}
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#374151",
              mb: 1,
            }}
          >
            Worker Category
          </Typography>
          <Select
            size="small"
            fullWidth
            value={workerType}
            displayEmpty
            onChange={(e) => setWorkerType(e.target.value)}
            sx={{
              borderRadius: 3,
              backgroundColor: "#fafbff",
              mb: 2,
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {WORKER_CATEGORIES.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>

          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#374151",
              mb: 1,
            }}
          >
            State
          </Typography>
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
            sx={{
              borderRadius: 3,
              backgroundColor: "#fafbff",
              mb: 2,
            }}
          >
            <MenuItem value="">Select State</MenuItem>
            {stateOptions.map((st) => (
              <MenuItem key={st} value={st}>
                {st}
              </MenuItem>
            ))}
          </Select>

          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#374151",
              mb: 1,
            }}
          >
            District
          </Typography>
          <Select
            size="small"
            fullWidth
            value={district}
            displayEmpty
            disabled={!state}
            onChange={(e) => {
              setDistrict(e.target.value);
              setTehsil("");
            }}
            sx={{
              borderRadius: 3,
              backgroundColor: "#fafbff",
              mb: 2,
            }}
          >
            <MenuItem value="">Select District</MenuItem>
            {districtOptions.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>

          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#374151",
              mb: 1,
            }}
          >
            Gender
          </Typography>
          <Select
            size="small"
            fullWidth
            value={gender}
            displayEmpty
            onChange={(e) => setGender(e.target.value)}
            sx={{
              borderRadius: 3,
              backgroundColor: "#fafbff",
              mb: 2,
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>

          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#374151",
              mb: 1,
            }}
          >
            Worker Type
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip
              label="Individual"
              clickable
              onClick={() =>
                setWorkerGroup(workerGroup === "individual" ? "" : "individual")
              }
              sx={{
                borderRadius: "999px",
                backgroundColor:
                  workerGroup === "individual" ? "#4f46e5" : "#eef2f7",
                color: workerGroup === "individual" ? "#fff" : "#4b5563",
                fontWeight: 500,
              }}
            />
            <Chip
              label="Group / Agent"
              clickable
              onClick={() =>
                setWorkerGroup(workerGroup === "group" ? "" : "group")
              }
              sx={{
                borderRadius: "999px",
                backgroundColor:
                  workerGroup === "group" ? "#4f46e5" : "#eef2f7",
                color: workerGroup === "group" ? "#fff" : "#4b5563",
                fontWeight: 500,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#374151",
              mb: 1,
            }}
          >
            Age Range
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              size="small"
              type="number"
              placeholder="Min"
              value={ageRange[0]}
              onChange={(e) =>
                setAgeRange([Number(e.target.value), ageRange[1]])
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#fafbff",
                },
              }}
            />
            <TextField
              size="small"
              type="number"
              placeholder="Max"
              value={ageRange[1]}
              onChange={(e) =>
                setAgeRange([ageRange[0], Number(e.target.value)])
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#fafbff",
                },
              }}
            />
          </Box>

          {/* Optional tehsil kept intact */}
          {(districtOptions.length > 0 || tehsil) && (
            <>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  mb: 1,
                }}
              >
                Tehsil / Block
              </Typography>
              <Select
                size="small"
                fullWidth
                value={tehsil}
                displayEmpty
                disabled={!district}
                onChange={(e) => setTehsil(e.target.value)}
                sx={{
                  borderRadius: 3,
                  backgroundColor: "#fafbff",
                  mb: 2,
                }}
              >
                <MenuItem value="">Select Tehsil / Block</MenuItem>
                {tehsilOptions.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={applyFilters}
            sx={{
              mt: 1,
              borderRadius: 3,
              height: 46,
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(90deg, #4f46e5, #5b3df5)",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(90deg, #4338ca, #4f46e5)",
                boxShadow: "none",
              },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      )}

      {/* Agents List */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          maxHeight: isMobile ? "unset" : "calc(100vh - 120px)",
          overflowY: isMobile ? "visible" : "auto",
          pr: { xs: 0, md: 0.5 },
        }}
      >
        {isLimitExhausted && !isExpired && (
          <Box sx={{ mb: 1.5 }}>
            <PricingBanner userRole={user?.userRole} />
          </Box>
        )}

        {loading ? (
          <Box
            sx={{
              minHeight: "28vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              backgroundColor: "#fff",
              borderRadius: 4,
              border: "1px solid #e8edf5",
            }}
          >
            <CircularProgress size={34} />
            <Typography fontSize={13} color="#6b7280">
              Fetching best matches for you...
            </Typography>
          </Box>
        ) : agents.length === 0 ? (
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 4,
              border: "1px solid #e8edf5",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#6b7280",
              }}
            >
              No workers or agents found for the selected filters.
            </Typography>
          </Box>
        ) : (
          agents.map((agent) => {
            const areas = Array.isArray(agent?.areasOfWork)
              ? agent.areasOfWork.flatMap((item) =>
                  typeof item === "string" && item.startsWith("[")
                    ? JSON.parse(item)
                    : item
                )
              : [];

            return (
              <Box sx={{
                 borderRadius: "18px",
                  backgroundColor: "#fff",
                  border: "1px solid #e8edf5",
              }}>
          
              <Box
                key={agent._id}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: { xs: 1.5, md: 2 },
                  mb: 1.5,
                 
                  boxShadow: "0 4px 18px rgba(15,23,42,0.05)",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                
                {/* Avatar / meta */}
                <Box
                  sx={{
                    minWidth: { xs: "100%", sm: 92 },
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    alignItems: "center",
                    gap: 1.2,
                  }}
                >
                  <Avatar
                    src={
                      agent?.profilePhoto
                        ? `${config.FILE_BASE_URL}/${agent.profilePhoto}`.replace(
                            /([^:]\/)\/+/g,
                            "$1"
                          )
                        : "/usericon.png"
                    }
                    sx={{
                      width: 72,
                      height: 72,
                      border: agent?.veryfiedBage
                        ? "2px solid #4f46e5"
                        : "2px solid #c7d2fe",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      textAlign: { xs: "left", sm: "center" },
                    }}
                  >
                    {agent?.dob ? `${getAge(agent.dob)} yrs` : ""}
                    {agent?.gender ? ` • ${agent.gender}` : ""}
                  </Typography>
                </Box>

                {/* Main content */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.15rem" },
                      fontWeight: 700,
                      color: "#1f2a44",
                      lineHeight: 1.2,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                      flexWrap: "wrap",
                    }}
                  >
                    {formatName(agent?.name)}
                    <RatingStars rating={agent?.rating} size={14} />
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.86rem",
                      color: "#64748b",
                      mt: 0.4,
                    }}
                  >
                    📍 {agent.district}, {agent.state}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.2 }}>
                    <Chip
                      label={agent?.role === "Agent" ? "Worker" : "Worker"}
                      size="small"
                      sx={{
                        backgroundColor: "#eef2ff",
                        color: "#3b82f6",
                        fontWeight: 700,
                        borderRadius: "999px",
                      }}
                    />
                    <Chip
                      label={formatAreas(areas) || "Any Work"}
                      size="small"
                      sx={{
                        backgroundColor: "#eef2f7",
                        color: "#4b5563",
                        fontWeight: 600,
                        maxWidth: "100%",
                        height: "auto",
                        "& .MuiChip-label": {
                          whiteSpace: "normal",
                          display: "block",
                          py: 0.4,
                        },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      mt: 1.6,
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {unlockedPhones[agent._id] ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          href={`tel:${unlockedPhones[agent._id]}`}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2.5,
                            px: 2,
                            fontWeight: 700,
                            backgroundColor: "#4f46e5",
                            boxShadow: "none",
                            "&:hover": {
                              backgroundColor: "#4338ca",
                              boxShadow: "none",
                            },
                          }}
                        >
                          View Contact
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          href={`https://wa.me/91${unlockedPhones[agent._id]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            textTransform: "none",
                            borderRadius: 2.5,
                            px: 2,
                            fontWeight: 700,
                            backgroundColor: "#16a34a",
                            boxShadow: "none",
                            "&:hover": {
                              backgroundColor: "#15803d",
                              boxShadow: "none",
                            },
                          }}
                        >
                          WhatsApp
                        </Button>
                      </>
                    ) : user?.isSubscribed ? (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleViewNumber(agent._id)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2.5,
                          px: 2,
                          fontWeight: 700,
                          backgroundColor: "#4f46e5",
                          boxShadow: "none",
                          "&:hover": {
                            backgroundColor: "#4338ca",
                            boxShadow: "none",
                          },
                        }}
                      >
                        View Contact
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleUnlock(agent._id)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2.5,
                          px: 2,
                          fontWeight: 700,
                          backgroundColor: "#64748b",
                          boxShadow: "none",
                          "&:hover": {
                            backgroundColor: "#475569",
                            boxShadow: "none",
                          },
                        }}
                      >
                        Unlock to Connect
                      </Button>
                    )}
                  </Box>

                  {user?.isSubscribed && (
                    <Box sx={{ mt: 1.5, maxWidth: 240 }}>
                      <Select
                        size="small"
                        fullWidth
                        displayEmpty
                        value={callStatus[agent._id] || ""}
                        disabled={savingStatus[agent._id]}
                        onChange={(e) =>
                          saveCallStatus(agent._id, e.target.value)
                        }
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fafbff",
                          fontSize: "0.82rem",
                        }}
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Typography
                                sx={{
                                  fontSize: "0.78rem",
                                  fontWeight: 600,
                                  color: "#64748b",
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
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "#6b7280",
                            mt: 0.5,
                          }}
                        >
                          Saving call status...
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
          
              </Box>
                    {agent?.role === "Agent" && (
<Box
  sx={{
    mb: 1.5,
    p: 1.6,
    borderRadius: 3,
    background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
    border: "1px solid #c7d2fe",
    boxShadow: "0 4px 12px rgba(79,70,229,0.08)",
  }}
>
  <Typography
    sx={{
      fontWeight: 700,
      fontSize: "0.95rem",
      color: "#3730a3",
      display: "flex",
      alignItems: "center",
      gap: 0.6,
    }}
  >
    👥 Agent-Managed Worker Groups Available
  </Typography>

  <Typography
    sx={{
      fontSize: "0.8rem",
      color: "#4b5563",
      mt: 0.4,
      lineHeight: 1.5,
    }}
  >
    Ideal for <b>companies, contractors, and agencies</b> looking to hire 
    <b> multiple skilled or unskilled workers quickly</b>.  
    These workers are organized and coordinated by experienced agents, ensuring 
    <b> faster deployment, reliable workforce management, and smoother operations</b>.
  </Typography>
</Box>
)}
              </Box>
            );
          })
        )}

        {!loading && loadingMore && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <CircularProgress size={28} />
          </Box>
        )}
      </Box>
    </Box>
  </Box>
);
};

export default VerifiedAgentsPage;

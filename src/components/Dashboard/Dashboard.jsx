import React, { useContext, useState, useEffect, useRef } from "react";
import qs from "qs";
import RequestWorkers from "../Job/RequestWorkers";
import Chat from "../Chat/chat";
import Slide from "@mui/material/Slide";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentIcon from "@mui/icons-material/Payment";
import axios from "../../utils/axiosConfig";
import ContactButtons from "./ContactButtons"; // Import the new ContactButtons component
// import DiwaliPopup from "../Home/DiwaliPopup";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTheme, useMediaQuery } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AboutWorkSection from "./AboutWorkSection";
import AboutWork from "./AboutWork";
import RoleTabs from "./RoleTabs";
import config from "../../config";
import CallIcon from "@mui/icons-material/Call";
import StarIcon from "@mui/icons-material/Star";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import WorkIcon from "@mui/icons-material/Work";
import InfoIcon from "@mui/icons-material/Info";
import CheckIcon from "@mui/icons-material/Check";
import { translateFromJson } from "./Transform";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Badge from "@mui/material/Badge";
import ConfirmationDialog from "../ConfirmationDialog";
import PathLocationModal from "./pathLocationModel"; // Make sure path/case is correct
import { useConfirm } from "../../hook/confirmHook";
import DashboardCharts from "./DashboardCharts";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";
import HistoryIcon from "@mui/icons-material/History"; // Make sure this is imported
import RequirementsPage from "./RequirementsPage";
import SubscriptionPatti from "./SubscriptionPatti";
import ServiceBoxGrid from "./ServiceBoxGrid";
import CloserSummaryModal from "./CloserSummaryModal";
import SubscriptionModel from "./SubscriptionModel";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { SupportAgent } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import InviteForWorkHeader from "./InviteForWorkHeader";
import Location from "../Location";
import Collapse from "@mui/material/Collapse";
import EmployerSubscriptionDialog from "./EmployerSubscriptionDialog";

const blink = keyframes`
  0%, 100% { background-color: transparent; }
  50% { background-color: rgba(9, 37, 35, 0.1); }
`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import {
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  IconButton,
  Alert,
  Divider,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  ButtonBase,
} from "@mui/material";

import {
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import AgentAssignModal from "./AgentAssignModal"; // adjust path if needed
import { io } from "socket.io-client";
// const socket = io(config.API_BASE_URL, {
//   withCredentials: true,
// });
const socket = io(config.API_BASE_URL, {
  path: "/app/socket.io", // <--- THIS IS THE KEY FIX
  withCredentials: true,
  transports: ["websocket", "polling"], // ✅ MATCH BACKEND
});
const styles = {
  "@keyframes blinker": {
    "50%": { opacity: 0 },
  },
};
const Dashboard = ({ stream, index }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showBenefits, setShowBenefits] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const availableRoles = JSON.parse(
    localStorage.getItem("availableRoles") || "[]",
  );
  const {
    isOpen,
    message,
    requestConfirm,
    handleDialogConfirm,
    handleDialogCancel,
  } = useConfirm();
  const [openChatIds, setOpenChatIds] = useState(new Set());
  const { isAuthorized, user, setUser } = useContext(Context);
  const [interestedMap, setInterestedMap] = useState({});
  const navigateTo = useNavigate();
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [statementOfWorkData, setSelectedStream] = useState([]); // Store selected stream data
  const [currentReq, setCurrentReq] = useState([]);
  const wageInputRefs = useRef({});
  const [attendanceStats, setAttendanceStats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryActive, setSearchQueryActive] = useState("");
  const [searchQueryAll, setSearchQueryAll] = useState("");
  const [subscriptionOpen, setSubscriptionOpen] = useState(true);
  const [myJobsCount, setMyJobsCount] = useState(0); // default is 0
  const [requirementTypeOpen, setRrequirementTypeOpen] = useState(false);
  const [limits] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [requirementType, setRequirementType] = useState("");
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const blinkAnimationagent = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;
  const currentLang = i18n.language || "en";
  const [page, setPage] = useState(0); // Page state for pagination
  const [rowsPerPage, setRowsPerPage] = useState(1000); // Number of rows to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0); // Active tab state
  const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);

  const handleSubscriptionClose = () => {
    setSubscriptionOpen(false);
    // Prefer a soft reload if possible
    navigate(0); // Soft reload (React Router v6+)
    // OR fallback:
    // window.location.reload();
  };
  const [isMobiles, setIsMobile] = useState(window.innerWidth <= 768); // 768px breakpoint

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [agents, setAgents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [totalAgents, setTotalAgents] = useState(0);
  const verifiedAgents = agents.filter(
    (agent) => agent.status === "Verified" || agent.status === "Unverified",
  );
  // const displayedAgents = showAll ? verifiedAgents : verifiedAgents.slice(0, 15);
  // Then use it to slice agents:
  const displayedAgents = showAll
    ? verifiedAgents
    : verifiedAgents.slice(0, isMobiles ? 15 : 20);
  useEffect(() => {
    const fetchAgents = async (pageNumber = 1) => {
      if (!user?.state || loading) return;
      setAgentsLoading(true);

      setLoading(true);

      try {
        const res = await axios.get(
          `${config.API_BASE_URL}/api/v1/user/getAllAgents`,
          {
            params: {
              state: user.state,
              page: pageNumber,
              status: ["Verified"], // or ["Verified", "Unverified"]
              limit: 50,
            },
            withCredentials: true,
          },
        );

        if (res.data.success) {
          setAgents((prev) =>
            pageNumber === 1 ? res.data.agents : [...prev, ...res.data.agents],
          );

          // setHasMore(res.data.pagination.hasMore);
          setTotalAgents(res.data.pagination.total);
          setagentLoading(false);
        }
      } catch (err) {
        console.error("Error fetching agents:", err);
      } finally {
        setLoading(false);
        setAgentsLoading(false);
      }
    };

    fetchAgents();
  }, [user?.state]);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      // Show popup only for Agent / SelfWorker
      // AND only if verified badge is NOT purchased
      if (
        (user?.role === "Agent" || user?.role === "SelfWorker") &&
        user?.veryfiedBage === false
      ) {
        i18n.language = "hi";
        i18n.changeLanguage("hi");

        setOpenVerifyDialog(true);
        setSubscriptionOpen(true);
        // setPopupLang(i18n.language === "hi" ? "hi" : "en");
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [user]);

  const handleRequirementSelect = (e) => {
    setRequirementType(e.target.value);
  };
  const getPerHeadWages = (stream, wage, assignedAgentId) => {
    const agentMatch = stream?.intrestedAgents?.find(
      (agent) => agent.agentId === assignedAgentId,
    );
    return agentMatch?.agentRequiredWage ?? wage;
  };

  const handleConfirmReqType = () => {
    setRrequirementTypeOpen(false);

    setRequirementOpen(true);
  };

  useEffect(() => {
    if (!currentReq || currentReq.length === 0) return;
    currentReq
      .filter(
        (stream) =>
          stream.status === "Assigned" && stream?.isAgentAccepted === "Yes",
      )
      .forEach((stream) => {
        requirementbyfilter({
          stream_id: stream?._id,
          finalAgentRequiredWage: stream?.finalAgentRequiredWage,
          isBulk: true,
        });
      });
  }, [currentReq]);

  const handleUnreadCountChange = (postId, count) => {
    setUnreadCounts((prev) => ({ ...prev, [postId]: count }));
  };
  const fetchUnreadCounts = async () => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/v1/chat/unread-counts/${user?._id}`,
      );
      const data = await res.json();
      if (data.success) {
        const counts = {};
        data.counts.forEach(({ postId, unread }) => {
          counts[postId] = unread;
        });
        setUnreadCounts(counts);
      }
    } catch (err) {
      console.error("Failed to fetch unread counts:", err);
    }
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

  useEffect(() => {
    fetchUnreadCounts();
    fetchJobs();
    if (socket.connected) {
      console.log("✅ Already connected to server:", socket.id);
    } else {
      socket.on("connect", () => {
        console.log("✅ Connected to server (on event):", socket.id);
      });
    }

    socket.on("new_message", (data) => {
      if (data.sender !== user?._id) {
        fetchUnreadCounts();
      }
    });

    return () => {
      socket.off("new_message");
      socket.off("connect");
    };
  }, [user?._id]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    fetchRequirements(nextPage, true, limits);
  };

  const toggleChat = (postId) => {
    setOpenChatIds((prev) => {
      const newSet = new Set();

      // If already open, clicking again will close it (i.e., open nothing)
      if (!prev.has(postId)) {
        newSet.add(postId); // Open this one only
      }
      return newSet;
    });

    fetchUnreadCounts(); // Refresh counts
  };

  const getRandom10DigitNumber = () => {
    if (!Math.floor(1000000000 + Math.random() * 9000000000))
      return "**********";
    const str = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const last2 = str.slice(-2);
    return `********${last2}`;
  };
  // Function to handle card click and open the modal
  const handleCardClick = async (stream_id, finalAgentRequiredWage = null) => {
    try {
      await requirementbyfilter({ stream_id, finalAgentRequiredWage });
      setOpen(true);
    } catch (error) {
      console.error("Error fetching attendance by requirement_id:", error);
    }
  };
  const fetchJobs = async () => {
    try {
      const params = user?.role === "Admin" ? {} : { postedBy: user?._id };
      const { data } = await axios.get(
        `${config.API_BASE_URL}/api/v1/job/getmyjobs`,
        {
          withCredentials: true,
          params,
        },
      );
      setMyJobsCount(data?.myJobs?.length || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch jobs");
    }
  };
  const requirementbyfilter = async ({
    stream_id,
    finalAgentRequiredWage,
    isBulk = false,
  } = {}) => {
    try {
      const params = new URLSearchParams();
      if (stream_id) params.append("requirement_id", stream_id);
      if (user?.role === "Employer") {
        params.append("employer_id", user?._id);
      } else if (user?.role === "Agent" || user?.role === "SelfWorker") {
        params.append("agent_id", user?._id);
      }

      const res = await axios.get(
        `${config.API_BASE_URL}/api/v1/attendance/get-by-requirement?${params.toString()}`,
        { withCredentials: true },
      );

      const stats = getRequirementStats(res.data.data);
      console.log("✅ stats ready for", stream_id, stats);

      // ✅ Update progressively — trigger re-render per stream
      setAttendanceStats((prev) => ({
        ...prev,
        [stream_id]: stats,
      }));

      const streamDataArray = res.data.data;
      const finalWage = finalAgentRequiredWage;

      const updatedStreamArray = finalWage
        ? streamDataArray.map((item) =>
            item.number_of_worker > 0
              ? { ...item, finalAgentRequiredWage: finalWage }
              : item,
          )
        : streamDataArray;

      setSelectedStream(updatedStreamArray);

      if (!isBulk) return stats;
    } catch (error) {
      console.error("❌ Error fetching attendance by requirement_id:", error);
    }
  };

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const getRequirementStats = (data) => {
    const result = {};

    data
      .filter((entry) => entry.employer_accepted === true) // Filter by employer_accepted
      .forEach((entry) => {
        const requirementId = entry.requirement_id;
        const createdDate = new Date(entry.createdAt)
          .toISOString()
          .split("T")[0];
        const sendDate = new Date(entry.send_date_time || entry.createdAt)
          .toISOString()
          .split("T")[0];

        if (!result[requirementId]) {
          result[requirementId] = {
            attendancedetails_requirement_id: requirementId,
            attendancedetails_total_workers: 0,
            attendancedetails_workers_today: 0,
            attendancedetails_work_dates: new Set(),
          };
        }

        // Total workers
        result[requirementId].attendancedetails_total_workers +=
          entry.number_of_worker;

        // Workers sent today
        if (sendDate === today) {
          result[requirementId].attendancedetails_workers_today +=
            entry.number_of_worker;
        }

        // Track unique dates
        result[requirementId].attendancedetails_work_dates.add(createdDate);
      });

    // Convert Set to count of days
    const finalStats = Object.values(result).map((item) => ({
      ...item,
      attendancedetails_total_work_days: item.attendancedetails_work_dates.size,
    }));

    return finalStats;
  };

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLocationClick = (lat, lng) => {
    console.log({ lat, lng });
    setSelectedLocation({ lat, lng });
    setModalOpen(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };
  useEffect(() => {
    if (Array.isArray(currentReq?.intrestedAgents) && user?._id) {
      setIsInterested(currentReq.intrestedAgents.includes(user?._id));
    }
  }, [currentReq]);
  const handleExpressInterest = async (req_id, wage, minwage) => {
    try {
      if (user?.status === "Unverified") {
        toast.error(
          `${t("kycNotVerifiedMessage")} ${t("kycVerificationInstructions")}`,
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
        { withCredentials: true },
      );
      if (res.data.success) {
        setInterestedMap((prev) => ({ ...prev, [req_id]: true }));
      }
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Error expressing interest", err);
    }
  };

  // Close modal
  const handleClose = async () => {
    setOpen(false);
    setOpenVerifyDialog(false);
    setSubscriptionOpen(false);
  };

  const [wagesMap, setWagesMap] = useState({});
  const [workerCounts, setWorkerCounts] = useState({});
  const [showWelcome, setShowWelcome] = useState(currentReq.length === 0);
  const wageValidationTimeouts = useRef({});

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
  const hasUserShownInterest = (stream, userId) => {
    return stream.intrestedAgents?.some(
      (agent) => agent?.agentId?.toString?.() === userId?.toString(),
    );
  };
  const [agentloading, setagentLoading] = useState(false);

  const getUserWage = (stream, userId) => {
    const agentEntry = stream.intrestedAgents?.find(
      (agent) => agent?.agentId?.toString?.() === userId?.toString(),
    );
    return agentEntry?.agentRequiredWage || "";
  };
  const fetchRequirements = async (
    page = 1,
    append = false,
    limit = null,
    search = "",
  ) => {
    setLoading(true);
    setRequirementsLoading(true);

    try {
      let url = `${config.API_BASE_URL}/api/v1/application`;
      // ✅ Base params
      let params = { page };

      // ✅ Only include limit if it's not null
      if (limit !== null) {
        params.limit = limit;
      }

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
      // Add search param if provided
      if (search && search.trim() !== "") {
        console.log("Searching for:", search);
        setLoading(true);

        params.search = search.trim();
      }
      const res = await axios.get(url, {
        params,
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
        withCredentials: true,
      });

      const { requirements = [], pagination = {} } = res.data;
      const { totalPages = 1, currentPage = 1 } = pagination;

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

      // Append or replace
      setCurrentReq((prev) =>
        append ? [...prev, ...transformedData] : transformedData,
      );

      // Track pagination
      setHasMore(currentPage < totalPages);
      setCurrentPage(currentPage);
    } catch (err) {
      console.error("Failed to fetch requirements:", err);
    } finally {
      setLoading(false);
      setRequirementsLoading(false);
    }
  };

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (user?._id && user?.role) {
      isFirstLoad.current = false;
      fetchRequirements(); // ✅ Initial Fetch
    }

    // 🚀 Socket Listener
    const handleNewRequirement = (data) => {
      console.log("Socket Event Received:", data);

      // ✅ Employer check
      if (user?.role === "Employer" && data.employerId === user._id) {
        fetchRequirements();
      }

      // ✅ Agent check (based on district)
      if (user?.role === "Agent" && data.district === user.district) {
        fetchRequirements();
      }
    };

    socket.on("new-requirement", handleNewRequirement);

    return () => {
      socket.off("new-requirement", handleNewRequirement);
    };
  }, [user]);

  useEffect(() => {
    if (!isAuthorized && !user) {
      navigateTo("/landing");
    }
  }, [isAuthorized, navigateTo, user]);

  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility

  const handlePayment = async () => {
    try {
      setLoading(true);

      const totalAmount = user.role === "Agent" ? 199 : 49; // ✅ fixed amount
      const gstCharges = 0; // ❌ no GST

      const response = await axios.post(
        `${config.API_BASE_URL}/api/v1/payment/add-trans`,
        {
          employerId: user?._id,
          firstName: user?.name || "",
          email: user?.email || "",
          employer_phone: user?.phone || "",
          paymentType: "verifiedbadge", // ✅ updated payment type
          amount: totalAmount,
          gstCharges,
          productName: "Verified Badge",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (response.data?.url) {
        localStorage.setItem("pendingOrderId", response.data.merchantOrderId);

        setTimeout(() => {
          window.open(response.data.url, "_self");
        }, 500);
      } else {
        toast.error("Payment URL not received");
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
      toast.error("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle the button click
  const handleApproveClick = async (id) => {
    try {
      const confirmed = await requestConfirm(t("areYouSureApproveAttendance"));

      if (!confirmed) return;

      const res = await axios.put(
        `${config.API_BASE_URL}/api/v1/attendance/update-requ?id=${id}`,
        { employer_accepted: true },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success("Attendance approved successfully!");
        setOpen(false);
        // refresh data if needed
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const searchTimeout = useRef(null);

  const updateRequirementStatus = async (id, status) => {
    try {
      const confirmed = await requestConfirm(
        "Are you sure you want to perform this action?",
      );
      if (confirmed) {
        const res = await axios.put(
          `${config.API_BASE_URL}/api/v1/application/update-status?id=${id}&status=${status}`,
          {},
          {
            withCredentials: true,
          },
        );
        console.log("✅ Success:", res.data);
        toast.success("Status updated successfully");
        fetchRequirements();
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Failed to update status");
      throw error;
    }
  };

  const [pendingSendData, setPendingSendData] = useState(null);

  const handleConfirm = async () => {
    if (pendingSendData) {
      try {
        const response = await axios.post(
          `${config.API_BASE_URL}/api/v1/attendance/add-attendance`,
          {
            agentId: pendingSendData?.agentId,
            streamId: pendingSendData?.streamId,
            numberOfWorkers: pendingSendData?.numberOfWorkers,
            perWorkerRate: pendingSendData?.perWorkerRate ?? 0,
            agentName: pendingSendData?.assignedAgentName,
            employerName: pendingSendData?.employerName ?? "Default Employer",
            workLocation: pendingSendData?.workLocation ?? "",
            ern: pendingSendData?.ern,
            employer_id: pendingSendData?.employer_id,
          },
          { withCredentials: true },
        );
        if (response.data.success) {
          toast.success("Attendance sent successfully");
        }
        toast.success;
      } catch (error) {
        console.error("Error while sending attendance:", error);
      }
    }
    setOpenDialog(false);
    setPendingSendData(null); // Clear after done
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setPendingSendData(null); // Cancelled, clear data
  };

  const [assignOpenModal, setAssignOpenModal] = useState(false);
  const [assignSelectedErn, setAssignSelectedErn] = useState(null);
  const [assignSelectedDistrict, setAssignSelectedDistrict] = useState("");
  const [assignAgentList, setAssignAgentList] = useState([]);
  const [intrestedAgentList, setintrestedAgentList] = useState([]);

  const handleAssignOpenModal = async (ern, district, intrestedAgents) => {
    setAssignSelectedErn(ern);
    setAssignSelectedDistrict(district);

    try {
      const { data } = await axios.get(
        `${config.API_BASE_URL}/api/v1/user/getAllAgents`,
        {
          params: {
            city: district,
            // or use state if needed too
            state: "All",
          },
          withCredentials: true,
        },
      );

      setAssignAgentList(data.agents);
      setAssignOpenModal(true);
      setintrestedAgentList(intrestedAgents);
    } catch (error) {
      toast.error("Failed to fetch agents");
    }
    setAssignOpenModal(true);
  };

  const handleAssignCloseModal = () => {
    setAssignOpenModal(false);
    setAssignSelectedErn(null);
    setAssignSelectedDistrict("");
    setAssignAgentList([]);
  };

  const handleAssignAgent = async (
    agentId,
    name,
    phone,
    ern,
    agentRequiredWage,
  ) => {
    try {
      handleAssignCloseModal();
      const confirmed = await requestConfirm(t("confirmAcceptMessage"));
      if (confirmed) {
        await axios.put(
          `${config.API_BASE_URL}/api/v1/application/assign`,
          {
            agentId,
            ern: ern,
            assignedAgentName: name,
            assignedAgentPhone: phone,
            finalAgentRequiredWage: agentRequiredWage,
          },
          { withCredentials: true },
        );
        toast.success("Agent assigned");
        fetchRequirements();
      }
    } catch (error) {
      toast.error("Assignment failed");
    }
  };
  const handleReject = async (agentId, ern) => {
    try {
      const confirmed = await requestConfirm(
        "Are you sure you want to perform this action?",
      );
      if (confirmed) {
        const response = await axios.put(
          `${config.API_BASE_URL}/api/v1/application/unassignOrAccept`,
          {
            agentId,
            ern,
            isAgentAccepted: "No", // Mark as rejected
          },
          { withCredentials: true },
        );
        toast.success("Agent rejected successfully");
        fetchRequirements();
      }
    } catch (error) {
      toast.error("Agent rejection failed");
    }
  };
  const handleAccept = async (agentId, ern) => {
    try {
      const confirmed = await requestConfirm(
        "Are you sure you want to perform this action?",
      );
      if (confirmed) {
        const response = await axios.put(
          `${config.API_BASE_URL}/api/v1/application/unassignOrAccept`,
          {
            agentId,
            ern,
            isAgentAccepted: "Yes", // Mark as accepted
          },
          {
            headers: {
              "Content-Type": "application/json", // Ensure Content-Type is set to 'application/json'
            },
            withCredentials: true,
          },
        );
        toast.success("Agent accepted successfully");
        fetchRequirements();
      }
    } catch (error) {
      toast.error("Agent acceptance failed");
    }
  };

  const handleCloseRequirement = async (id) => {
    try {
      await updateRequirementStatus(id, "Closed");
      // Optionally refresh data or update UI
      console.log("Requirement closed");
    } catch (error) {
      console.error("Failed to close requirement");
    }
  };

  const [loading, setLoading] = useState(false); // State to simulate loading

  const handleSelectClose = () => {
    setAnchorEl(null); // Close dropdown when an option is selected or canceled
  };
  const workerInputRef = useRef({});

  const handleSendWorker = (
    ern,
    streamId,
    agentName,
    agentId,
    agentPhone,
    workLocation,
    numberOfWorkers,
    perWorkerRate,
    employerName,
    employerPhone,
    assignedAgentPhone,
    assignedAgentName,
    employer_id,
  ) => {
    if (!workerCounts[streamId] || Number(workerCounts[streamId]) === 0) {
      toast.error(t("numberworker"));
      workerInputRef.current[streamId]?.focus();
      return;
    }
    // Store data and open confirmation dialog
    setPendingSendData({
      ern,
      streamId,
      agentName,
      agentId,
      agentPhone,
      workLocation,
      numberOfWorkers,
      perWorkerRate,
      employerName,
      employerPhone,
      assignedAgentPhone,
      assignedAgentName,
      employer_id,
    });
    setOpenDialog(true);
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value); // Update selected value
    handleSelectClose(); // Close the dropdown after selection
  };

  const [requirementOpen, setRequirementOpen] = useState(false); // Controls modal visibility
  const [requirementTitle, setRequirementTitle] = useState(""); // Stores the title input for the requirement
  const [requirementDescription, setRequirementDescription] = useState(""); // Stores the description input for the requirement
  const [isCloserModalOpen, setIsCloserModalOpen] = useState(false);
  const [payReq, setReqIdPay] = useState({});

  const handleOpenCloserModal = (
    req_id_pay,
    perheadPay,
    req_type,
    agentId,
    stat,
    ernNumber,
  ) => {
    setIsCloserModalOpen(true);
    setReqIdPay({ req_id_pay, perheadPay, req_type, agentId, stat, ernNumber });
  };

  const handleCloseCloserModal = () => setIsCloserModalOpen(false);
  // Open the modal
  const handleRequirementOpen = () => {
    if (user?.isSubscribed) {
      setRrequirementTypeOpen(true);
    } else {
      navigate("/pricing"); // 👉 adjust route if needed
    }
  };

  // Close the modal
  const handleRequirementClose = () => {
    // fetchRequirements();
    setRequirementOpen(false);
    setRrequirementTypeOpen(false);
  };

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

  const isPageLoading = requirementsLoading || agentsLoading;

  const getBestMatchingImage = (workType) => {
    if (!workType) return "/app/General.jpg"; // fallback

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

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh", // full viewport height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: { xs: "none", sm: "block" }, // Hide on xs (extra small screens) and show on larger screens
        }}
      />
      <Box
        className="dash-box"
        sx={{
          margin: "auto",
          zIndex: 1,
          position: "relative",
        }}
      >
        <Grid container sx={{ mb: 10, px: 0 }}>
          {/* Conditional Rendering Based on User Role */}

          {user?.role === "SuperAdmin" && (
            <Box sx={{ width: "100%", overflow: "hidden" }}>
              <DashboardCharts />
            </Box>
          )}

          {["Admin", "SuperAdmin"].includes(user?.role) && (
            <>
              {/* Worker Count Graph */}
              <Grid className="dash-card" item xs={12}>
                <Card
                  className="dash-card"
                  sx={{ boxShadow: 0, borderRadius: 2 }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Grid item xs={12}>
                      <RequirementsPage
                        activeTab={activeTab}
                        unreadCounts={unreadCounts}
                        toggleChat={toggleChat}
                        openChatIds={openChatIds}
                        handleAssignOpenModal={handleAssignOpenModal}
                        handleUnreadCountChange={handleUnreadCountChange}
                        t={t}
                      />
                    </Grid>
                  </Box>
                </Card>
              </Grid>
            </>
          )}
          {user?.role === "Employer" && (
            <>
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 0, borderRadius: 2 }}>
                  <CardContent className="dash-card-content">
                    <Box
                      sx={{
                        mt: 1,
                        mb: 1,
                        px: { xs: 1, sm: 1.2 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexWrap: "wrap",
                          gap: 1,
                          pt: "6px",
                          pb: 0.8,
                          px: 1,
                          borderRadius: 3,
                          background:
                            "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                          border: "1px solid #dbeafe",
                          boxShadow: "0 8px 24px rgba(25, 118, 210, 0.08)",
                        }}
                      >
                        <Location />
                      </Box>

                      {user?.isSubscribed && user?.subscriptionExpery && (
                        <Box sx={{ mt: 1 }}>
                          <SubscriptionPatti expiry={user.subscriptionExpery} />
                        </Box>
                      )}

                      {user?.status === "Unverified" && (
                        <Alert
                          severity="warning"
                          sx={{
                            mt: 1,
                            mb: 0.5,
                            borderRadius: 3,
                            border: "1px solid #fde68a",
                            borderLeft: "6px solid #f59e0b",
                            background:
                              "linear-gradient(90deg, rgba(255,248,220,1) 0%, rgba(255,251,235,1) 100%)",
                            color: "#7c2d12",
                            fontSize: "0.88rem",
                            boxShadow: "0 8px 20px rgba(245, 158, 11, 0.10)",
                            py: 0.8,
                            px: 1.2,
                            display: "flex",
                            alignItems: "center",

                            "& .MuiAlert-icon": {
                              alignItems: "center",
                              mt: "1px",
                              color: "#f59e0b",
                            },

                            "& .MuiAlert-message": {
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start", // ✅ left aligned
                              flexWrap: "nowrap", // ✅ prevent line break
                              gap: "6px",
                              p: 0,
                              textAlign: "left",
                              lineHeight: 1.6,
                            },
                          }}
                        >
                          {t("kycNotVerifiedMessage")}{" "}
                          {t("kycVerificationInstructions")}
                          <Box
                            component="span"
                            onClick={() => navigateTo("/my/profile")}
                            sx={{
                              color: "#d84315",
                              fontWeight: 800,
                              cursor: "pointer",
                              textDecoration: "none",
                              px: 0.6,
                              py: 0.15,
                              borderRadius: 1.5,
                              backgroundColor: "rgba(216, 67, 21, 0.08)",
                              animation: "blinkUpload 1.5s infinite",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                color: "#bf360c",
                                backgroundColor: "rgba(216, 67, 21, 0.14)",
                              },
                              "@keyframes blinkUpload": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0.45 },
                                "100%": { opacity: 1 },
                              },
                            }}
                          >
                            {t("upload")}
                          </Box>
                        </Alert>
                      )}
                    </Box>
                    <ServiceBoxGrid />

                    <Box
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        background:
                          "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                        border: "1px solid #dbeafe",
                        boxShadow: "0 10px 28px rgba(25, 118, 210, 0.08)",
                        mb: 1.5,
                      }}
                    >
                      <Divider
                        sx={{
                          borderColor: "#1876d2",
                          borderBottomWidth: "4px",
                          opacity: 1,
                        }}
                      />

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          px: 1.2,
                          py: 1.1,
                          gap: 1,
                        }}
                      >
                        {/* Left title section */}
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            className="dash-head"
                            variant="h6"
                            sx={{
                              mb: 0,
                              p: 0,
                              ml: "3px",
                              lineHeight: 1.15,
                              fontWeight: 800,
                              fontSize: { xs: "1rem", sm: "1.1rem" },
                              color: "#0f172a",
                            }}
                          >
                            {user?.isSubscribed === false ||
                            currentReq.length === 0 ||
                            currentReq.every(
                              (req) => req.status === "Assigned",
                            ) ? (
                              <>
                                {t("agentnearyoudash")}
                                <Box
                                  component="span"
                                  sx={{
                                    display: "block",
                                    color: "#64748b",
                                    fontSize: "0.82rem",
                                    fontWeight: 500,
                                    mt: 0.35,
                                  }}
                                >
                                  {t("reqpostdash")}
                                </Box>
                              </>
                            ) : (
                              <>
                                {t("myRequirement")}
                                <Box
                                  component="span"
                                  sx={{
                                    display: "block",
                                    color: "#64748b",
                                    fontSize: "0.82rem",
                                    fontWeight: 500,
                                    mt: 0.35,
                                  }}
                                >
                                  {t("reqpostdash")}
                                </Box>
                              </>
                            )}
                          </Typography>
                        </Box>

                        {/* Right actions section */}
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            p: 0,
                            m: 0,
                            gap: 1,
                            flexShrink: 0,
                          }}
                        >
                          {/* History + Refresh */}
                          <Stack
                            direction="row"
                            spacing={0.8}
                            sx={{
                              mr: "4px",
                              alignItems: "center",
                            }}
                          >
                            {/* History Button */}
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                px: 0.8,
                                py: 0.6,
                                borderRadius: 2,
                                backgroundColor: "#eff6ff",
                                border: "1px solid #dbeafe",
                                minWidth: 54,
                              }}
                            >
                              <IconButton
                                onClick={() => navigate("/history")}
                                aria-label="History"
                                color="primary"
                                sx={{
                                  p: 0,
                                  m: 0,
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                              >
                                <HistoryIcon
                                  sx={{ p: 0, m: 0, fontSize: 20 }}
                                />
                              </IconButton>
                              <Typography
                                variant="caption"
                                sx={{
                                  mt: 0.3,
                                  lineHeight: 1,
                                  fontSize: "0.68rem",
                                  fontWeight: 600,
                                  color: "#334155",
                                }}
                              >
                                {t("history")}
                              </Typography>
                            </Box>

                            {/* Refresh Button */}
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                px: 0.8,
                                py: 0.6,
                                borderRadius: 2,
                                backgroundColor: "#eff6ff",
                                border: "1px solid #dbeafe",
                                minWidth: 54,
                              }}
                            >
                              <IconButton
                                aria-label="Refresh"
                                color="primary"
                                onClick={() => {
                                  toast.success("Refreshed");
                                  setTimeout(() => {
                                    fetchRequirements();
                                  }, 500);
                                }}
                                sx={{
                                  p: 0,
                                  m: 0,
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                              >
                                <RefreshIcon
                                  sx={{ p: 0, m: 0, fontSize: 20 }}
                                />
                              </IconButton>
                              <Typography
                                variant="caption"
                                sx={{
                                  mt: 0.3,
                                  lineHeight: 1,
                                  fontSize: "0.68rem",
                                  fontWeight: 600,
                                  color: "#334155",
                                }}
                              >
                                {t("refresh")}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Post Requirement Button */}
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              py: 0.7,
                              px: 1.6,
                              fontSize: "0.76rem",
                              lineHeight: 1,
                              minHeight: "34px",
                              borderRadius: "10px",
                              textTransform: "none",
                              fontWeight: 700,
                              color: "#fff",
                              background:
                                "linear-gradient(90deg, #1b76d3 0%, #185a9d 100%)",
                              boxShadow: "0 6px 18px rgba(27, 118, 211, 0.24)",
                              animation: `${blink} 1s infinite`,
                              "&:hover": {
                                background:
                                  "linear-gradient(90deg, #185a9d 0%, #144b80 100%)",
                                boxShadow:
                                  "0 8px 22px rgba(27, 118, 211, 0.30)",
                              },
                            }}
                            startIcon={<AddCircleIcon sx={{ fontSize: 15 }} />}
                            onClick={handleRequirementOpen}
                          >
                            {t("postRequirement")}
                          </Button>
                        </Box>
                      </Box>

                      <Divider
                        sx={{
                          borderColor: "#1876d2",
                          borderBottomWidth: "4px",
                          opacity: 1,
                        }}
                      />
                    </Box>
                    {isPageLoading ? (
                      /* 🔥 SINGLE LOADER FOR ENTIRE PAGE */
                      <Box
                        sx={{
                          minHeight: "20vh",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <CircularProgress size={42} />
                        <Typography fontSize={13} color="text.secondary">
                          Loading best matches for you…
                        </Typography>
                      </Box>
                    ) : (
                      <Grid sx={{ mt: 0.5 }} container spacing={2}>
                        {currentReq.length === 0 ||
                        currentReq.every((req) => req.status === "Assigned") ? (
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                borderRadius: "28px",
                                background:
                                  "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
                                px: { xs: 1.5, sm: 2.5, md: 3 },
                                py: { xs: 2, sm: 2.5, md: 3 },
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  mb: 2.5,
                                  flexWrap: "wrap",
                                  gap: 1.2,
                                }}
                              >
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: { xs: "1.05rem", sm: "1.2rem" },
                                      fontWeight: 800,
                                      color: "#0f172a",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    Verified Agents/Workers
                                  </Typography>
                                </Box>
                                <Box
                                  onClick={() => navigate("/verified-agents")}
                                  sx={{
                                    px: 1.5,
                                    py: 0.75,
                                    borderRadius: "999px",
                                    background:
                                      "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                                    color: "#1d4ed8",
                                    fontSize: "0.8rem",
                                    fontWeight: 800,
                                    border: "1px solid #bfdbfe",
                                    cursor: "pointer",
                                  }}
                                >
                                  {totalAgents + 300} Agents/Workers
                                </Box>
                              </Box>

                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: {
                                    xs: "repeat(4, minmax(0, 1fr))",
                                    sm: "repeat(5, minmax(0, 1fr))",
                                    md: "repeat(6, minmax(0, 1fr))",
                                    lg: "repeat(8, minmax(0, 1fr))",
                                    xl: "repeat(10, minmax(0, 1fr))",
                                  },
                                  gap: { xs: 1, sm: 1.2, md: 1.5 },
                                }}
                              >
                                {agentloading && (
                                  <Box
                                    sx={{
                                      gridColumn: "1 / -1",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      minHeight: 150,
                                      borderRadius: "20px",
                                      border: "1px solid #e2e8f0",
                                      background: "#fff",
                                    }}
                                  >
                                    <CircularProgress />
                                  </Box>
                                )}

                              {displayedAgents.map((agent, idx) => {
  const formattedFirstName = agent?.name
    ? agent.name
        .trim()
        .split(" ")[0]
        .slice(0, 8)
        .charAt(0)
        .toUpperCase() +
      agent.name
        .trim()
        .split(" ")[0]
        .slice(0, 8)
        .slice(1)
        .toLowerCase()
    : "-";

  return (
    <Box
      key={idx}
      onClick={() =>
        navigate("/verified-agents", {
          state: {
            agentId: agent._id,
            source: "verified_agents",
          },
        })
      }
      sx={{
        cursor: "pointer",
        borderRadius: "22px",
        p: { xs: 1, sm: 1.2 },
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(243,248,255,0.95) 100%)",
        border: "1px solid #dbe4f0",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
        transition: "all 0.28s ease",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 58,
          background:
            "linear-gradient(135deg, rgba(219,234,254,0.75) 0%, rgba(236,254,255,0.45) 100%)",
          borderRadius: "22px 22px 0 0",
          zIndex: 0,
        },
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 18px 36px rgba(37, 99, 235, 0.16)",
          borderColor: "#93c5fd",
        },
      }}
    >
      <Stack
        alignItems="center"
        spacing={0.9}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={
              agent?.profilePhoto
                ? `${config.FILE_BASE_URL}/${agent?.profilePhoto}`.replace(
                    /([^:]\/)\/+/g,
                    "$1",
                  )
                : "/usericon.png"
            }
            alt={agent.name}
            sx={{
              width: { xs: 54, sm: 60 },
              height: { xs: 54, sm: 60 },
              border: "3px solid #2563eb",
              boxShadow: "0 12px 28px rgba(37, 99, 235, 0.2)",
              backgroundColor: "#fff",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: -3,
              right: -3,
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              borderRadius: "50%",
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            ✔
          </Box>
        </Box>

        <Typography
          noWrap
          sx={{
            color: "#0f172a",
            fontSize: {
              xs: "0.72rem",
              sm: "0.78rem",
            },
            fontWeight: 800,
            maxWidth: "100%",
            letterSpacing: "-0.01em",
          }}
        >
          {formattedFirstName}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#2563eb",
            fontSize: {
              xs: "0.66rem",
              sm: "0.7rem",
            },
            wordBreak: "break-word",
            fontWeight: 700,
          }}
        >
          {getRandom10DigitNumber()}
        </Typography>

        <Box
          mt={0.2}
          display="flex"
          justifyContent="center"
          sx={{
            px: 0.8,
            py: 0.4,
            borderRadius: "999px",
            background:
              "linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.98) 100%)",
            border: "1px solid #e2e8f0",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const rating = +(4 + Math.random()).toFixed(1);
            const fullStar = i + 1 <= Math.floor(rating);
            const halfStar =
              rating % 1 !== 0 && i + 1 === Math.ceil(rating);

            return (
              <StarIcon
                key={i}
                sx={{
                  fontSize: "12px",
                  color: fullStar
                    ? rating >= 4
                      ? "#22c55e"
                      : "#f59e0b"
                    : halfStar
                      ? "#fbbf24"
                      : "#e5e7eb",
                }}
              />
            );
          })}
        </Box>
      </Stack>
    </Box>
  );
})}

                                {!showAll && verifiedAgents.length > 20 && (
                                  <Box
                                    onClick={() => navigate("/verified-agents")}
                                    sx={{
                                      cursor: "pointer",
                                      borderRadius: "20px",
                                      p: { xs: 1, sm: 1.2 },
                                      background:
                                        "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                                      border: "1px dashed #60a5fa",
                                      boxShadow:
                                        "0 8px 22px rgba(37, 99, 235, 0.10)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      textAlign: "center",
                                      minHeight: { xs: 118, sm: 132 },
                                      transition: "all 0.25s ease",
                                      "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow:
                                          "0 16px 32px rgba(37, 99, 235, 0.16)",
                                        background:
                                          "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                                      },
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        sx={{
                                          fontSize: {
                                            xs: "1rem",
                                            sm: "1.15rem",
                                          },
                                          fontWeight: 800,
                                          color: "#1d4ed8",
                                          lineHeight: 1.2,
                                        }}
                                      >
                                        +{totalAgents + 300 - 8} More
                                      </Typography>
                                      <Typography
                                        sx={{
                                          mt: 0.5,
                                          fontSize: "0.72rem",
                                          fontWeight: 700,
                                          color: "#475569",
                                        }}
                                      >
                                        Verified Agents
                                      </Typography>
                                    </Box>
                                  </Box>
                                )}
                              </Box>

                              {hasMore && (
                                <Box sx={{ textAlign: "center", mt: 3 }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    sx={{
                                      minWidth: 170,
                                      borderRadius: "999px",
                                      textTransform: "none",
                                      fontWeight: 800,
                                      fontSize: "0.95rem",
                                      px: 4,
                                      py: 1.2,
                                      background:
                                        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                      boxShadow:
                                        "0 12px 24px rgba(37, 99, 235, 0.24)",
                                      transition: "all 0.3s ease",
                                      "&:hover": {
                                        boxShadow:
                                          "0 18px 36px rgba(37, 99, 235, 0.30)",
                                        transform: "translateY(-2px)",
                                        background:
                                          "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                                      },
                                      "&:active": {
                                        transform: "scale(0.98)",
                                      },
                                    }}
                                  >
                                    {loading ? "Loading…" : "Load More"}
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        ) : (
                          currentReq
                            .filter(
                              (stream) =>
                                stream?.isAgentAccepted === "No" ||
                                stream?.status !== "Assigned",
                            )
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
                                    p: "4px",
                                    m: "2px",
                                    backgroundImage: `url(${getBestMatchingImage(stream?.workType)})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    border: "1px solid rgba(148,163,184,0.18)",
                                    boxShadow:
                                      "0 18px 50px rgba(15, 23, 42, 0.10)",
                                    transition: "all .25s ease",
                                    "&:hover": {
                                      transform: "translateY(-4px)",
                                      boxShadow:
                                        "0 24px 60px rgba(15, 23, 42, 0.14)",
                                    },

                                    "& > *": {
                                      position: "relative",
                                      zIndex: 2,
                                    },

                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      inset: 0,
                                      background:
                                        "linear-gradient(180deg, rgba(2,6,23,0.72) 0%, rgba(2,6,23,0.88) 100%)",
                                      zIndex: 1,
                                    },

                                    "&::after": {
                                      content: '"BookMyWorker"',
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      fontSize: "2.8rem",
                                      fontWeight: 800,
                                      color: "rgba(255,255,255,0.05)",
                                      zIndex: 0,
                                      pointerEvents: "none",
                                      whiteSpace: "nowrap",
                                    },
                                  }}
                                >
                                  <>
                                    <CardContent className="dash-card-content">
                                      <Box sx={{ mb: 1 }}>
                                        <Grid spacing={2}>
                                          <Grid item xs={12}>
                                            <Box
                                              sx={{
                                                borderRadius: 2,
                                                flexDirection: "column",
                                                minHeight: "170px",
                                                width: "100%",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                  alignItems: "center",
                                                  flexWrap: "wrap",
                                                  rowGap: 1,
                                                  mb: 1.2,
                                                  p: 1,
                                                  borderRadius: "14px",
                                                  background:
                                                    "rgba(255,255,255,0.08)",
                                                  backdropFilter: "blur(8px)",
                                                  border:
                                                    "1px solid rgba(255,255,255,0.08)",
                                                }}
                                              >
                                                {stream.status ===
                                                "Approved" ? (
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      fontWeight: 700,
                                                      cursor: "pointer",
                                                      color: "#aeeaff",
                                                      whiteSpace: "nowrap",
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                      fontSize: "14px",
                                                      flex: "1 1 auto",
                                                      minWidth: 0,
                                                    }}
                                                  >
                                                    {t("ernLabel")}:{" "}
                                                    {stream.ern_num}
                                                  </Typography>
                                                ) : (
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      fontWeight: 700,
                                                      cursor: "pointer",
                                                      color: "#aeeaff",
                                                      whiteSpace: "nowrap",
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                      fontSize: "15px",
                                                      flex: "1 1 auto",
                                                      minWidth: 0,
                                                    }}
                                                    onClick={() =>
                                                      handleAssignOpenModal(
                                                        stream.ern_num,
                                                        stream.city,
                                                        stream?.intrestedAgents,
                                                      )
                                                    }
                                                  >
                                                    {t("ernLabel")}:{" "}
                                                    {stream.ern_num}{" "}
                                                    <span className="blink-clickView">
                                                      {t("clickView")}
                                                    </span>
                                                  </Typography>
                                                )}

                                                <Stack
                                                  direction="row"
                                                  alignItems="center"
                                                  spacing={1}
                                                  sx={{
                                                    flexShrink: 0,
                                                    flexWrap: "wrap",
                                                  }}
                                                >
                                                  <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    sx={{
                                                      padding: "0 8px",
                                                      minHeight: "26px",
                                                      height: "26px",
                                                      fontSize: "0.68rem",
                                                      lineHeight: 1,
                                                      borderRadius: "8px",
                                                      textTransform: "none",
                                                      display: "flex",
                                                      alignItems: "center",
                                                      fontWeight: 700,
                                                      "@media (max-width:600px)":
                                                        {
                                                          padding: "0 5px",
                                                          minHeight: "22px",
                                                          height: "22px",
                                                          fontSize: "0.6rem",
                                                        },
                                                    }}
                                                    startIcon={
                                                      <Badge
                                                        badgeContent={
                                                          unreadCounts[
                                                            stream._id
                                                          ] || 0
                                                        }
                                                        color="error"
                                                        sx={{
                                                          "& .MuiBadge-badge": {
                                                            minWidth: "13px",
                                                            height: "13px",
                                                            fontSize: "0.55rem",
                                                          },
                                                        }}
                                                      >
                                                        <ChatIcon
                                                          sx={{
                                                            fontSize: "13px",
                                                          }}
                                                        />
                                                      </Badge>
                                                    }
                                                    onClick={() =>
                                                      toggleChat(stream._id)
                                                    }
                                                  >
                                                    Chat
                                                  </Button>

                                                  {stream.status ===
                                                  "Approved" ? (
                                                    <Button
                                                      variant="contained"
                                                      color="warning"
                                                      size="small"
                                                      sx={{
                                                        padding: "0 8px",
                                                        minHeight: "26px",
                                                        height: "26px",
                                                        fontSize: "0.68rem",
                                                        lineHeight: 1,
                                                        borderRadius: "8px",
                                                        textTransform: "none",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        "@media (max-width:600px)":
                                                          {
                                                            padding: "0 5px",
                                                            minHeight: "22px",
                                                            height: "22px",
                                                            fontSize: "0.6rem",
                                                          },
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "#15803d",
                                                        },
                                                      }}
                                                      startIcon={
                                                        <CheckIcon
                                                          sx={{
                                                            color: "white",
                                                            fontSize: "13px",
                                                          }}
                                                        />
                                                      }
                                                    >
                                                      {t("Approved")}
                                                    </Button>
                                                  ) : (
                                                    <Button
                                                      variant="contained"
                                                      color="error"
                                                      size="small"
                                                      sx={{
                                                        padding: "0 8px",
                                                        minHeight: "26px",
                                                        height: "26px",
                                                        fontSize: "0.68rem",
                                                        lineHeight: 1,
                                                        borderRadius: "8px",
                                                        textTransform: "none",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        "@media (max-width:600px)":
                                                          {
                                                            padding: "0 5px",
                                                            minHeight: "22px",
                                                            height: "22px",
                                                            fontSize: "0.6rem",
                                                          },
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "#b71c1c",
                                                        },
                                                      }}
                                                      startIcon={
                                                        <CloseIcon
                                                          sx={{
                                                            color: "#fff",
                                                            fontSize: "13px",
                                                          }}
                                                        />
                                                      }
                                                      onClick={() =>
                                                        handleCloseRequirement(
                                                          stream._id,
                                                        )
                                                      }
                                                    >
                                                      {t("close")}
                                                    </Button>
                                                  )}
                                                </Stack>

                                                {openChatIds.has(
                                                  stream._id,
                                                ) && (
                                                  <Chat
                                                    postId={stream?._id}
                                                    senderId={user?._id}
                                                    senderRole={user?.role}
                                                    employerName={"Admin"}
                                                    onClose={() =>
                                                      toggleChat(stream?._id)
                                                    }
                                                    onUnreadCountChange={
                                                      handleUnreadCountChange
                                                    }
                                                  />
                                                )}
                                              </Box>

                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 1,
                                                  mb: 0.8,
                                                }}
                                              >
                                                <LocationCityIcon
                                                  sx={{ color: "#81d4fa" }}
                                                  fontSize="small"
                                                />
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    fontWeight: 700,
                                                    color: "white",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                  }}
                                                >
                                                  {t("district") || "District"}:
                                                </Typography>
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    color: "white",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                  }}
                                                >
                                                  {stream.district}
                                                </Typography>
                                              </Box>

                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 1,
                                                  mb: 0.8,
                                                }}
                                              >
                                                <PlaceIcon
                                                  sx={{ color: "#ffcc80" }}
                                                  fontSize="small"
                                                />
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    fontWeight: 700,
                                                    color: "white",
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                  }}
                                                >
                                                  {t("site")}:
                                                </Typography>
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    color: "white",
                                                    whiteSpace: "normal",
                                                    wordBreak: "break-word",
                                                  }}
                                                >
                                                  {stream.tehsil + " "}
                                                  {stream.site}
                                                </Typography>
                                              </Box>

                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  gap: 1,
                                                  mb: 0.8,
                                                }}
                                              >
                                                <BusinessIcon
                                                  sx={{ color: "#c4b5fd" }}
                                                  fontSize="small"
                                                />
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    fontWeight: 700,
                                                    color: "white",
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                  }}
                                                >
                                                  {t("workType")}:
                                                </Typography>
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    color: "white",
                                                    whiteSpace: "normal",
                                                    wordBreak: "break-word",
                                                    overflowWrap: "anywhere",
                                                    flexGrow: 1,
                                                  }}
                                                >
                                                  {translateFromJson(
                                                    stream?.workType,
                                                    i18n.language,
                                                  )}{" "}
                                                  -{" "}
                                                  {translateFromJson(
                                                    stream?.subCategory,
                                                    i18n.language,
                                                  )}
                                                </Typography>
                                              </Box>

                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 1,
                                                  mb: 0.8,
                                                }}
                                              >
                                                <GroupsIcon
                                                  sx={{ color: "#fde68a" }}
                                                  fontSize="small"
                                                />
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    fontWeight: 700,
                                                    color: "white",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                  }}
                                                >
                                                  {t("requiredWorkers")}:
                                                </Typography>
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    color: "white",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                  }}
                                                >
                                                  {stream.totalWorkers}
                                                </Typography>
                                              </Box>

                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 1,
                                                  mb: 2,
                                                }}
                                              >
                                                <CurrencyRupeeIcon
                                                  sx={{ color: "#bbf7d0" }}
                                                  fontSize="small"
                                                />
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    fontWeight: 700,
                                                    color: "white",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                  }}
                                                >
                                                  {t("perHeadWages")}:
                                                </Typography>
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    color: "white",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                  }}
                                                >
                                                  ₹{" "}
                                                  {getPerHeadWages(
                                                    stream,
                                                    stream?.finalAgentRequiredWage ??
                                                      stream?.max_wages,
                                                    stream?.assignedAgentId,
                                                  )}
                                                </Typography>
                                              </Box>

                                              <Grid item xs={12}>
                                                {[
                                                  {
                                                    key: "accommodationAvailable",
                                                    label: t(
                                                      "accommodationAvailable",
                                                    ),
                                                  },
                                                  {
                                                    key: "foodAvailable",
                                                    label: t("foodAvailable"),
                                                  },
                                                  {
                                                    key: "incentive",
                                                    label: t("incentive"),
                                                  },
                                                  {
                                                    key: "bonus",
                                                    label: t("bonus"),
                                                  },
                                                  {
                                                    key: "transportProvided",
                                                    label:
                                                      t("transportProvided"),
                                                  },
                                                  {
                                                    key: "weeklyOff",
                                                    label: t("weeklyOff"),
                                                  },
                                                  {
                                                    key: "overtimeAvailable",
                                                    label:
                                                      t("overtimeAvailable"),
                                                  },
                                                  {
                                                    key: "insuranceAvailable",
                                                    label:
                                                      t("insuranceAvailable"),
                                                  },
                                                  {
                                                    key: "pfAvailable",
                                                    label: t("pfAvailable"),
                                                  },
                                                  {
                                                    key: "esicAvailable",
                                                    label: t("esicAvailable"),
                                                  },
                                                ]
                                                  .filter(
                                                    (item) =>
                                                      stream?.[item.key] ===
                                                      true,
                                                  )
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

                                              <Box sx={{ mt: 1 }}>
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    borderRadius: "18px",
                                                    background:
                                                      "rgba(255,255,255,0.10)",
                                                    border:
                                                      "1px solid rgba(255,255,255,0.10)",
                                                    p: 1,
                                                  }}
                                                >
                                                  <Button
                                                    fullWidth
                                                    startIcon={<SupportAgent />}
                                                    sx={{
                                                      backgroundColor:
                                                        "#e0f7fa",
                                                      color: "#00796b",
                                                      borderRadius: "14px",
                                                      textTransform: "none",
                                                      fontWeight: 700,
                                                      "&:hover": {
                                                        backgroundColor:
                                                          "#b2ebf2",
                                                      },
                                                    }}
                                                  >
                                                    {t("support")}:{" "}
                                                    <IconButton
                                                      color="primary"
                                                      component="a"
                                                      href="tel:7389791873"
                                                    >
                                                      <CallIcon titleAccess="Call" />
                                                    </IconButton>
                                                  </Button>
                                                </Box>
                                              </Box>
                                            </Box>
                                          </Grid>
                                        </Grid>
                                      </Box>
                                    </CardContent>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                      }}
                                    >
                                      {/* kept empty intentionally */}
                                    </Box>

                                    {stream?.isAgentAccepted === "No" &&
                                      stream?.status === "Assigned" &&
                                      stream?.employerId === user?._id && (
                                        <Box
                                          sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            background:
                                              "linear-gradient(180deg, rgba(2,6,23,0.50) 0%, rgba(2,6,23,0.82) 100%)",
                                            zIndex: 10,
                                            color: "#fff",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            p: 3,
                                            textAlign: "center",
                                            borderRadius: "24px",
                                          }}
                                        >
                                          <Alert
                                            icon={false}
                                            severity="warning"
                                            sx={{
                                              borderRadius: "18px",
                                              boxShadow:
                                                "0 20px 40px rgba(15,23,42,0.20)",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontWeight: 800,
                                                color: "#5a0000",
                                              }}
                                            >
                                              {t("suspendalert")}
                                            </Typography>
                                          </Alert>
                                        </Box>
                                      )}
                                  </>
                                </Card>
                              </Grid>
                            ))
                        )}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
                {currentReq.filter((stream) => stream?.isAgentAccepted !== "No")
                  .length !== 0 ? (
                  <div>
                    <Grid item sx={{ mb: 0 }} xs={12}>
                      <Box sx={{ mb: 1 }}>
                        {/* Top soft divider */}
                        <Box
                          sx={{
                            height: "3px",
                            width: "100%",
                            borderRadius: "999px",
                            background:
                              "linear-gradient(90deg, transparent, #1876d2, #60a5fa, #1876d2, transparent)",
                            opacity: 0.7,
                            mb: 1,
                          }}
                        />

                        {/* Heading */}
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ px: 1 }}
                        >
                          <Typography
                            className="dash-head"
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#1e293b",
                              letterSpacing: "0.3px",
                            }}
                          >
                            {t("activeWorkStream")}
                          </Typography>
                        </Box>

                        {/* Bottom soft divider */}
                        <Box
                          sx={{
                            height: "3px",
                            width: "100%",
                            borderRadius: "999px",
                            background:
                              "linear-gradient(90deg, transparent, #1876d2, #60a5fa, #1876d2, transparent)",
                            opacity: 0.7,
                            mt: 1,
                          }}
                        />
                      </Box>
                      <Card sx={{ boxShadow: 0, borderRadius: 2 }}>
                        <CardContent
                          sx={{ p: 0 }}
                          className="dash-card-content"
                        >
                          <Grid sx={{ mt: 0.5 }} container spacing={0.5}>
                            {currentReq.filter(
                              (stream) => stream?.isAgentAccepted !== "No",
                            ).length === 0 ? (
                              <Grid item xs={12}>
                                <Box
                                  sx={{
                                    height: "280px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundImage: {
                                      xs: `url("${config.FILE_BASE_URL}/ImagesWeb/emp-head-mob.jpg")`, // Mobile view
                                      sm: `url("${config.FILE_BASE_URL}/ImagesWeb/emp_head.png")`, // Tablets and up
                                    },
                                    backgroundSize: {
                                      xs: "cover",
                                      sm: "initial",
                                    },
                                    // or "contain" depending on your need
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    borderRadius: 2,
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ fontSize: "0.875rem" }} // Adjust font size as needed
                                  >
                                    {/* {t("detailsNotAvailable")} */}
                                  </Typography>
                                </Box>
                              </Grid>
                            ) : (
                              currentReq
                                .filter(
                                  (stream) =>
                                    stream.status === "Assigned" &&
                                    stream?.isAgentAccepted === "Yes",
                                )
                                .map((stream, index) => {
                                  const reqStats =
                                    attendanceStats?.[String(stream._id)]?.[0];
                                  return (
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
                                          p: "4px",
                                          backgroundImage: `url(${getBestMatchingImage(stream?.workType)})`,
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                          border:
                                            "1px solid rgba(148,163,184,0.18)",
                                          boxShadow:
                                            "0 18px 50px rgba(15, 23, 42, 0.10)",
                                          transition: "all .25s ease",
                                          "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow:
                                              "0 24px 60px rgba(15, 23, 42, 0.14)",
                                          },

                                          "& > *": {
                                            position: "relative",
                                            zIndex: 2,
                                          },

                                          "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            inset: 0,
                                            background:
                                              "linear-gradient(180deg, rgba(2,6,23,0.72) 0%, rgba(2,6,23,0.88) 100%)",
                                            zIndex: 1,
                                            pointerEvents: "none",
                                          },

                                          "&::after": {
                                            content: '"BookMyWorker"',
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontSize: "2.8rem",
                                            fontWeight: 800,
                                            color: "rgba(255,255,255,0.05)",
                                            zIndex: 0,
                                            pointerEvents: "none",
                                            whiteSpace: "nowrap",
                                          },
                                        }}
                                      >
                                        <>
                                          <CardContent
                                            className="dash-card-content"
                                            sx={{
                                              color: "#fff",
                                              position: "relative",
                                              zIndex: 2,
                                            }}
                                          >
                                            <Box sx={{ mb: 0 }}>
                                              {/* ERN and top actions */}
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                  alignItems: "center",
                                                  width: "100%",
                                                  mb: 1.2,
                                                  borderRadius: "14px",
                                                  background:
                                                    "rgba(255,255,255,0.08)",
                                                  backdropFilter: "blur(8px)",
                                                  border:
                                                    "1px solid rgba(255,255,255,0.08)",
                                                }}
                                              >
                                                <Tooltip
                                                  title={t(
                                                    "clickToViewDetails",
                                                  )}
                                                  arrow
                                                >
                                                  <ButtonBase
                                                    onClick={() =>
                                                      handleCardClick(
                                                        stream?._id,
                                                        stream?.finalAgentRequiredWage,
                                                      )
                                                    }
                                                    sx={{
                                                      display: "inline-flex",
                                                      alignItems: "center",
                                                      px: 1,
                                                      py: 0.5,
                                                      borderRadius: 1,
                                                      transition:
                                                        "all 0.3s ease",
                                                      "&:hover": {
                                                        backgroundColor:
                                                          "rgba(255,255,255,0.08)",
                                                        textDecoration:
                                                          "underline",
                                                      },
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        fontWeight: 700,
                                                        color: "#aeeaff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                      }}
                                                    >
                                                      <InfoOutlinedIcon fontSize="small" />
                                                      {t("ernLabel")}:{" "}
                                                      {stream.ern_num}
                                                      {stream.req_type !==
                                                        "Contract_Based" && (
                                                        <span className="blink-clickView">
                                                          {t("clickView")}
                                                        </span>
                                                      )}
                                                    </Typography>
                                                  </ButtonBase>
                                                </Tooltip>

                                                <IconButton
                                                  onClick={() =>
                                                    handleLocationClick(
                                                      stream?.latitude,
                                                      stream?.longitude,
                                                    )
                                                  }
                                                  sx={{
                                                    p: 0.75,
                                                    m: 0,
                                                    minWidth: 34,
                                                    color: "#ffd180",
                                                    background:
                                                      "rgba(255,255,255,0.08)",
                                                    border:
                                                      "1px solid rgba(255,255,255,0.10)",
                                                    "&:hover": {
                                                      background:
                                                        "rgba(255,255,255,0.16)",
                                                    },
                                                  }}
                                                >
                                                  <LocationOnIcon fontSize="small" />
                                                </IconButton>
                                              </Box>

                                              {/* Site & worker details */}
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: 0.8,
                                                  mb: 1.2,
                                                }}
                                              >
                                                <Typography
                                                  variant="body1"
                                                  sx={{
                                                    fontWeight: 700,
                                                    color: "white",
                                                  }}
                                                >
                                                  {t("city")}: {stream.city}
                                                </Typography>

                                                <Typography
                                                  variant="body1"
                                                  sx={{
                                                    fontWeight: 700,
                                                    color: "white",
                                                  }}
                                                >
                                                  {t("site")}:{" "}
                                                  {stream?.tehsil + " "}{" "}
                                                  {stream?.site}
                                                </Typography>
                                              </Box>

                                              {/* Stats */}
                                              <Box
                                                sx={{
                                                  display: "grid",
                                                  gridTemplateColumns: {
                                                    xs: "1fr",
                                                    sm: "1fr 1fr",
                                                  },
                                                  gap: 1,
                                                  mt: 1,
                                                  mb: 1,
                                                }}
                                              >
                                                {stream.req_type !==
                                                  "Contract_Based" && (
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      p: 1,
                                                      borderRadius: "14px",
                                                      background: "#fff",
                                                      color: "#0f172a",
                                                      fontWeight: 800,
                                                      boxShadow:
                                                        "0 8px 20px rgba(15,23,42,0.08)",
                                                    }}
                                                  >
                                                    {t("workersReceivedToday")}:{" "}
                                                    {reqStats?.attendancedetails_workers_today ??
                                                      0}
                                                  </Typography>
                                                )}

                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    p: 1,
                                                    borderRadius: "14px",
                                                    background: "#fff",
                                                    color: "#0f172a",
                                                    fontWeight: 800,
                                                    boxShadow:
                                                      "0 8px 20px rgba(15,23,42,0.08)",
                                                  }}
                                                >
                                                  {stream.req_type !==
                                                  "Contract_Based"
                                                    ? `${t("quotePerHead")}: ₹ `
                                                    : `${t("BudgetContract")}: ₹ `}
                                                  {getPerHeadWages(
                                                    stream,
                                                    stream?.finalAgentRequiredWage,
                                                    stream?.assignedAgentId,
                                                  )}
                                                </Typography>

                                                {stream.req_type !==
                                                  "Contract_Based" && (
                                                  <>
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        p: 1,
                                                        borderRadius: "14px",
                                                        background: "#fff",
                                                        color: "#0f172a",
                                                        fontWeight: 800,
                                                        boxShadow:
                                                          "0 8px 20px rgba(15,23,42,0.08)",
                                                      }}
                                                    >
                                                      {t(
                                                        "totalWorkersReceived",
                                                      )}
                                                      :{" "}
                                                      {reqStats?.attendancedetails_total_workers ??
                                                        0}
                                                    </Typography>

                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        p: 1,
                                                        borderRadius: "14px",
                                                        background: "#fff",
                                                        color: "#0f172a",
                                                        fontWeight: 800,
                                                        boxShadow:
                                                          "0 8px 20px rgba(15,23,42,0.08)",
                                                      }}
                                                    >
                                                      {t("workDaysLabel")}:{" "}
                                                      {reqStats?.attendancedetails_total_work_days ??
                                                        0}
                                                    </Typography>
                                                  </>
                                                )}
                                              </Box>

                                              {/* Contact buttons */}
                                              {(stream?.assignedAgentName ||
                                                stream?.assignedAgentPhone) && (
                                                <Box sx={{ mt: 1 }}>
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      gap: 1.2,
                                                      flexWrap: "wrap",
                                                      borderRadius: "18px",
                                                      background:
                                                        "rgba(255,255,255,0.10)",
                                                      border:
                                                        "1px solid rgba(255,255,255,0.10)",
                                                      p: 1,
                                                    }}
                                                  >
                                                    <Button
                                                      fullWidth
                                                      startIcon={
                                                        <SupportAgent />
                                                      }
                                                      sx={{
                                                        flex: 1,
                                                        minWidth: 180,
                                                        borderRadius: "14px",
                                                        backgroundColor:
                                                          "#e0f7fa",
                                                        color: "#00796b",
                                                        textTransform: "none",
                                                        fontWeight: 700,
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "#b2ebf2",
                                                        },
                                                      }}
                                                      href={`tel:${stream?.assignedAgentPhone ?? ""}`}
                                                    >
                                                      {t("Agent")}:
                                                      <IconButton
                                                        color="primary"
                                                        component="a"
                                                        href={`tel:${stream?.assignedAgentPhone ?? ""}`}
                                                        onClick={(e) =>
                                                          e.stopPropagation()
                                                        }
                                                        sx={{ ml: 0.5, p: 0.4 }}
                                                      >
                                                        <CallIcon titleAccess="Call" />
                                                      </IconButton>
                                                    </Button>

                                                    <Button
                                                      fullWidth
                                                      startIcon={
                                                        <SupportAgent />
                                                      }
                                                      sx={{
                                                        flex: 1,
                                                        minWidth: 180,
                                                        borderRadius: "14px",
                                                        backgroundColor:
                                                          "#e0f7fa",
                                                        color: "#00796b",
                                                        textTransform: "none",
                                                        fontWeight: 700,
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "#b2ebf2",
                                                        },
                                                      }}
                                                      href="tel:7389791873"
                                                    >
                                                      {t("support")}:
                                                      <IconButton
                                                        color="primary"
                                                        component="a"
                                                        href="tel:7389791873"
                                                        onClick={(e) =>
                                                          e.stopPropagation()
                                                        }
                                                        sx={{ ml: 0.5, p: 0.4 }}
                                                      >
                                                        <CallIcon titleAccess="Call" />
                                                      </IconButton>
                                                    </Button>
                                                  </Box>
                                                </Box>
                                              )}
                                            </Box>
                                          </CardContent>

                                          {/* Footer buttons */}
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                              px: 1,
                                              pb: 1,
                                              pt: 0.2,
                                              flexWrap: "wrap",
                                            }}
                                          >
                                            <Button
                                              variant="contained"
                                              color="success"
                                              size="small"
                                              sx={{
                                                margin: 0.5,
                                                borderRadius: "12px",
                                                textTransform: "none",
                                                fontWeight: 800,
                                                px: 2,
                                              }}
                                              startIcon={
                                                <Badge
                                                  badgeContent={
                                                    unreadCounts[stream._id] ||
                                                    0
                                                  }
                                                  color="error"
                                                >
                                                  <ChatIcon />
                                                </Badge>
                                              }
                                              onClick={() =>
                                                toggleChat(stream._id)
                                              }
                                            >
                                              Chat
                                            </Button>

                                            {openChatIds.has(stream._id) && (
                                              <Chat
                                                postId={stream._id}
                                                senderId={user._id}
                                                senderRole={user.role}
                                                employerName={t("Admin")}
                                                onClose={() =>
                                                  toggleChat(stream._id)
                                                }
                                                onUnreadCountChange={
                                                  handleUnreadCountChange
                                                }
                                              />
                                            )}

                                            <Button
                                              variant="contained"
                                              color="info"
                                              size="small"
                                              sx={{
                                                margin: 0.5,
                                                borderRadius: "12px",
                                                textTransform: "none",
                                                fontWeight: 800,
                                                px: 2,
                                                boxShadow:
                                                  "0 12px 24px rgba(37,99,235,0.22)",
                                              }}
                                              onClick={() =>
                                                handleOpenCloserModal(
                                                  stream?._id,
                                                  stream?.finalAgentRequiredWage,
                                                  stream?.req_type,
                                                  stream?.assignedAgentId,
                                                  "Assigned",
                                                  stream?.ern_num,
                                                )
                                              }
                                              startIcon={<PaymentIcon />}
                                            >
                                              {t("pay")}
                                            </Button>
                                          </Box>
                                        </>
                                      </Card>
                                    </Grid>
                                  );
                                })
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>
                ) : null}
              </Grid>
            </>
          )}
          {(user?.role === "Agent" || user?.role === "SelfWorker") && (
            <>
              {/* Active work stream */}
              <Grid item xs={12}>
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
                  <CardContent
                    className="dash-card-content"
                    sx={{
                      p: { xs: 1.5, sm: 2, md: 2.5 },
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        pt: "6px",
                        mb: 1.5,
                      }}
                    >
                      <Location />
                    </Box>

                    {user?.status === "Unverified" && (
                      <Alert
                        severity="warning"
                        sx={{
                          mt: "4px",
                          mb: "10px",
                          borderRadius: "18px",
                          background:
                            "linear-gradient(180deg, #fff7ed 0%, #fffbeb 100%)",
                          color: "#7c2d12",
                          border: "1px solid #fdba74",
                          boxShadow: "0 8px 22px rgba(245, 158, 11, 0.12)",
                          "& .MuiAlert-message": {
                            padding: 0,
                            fontWeight: 500,
                            lineHeight: 1.7,
                          },
                        }}
                      >
                        {t("kycNotVerifiedMessage")}
                        {t("kycVerificationInstructions")}{" "}
                        <a
                          onClick={() => navigateTo("/my/profile")}
                          style={{
                            color: "#c2410c",
                            fontWeight: "bold",
                            textDecoration: "none",
                            cursor: "pointer",
                            transition: "color 0.3s ease",
                            animation: "blink 1.5s infinite",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.color = "#9a3412")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.color = "#c2410c")
                          }
                        >
                          {t("upload")}
                        </a>
                        .
                      </Alert>
                    )}

                    {user?.role === "Agent" && myJobsCount < 10 && (
                      <Alert
                        severity="warning"
                        sx={{
                          mt: "4px",
                          mb: "10px",
                          borderRadius: "18px",
                          background:
                            "linear-gradient(180deg, #fff7ed 0%, #fffbeb 100%)",
                          color: "#7c2d12",
                          border: "1px solid #fdba74",
                          boxShadow: "0 8px 22px rgba(245, 158, 11, 0.12)",
                          "& .MuiAlert-message": {
                            padding: 0,
                            lineHeight: 1.7,
                          },
                        }}
                      >
                        {t("YouMustAddMinimum")} <strong>10</strong>{" "}
                        {t("WorkersToActivateProfile")}{" "}
                        {t("HigherChancesMessage")}{" "}
                        <a
                          onClick={() => navigateTo("/job/post")}
                          style={{
                            color: "#c2410c",
                            fontWeight: "bold",
                            textDecoration: "none",
                            cursor: "pointer",
                            transition: "color 0.3s ease",
                            animation: "blink 1.5s infinite",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.color = "#9a3412")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.color = "#c2410c")
                          }
                        >
                          {t("CurrentWorkerCount")} {myJobsCount}.
                        </a>
                      </Alert>
                    )}

                    <ServiceBoxGrid />

                    {currentReq.filter(
                      (stream) =>
                        stream.status === "Assigned" &&
                        stream.assignedAgentId === user?._id,
                    ).length !== 0 ? (
                      <Box>
                        <Box
                          sx={{
                            mt: 2,
                            borderRadius: "24px",
                            overflow: "hidden",
                            border: "1px solid rgba(148,163,184,0.16)",
                            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
                          }}
                        >
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
                            <Box
                              sx={{
                                position: "relative",
                                zIndex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                className="dash-head"
                                variant="h6"
                                sx={{
                                  mb: 0,
                                  p: 0,
                                  lineHeight: 1.15,
                                  fontWeight: 800,
                                  fontSize: { xs: "1rem", sm: "1.15rem" },
                                }}
                              >
                                {t("activeWorkStream")}
                                <Box
                                  component="span"
                                  sx={{
                                    display: "block",
                                    color: "rgba(255,255,255,0.78)",
                                    fontSize: "0.88rem",
                                    lineHeight: 1.25,
                                    fontWeight: 500,
                                    mt: 0.4,
                                  }}
                                >
                                  {t("activeWorkStreamSubtext")}
                                </Box>
                              </Typography>

                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ pb: "0px" }}
                              >
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  alignItems="center"
                                  sx={{ gap: 0.4 }}
                                >
                                  <IconButton
                                    onClick={() => navigate("/history")}
                                    aria-label="History"
                                    sx={{
                                      p: 1,
                                      m: 0,
                                      color: "#fff",
                                      bgcolor: "rgba(255,255,255,0.10)",
                                      border:
                                        "1px solid rgba(255,255,255,0.12)",
                                      "&:hover": {
                                        bgcolor: "rgba(255,255,255,0.16)",
                                      },
                                    }}
                                  >
                                    <HistoryIcon sx={{ p: 0, m: 0 }} />
                                  </IconButton>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      lineHeight: 1,
                                      color: "rgba(255,255,255,0.8)",
                                    }}
                                  >
                                    {t("history")}
                                  </Typography>
                                </Box>

                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  alignItems="center"
                                  sx={{ gap: 0.4 }}
                                >
                                  <IconButton
                                    aria-label="Refresh"
                                    onClick={() => {
                                      toast.success("Refreshed");
                                      setTimeout(() => {
                                        fetchRequirements();
                                      }, 500);
                                    }}
                                    sx={{
                                      p: 1,
                                      m: 0,
                                      color: "#fff",
                                      bgcolor: "rgba(255,255,255,0.10)",
                                      border:
                                        "1px solid rgba(255,255,255,0.12)",
                                      "&:hover": {
                                        bgcolor: "rgba(255,255,255,0.16)",
                                      },
                                    }}
                                  >
                                    <RefreshIcon sx={{ p: 0, m: 0 }} />
                                  </IconButton>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      lineHeight: 1,
                                      color: "rgba(255,255,255,0.8)",
                                    }}
                                  >
                                    {t("refresh")}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              p: { xs: 1.5, sm: 2, md: 2.5 },
                              background:
                                "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                            }}
                          >
                            <Grid sx={{ mt: 0.5 }} container spacing={2}>
                              {currentReq.filter(
                                (stream) =>
                                  stream.status === "Assigned" &&
                                  stream.assignedAgentId === user?._id,
                              ).length === 0 ? (
                                <Grid item xs={12} sx={{ pt: 0, pb: 0 }}>
                                  <Box
                                    sx={{
                                      minHeight: "280px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "relative",
                                      backgroundImage: {
                                        xs: `url("${config.FILE_BASE_URL}/ImagesWeb/${
                                          user?.role === "Agent"
                                            ? {
                                                en: "head-agent_mob.png",
                                                hi: "agent-hindi.png",
                                                mr: "agent-marathi.png",
                                                gu: "agent-gujrati.png",
                                              }[currentLang] ||
                                              "agent-hindi.png"
                                            : {
                                                en: "worker-hindi.png",
                                                hi: "worker-hindi.png",
                                                mr: "worker-marathi.png",
                                                gu: "worker-gujrati.png",
                                              }[currentLang] ||
                                              "worker-hindi.png"
                                        }")`,
                                        sm: `url("${config.FILE_BASE_URL}/ImagesWeb/agent_desk_1.png")`,
                                      },
                                      backgroundSize: {
                                        xs: "cover",
                                        sm: "cover",
                                      },
                                      backgroundPosition: "center",
                                      backgroundRepeat: "no-repeat",
                                      borderRadius: "24px",
                                      overflow: "hidden",
                                      boxShadow:
                                        "0 18px 50px rgba(15, 23, 42, 0.14)",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        inset: 0,
                                        background:
                                          "linear-gradient(180deg, rgba(2,6,23,0.45) 0%, rgba(2,6,23,0.78) 100%)",
                                      }}
                                    />

                                    {!showWelcome ? (
                                      <Typography
                                        variant="h6"
                                        color="text.secondary"
                                        sx={{
                                          position: "relative",
                                          zIndex: 1,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {/* {t("detailsNotAvailable")} */}
                                      </Typography>
                                    ) : (
                                      user?.role === "Agent" && (
                                        <Dialog
                                          disablePortal
                                          open
                                          fullWidth
                                          maxWidth="sm"
                                          PaperProps={{
                                            sx: {
                                              borderRadius: "28px",
                                              boxShadow:
                                                "0 24px 80px rgba(15,23,42,0.28)",
                                              overflow: "hidden",
                                              border:
                                                "1px solid rgba(148,163,184,0.16)",
                                            },
                                          }}
                                        >
                                          <DialogTitle
                                            sx={{
                                              textAlign: "center",
                                              fontWeight: 800,
                                              fontSize: "1.5rem",
                                              background:
                                                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
                                              color: "#fff !important",
                                              py: 2,
                                            }}
                                          >
                                            {t("greetingTitle")}
                                          </DialogTitle>

                                          <DialogContent
                                            sx={{
                                              px: 2,
                                              py: 2,
                                              background:
                                                "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                                              position: "relative",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                backgroundImage:
                                                  "url('/home-slide-2.jpeg')",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                opacity: 0.08,
                                                zIndex: 0,
                                              }}
                                            />

                                            <Box
                                              sx={{
                                                position: "relative",
                                                zIndex: 1,
                                              }}
                                            >
                                              <Typography
                                                variant="body1"
                                                sx={{
                                                  mb: 2,
                                                  fontWeight: 700,
                                                  textAlign: "center",
                                                  color: "text.primary",
                                                  mt: "4px",
                                                }}
                                              >
                                                <Box
                                                  component="span"
                                                  color="primary.main"
                                                >
                                                  {t("bookMyWorker")}
                                                </Box>{" "}
                                                {t("thanksForJoining")}
                                              </Typography>

                                              <Box
                                                sx={{
                                                  borderRadius: "20px",
                                                  p: 2,
                                                  mb: 2,
                                                  border: "1px solid #e2e8f0",
                                                  boxShadow:
                                                    "0 10px 30px rgba(15,23,42,0.06)",
                                                  background:
                                                    "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                                                }}
                                              >
                                                {[
                                                  t("addWorkersTip"),
                                                  t("moreWorkersMoreEarnings"),
                                                  t("growthMessage"),
                                                ].map((item, index) => (
                                                  <Box
                                                    key={index}
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "start",
                                                      mb: index !== 2 ? 1.2 : 0,
                                                      p: 1.2,
                                                      borderRadius: "14px",
                                                      background:
                                                        "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                                                      border:
                                                        "1px solid #e2e8f0",
                                                    }}
                                                  >
                                                    <CheckCircleIcon
                                                      sx={{
                                                        color: "#22c55e",
                                                        fontSize: "1.1rem",
                                                        mt: "2px",
                                                        mr: 1,
                                                      }}
                                                    />
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        color: "text.secondary",
                                                        fontWeight: 700,
                                                      }}
                                                    >
                                                      {item}
                                                    </Typography>
                                                  </Box>
                                                ))}
                                              </Box>

                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  mb: 2,
                                                  fontWeight: 700,
                                                  textAlign: "center",
                                                  color: "text.primary",
                                                }}
                                              >
                                                💼 {t("upcomingInvite")}
                                              </Typography>

                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  textAlign: "center",
                                                  fontWeight: 600,
                                                  color: "#475569",
                                                }}
                                              >
                                                {t("regards")}
                                                <br />
                                                <strong>
                                                  Team BookMyWorker
                                                </strong>
                                              </Typography>
                                            </Box>
                                          </DialogContent>

                                          <DialogActions
                                            sx={{
                                              justifyContent: "center",
                                              py: 2,
                                              background: "#f8fafc",
                                              borderTop: "1px solid #e2e8f0",
                                            }}
                                          >
                                            <Button
                                              onClick={handleCloseWelcome}
                                              variant="contained"
                                              color="primary"
                                              size="small"
                                              sx={{
                                                borderRadius: "999px",
                                                px: 3,
                                                textTransform: "none",
                                                fontWeight: 800,
                                              }}
                                            >
                                              {t("okay")}
                                            </Button>
                                          </DialogActions>
                                        </Dialog>
                                      )
                                    )}
                                  </Box>
                                </Grid>
                              ) : (
                                currentReq
                                  .filter(
                                    (stream) =>
                                      stream.status === "Assigned" &&
                                      stream.assignedAgentId === user?._id,
                                  )
                                  .map((stream, index) => {
                                    const reqStats =
                                      attendanceStats?.[
                                        String(stream._id)
                                      ]?.[0];

                                    return (
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
                                            p: "4px",
                                            backgroundImage: `url(${getBestMatchingImage(
                                              stream?.workType,
                                            )})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            border:
                                              "1px solid rgba(148,163,184,0.18)",
                                            boxShadow:
                                              "0 18px 50px rgba(15, 23, 42, 0.10)",
                                            transition: "all .25s ease",
                                            "&:hover": {
                                              transform: "translateY(-4px)",
                                              boxShadow:
                                                "0 24px 60px rgba(15, 23, 42, 0.14)",
                                            },
                                            "&::before": {
                                              content: '""',
                                              position: "absolute",
                                              inset: 0,
                                              background:
                                                "linear-gradient(180deg, rgba(2,6,23,0.72) 0%, rgba(2,6,23,0.88) 100%)",
                                              zIndex: 0,
                                            },
                                            "&::after": {
                                              content: '"BookMyWorker"',
                                              position: "absolute",
                                              top: "50%",
                                              left: "50%",
                                              transform:
                                                "translate(-50%, -50%)",
                                              fontSize: "2.8rem",
                                              fontWeight: 800,
                                              color: "rgba(255,255,255,0.05)",
                                              zIndex: 0,
                                              pointerEvents: "none",
                                              whiteSpace: "nowrap",
                                            },
                                          }}
                                        >
                                          <>
                                            <CardContent
                                              className="dash-card-content"
                                              sx={{
                                                color: "#fff",
                                                position: "relative",
                                                zIndex: 1,
                                              }}
                                            >
                                              <Box sx={{ mb: 1 }}>
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                      "space-between",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    mb: 1.2,
                                                    p: 1,
                                                    borderRadius: "14px",
                                                    background:
                                                      "rgba(255,255,255,0.08)",
                                                    backdropFilter: "blur(8px)",
                                                    border:
                                                      "1px solid rgba(255,255,255,0.08)",
                                                  }}
                                                >
                                                  <Tooltip
                                                    title={t(
                                                      "clickToViewDetails",
                                                    )}
                                                    arrow
                                                  >
                                                    <ButtonBase
                                                      onClick={() =>
                                                        handleCardClick(
                                                          stream?._id,
                                                          stream?.finalAgentRequiredWage,
                                                        )
                                                      }
                                                      sx={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        transition:
                                                          "all 0.3s ease",
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "rgba(255,255,255,0.08)",
                                                          textDecoration:
                                                            "underline",
                                                        },
                                                      }}
                                                    >
                                                      <Typography
                                                        variant="body2"
                                                        sx={{
                                                          fontWeight: 700,
                                                          color: "#aeeaff",
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: "4px",
                                                        }}
                                                      >
                                                        <InfoOutlinedIcon fontSize="small" />
                                                        {t("ernLabel")}:{" "}
                                                        {stream.ern_num}
                                                        {stream.req_type !==
                                                          "Contract_Based" && (
                                                          <span className="blink-clickView">
                                                            {t("clickView")}
                                                          </span>
                                                        )}
                                                      </Typography>
                                                    </ButtonBase>
                                                  </Tooltip>

                                                  <IconButton
                                                    onClick={() =>
                                                      handleLocationClick(
                                                        stream?.latitude,
                                                        stream?.longitude,
                                                      )
                                                    }
                                                    sx={{
                                                      p: 0.75,
                                                      m: 0,
                                                      minWidth: 34,
                                                      color: "#ffd180",
                                                      background:
                                                        "rgba(255,255,255,0.08)",
                                                      border:
                                                        "1px solid rgba(255,255,255,0.10)",
                                                      "&:hover": {
                                                        background:
                                                          "rgba(255,255,255,0.16)",
                                                      },
                                                    }}
                                                  >
                                                    <LocationOnIcon fontSize="small" />
                                                  </IconButton>
                                                </Box>

                                                <Box
                                                  sx={{
                                                    mb: 1.2,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 0.8,
                                                  }}
                                                >
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: 1,
                                                    }}
                                                  >
                                                    <LocationCityIcon
                                                      fontSize="small"
                                                      sx={{ color: "#81d4fa" }}
                                                    />
                                                    <Typography
                                                      variant="body1"
                                                      sx={{ fontWeight: 400 }}
                                                    >
                                                      <strong
                                                        style={{
                                                          fontWeight: 700,
                                                        }}
                                                      >
                                                        {t("city")}:
                                                      </strong>{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "14px",
                                                          color: "white",
                                                        }}
                                                      >
                                                        {stream.city}
                                                      </span>
                                                    </Typography>
                                                  </Box>

                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: 1,
                                                    }}
                                                  >
                                                    <LocationOnIcon
                                                      fontSize="small"
                                                      sx={{ color: "#ffcc80" }}
                                                    />
                                                    <Typography
                                                      variant="body1"
                                                      sx={{ fontWeight: 400 }}
                                                    >
                                                      <strong
                                                        style={{
                                                          fontWeight: 700,
                                                        }}
                                                      >
                                                        {t("site")}:
                                                      </strong>{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "14px",
                                                          color: "white",
                                                        }}
                                                      >
                                                        {stream?.tehsil}{" "}
                                                        {stream?.site}
                                                      </span>
                                                    </Typography>
                                                  </Box>

                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: 1,
                                                    }}
                                                  >
                                                    <WorkIcon
                                                      fontSize="small"
                                                      sx={{ color: "#c4b5fd" }}
                                                    />
                                                    <Typography
                                                      variant="body1"
                                                      sx={{ fontWeight: 400 }}
                                                    >
                                                      <strong
                                                        style={{
                                                          fontWeight: 700,
                                                        }}
                                                      >
                                                        {t("workType")}:
                                                      </strong>{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "14px",
                                                          color: "white",
                                                        }}
                                                      >
                                                        {translateFromJson(
                                                          stream?.workType,
                                                          i18n.language,
                                                        )}{" "}
                                                        -{" "}
                                                        {translateFromJson(
                                                          stream?.subCategory,
                                                          i18n.language,
                                                        )}
                                                      </span>
                                                    </Typography>
                                                  </Box>

                                                  {stream.remarks && (
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                      }}
                                                    >
                                                      <InfoIcon
                                                        fontSize="small"
                                                        sx={{
                                                          color: "#93c5fd",
                                                        }}
                                                      />
                                                      <AboutWork
                                                        stream={stream}
                                                        t={t}
                                                      />
                                                    </Box>
                                                  )}
                                                </Box>

                                                <Box
                                                  sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: {
                                                      xs: "1fr",
                                                      sm: "1fr 1fr",
                                                    },
                                                    gap: 1,
                                                    mt: 1,
                                                    mb: 1,
                                                  }}
                                                >
                                                  {stream.req_type !==
                                                    "Contract_Based" && (
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        p: 1,
                                                        borderRadius: "14px",
                                                        background: "#fff",
                                                        color: "#0f172a",
                                                        fontWeight: 800,
                                                        boxShadow:
                                                          "0 8px 20px rgba(15,23,42,0.08)",
                                                      }}
                                                    >
                                                      {t("workersSentToday")}:{" "}
                                                      {reqStats?.attendancedetails_workers_today ??
                                                        0}
                                                    </Typography>
                                                  )}

                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      p: 1,
                                                      borderRadius: "14px",
                                                      background: "#fff",
                                                      color: "#0f172a",
                                                      fontWeight: 800,
                                                      boxShadow:
                                                        "0 8px 20px rgba(15,23,42,0.08)",
                                                    }}
                                                  >
                                                    {stream.req_type !==
                                                    "Contract_Based"
                                                      ? `${t("perHeadWages")}:`
                                                      : `${t("BudgetContract")}:`}{" "}
                                                    ₹{" "}
                                                    <span
                                                      style={{
                                                        fontWeight: 600,
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      {getPerHeadWages(
                                                        stream,
                                                        stream?.finalAgentRequiredWage,
                                                        stream?.assignedAgentId,
                                                      )}
                                                    </span>
                                                  </Typography>

                                                  {stream.req_type !==
                                                    "Contract_Based" && (
                                                    <>
                                                      <Typography
                                                        variant="body2"
                                                        sx={{
                                                          p: 1,
                                                          borderRadius: "14px",
                                                          background: "#fff",
                                                          color: "#0f172a",
                                                          fontWeight: 800,
                                                          boxShadow:
                                                            "0 8px 20px rgba(15,23,42,0.08)",
                                                        }}
                                                      >
                                                        {t("totalWorkersSent")}:{" "}
                                                        {reqStats?.attendancedetails_total_workers ??
                                                          0}
                                                      </Typography>
                                                      <Typography
                                                        variant="body2"
                                                        sx={{
                                                          p: 1,
                                                          borderRadius: "14px",
                                                          background: "#fff",
                                                          color: "#0f172a",
                                                          fontWeight: 800,
                                                          boxShadow:
                                                            "0 8px 20px rgba(15,23,42,0.08)",
                                                        }}
                                                      >
                                                        {t("workDays")}:{" "}
                                                        {reqStats?.attendancedetails_total_work_days ??
                                                          0}
                                                      </Typography>
                                                    </>
                                                  )}
                                                </Box>
                                              </Box>

                                              <Grid item xs={12}>
                                                {[
                                                  {
                                                    key: "accommodationAvailable",
                                                    label: t(
                                                      "accommodationAvailable",
                                                    ),
                                                  },
                                                  {
                                                    key: "foodAvailable",
                                                    label: t("foodAvailable"),
                                                  },
                                                  {
                                                    key: "incentive",
                                                    label: t("incentive"),
                                                  },
                                                  {
                                                    key: "bonus",
                                                    label: t("bonus"),
                                                  },
                                                  {
                                                    key: "transportProvided",
                                                    label:
                                                      t("transportProvided"),
                                                  },
                                                  {
                                                    key: "weeklyOff",
                                                    label: t("weeklyOff"),
                                                  },
                                                  {
                                                    key: "overtimeAvailable",
                                                    label:
                                                      t("overtimeAvailable"),
                                                  },
                                                ]
                                                  .filter(
                                                    (item) =>
                                                      stream?.[item.key] ===
                                                      true,
                                                  )
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

                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  gap: 1.2,
                                                  flexWrap: "wrap",
                                                  borderRadius: "18px",
                                                  background:
                                                    "rgba(255,255,255,0.10)",
                                                  border:
                                                    "1px solid rgba(255,255,255,0.10)",
                                                  p: 1,
                                                  mt: 1,
                                                }}
                                              >
                                                <Button
                                                  startIcon={<SupportAgent />}
                                                  sx={{
                                                    flex: 1,
                                                    minWidth: 180,
                                                    borderRadius: "14px",
                                                    backgroundColor: "#e0f7fa",
                                                    color: "#00796b",
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    "&:hover": {
                                                      backgroundColor:
                                                        "#b2ebf2",
                                                    },
                                                  }}
                                                  href={`tel:${stream?.employerPhone ?? 0}`}
                                                >
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      color: "#1976d2",
                                                      fontWeight: "bold",
                                                      textDecoration: "none",
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: 0.5,
                                                    }}
                                                  >
                                                    {t("employerContact")}:
                                                    <IconButton
                                                      color="primary"
                                                      component="a"
                                                      href={`tel:${stream?.employerPhone ?? 0}`}
                                                      sx={{ p: 0.4 }}
                                                    >
                                                      <CallIcon titleAccess="Call" />
                                                    </IconButton>
                                                  </Typography>
                                                </Button>

                                                <Button
                                                  startIcon={<SupportAgent />}
                                                  sx={{
                                                    flex: 1,
                                                    minWidth: 180,
                                                    borderRadius: "14px",
                                                    backgroundColor: "#e0f7fa",
                                                    color: "#00796b",
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    "&:hover": {
                                                      backgroundColor:
                                                        "#b2ebf2",
                                                    },
                                                  }}
                                                >
                                                  {t("support")}
                                                  <IconButton
                                                    color="primary"
                                                    component="a"
                                                    href="tel:7389791873"
                                                    sx={{ p: 0.4 }}
                                                  >
                                                    <CallIcon titleAccess="Call" />
                                                  </IconButton>
                                                </Button>
                                              </Box>
                                            </CardContent>

                                            <Box
                                              sx={{
                                                display: "flex",
                                                gap: 1.2,
                                                mb: 1,
                                                mt: 0.5,
                                                px: 1,
                                                pb: 1,
                                                position: "relative",
                                                zIndex: 1,
                                                flexDirection: {
                                                  xs: "column",
                                                  sm: "row",
                                                },
                                              }}
                                            >
                                              {stream.req_type !==
                                                "Contract_Based" && (
                                                <>
                                                  <TextField
                                                    label={t("numberOfWorker")}
                                                    variant="outlined"
                                                    type="number"
                                                    size="small"
                                                    inputRef={(el) => {
                                                      if (el)
                                                        workerInputRef.current[
                                                          stream?._id
                                                        ] = el;
                                                    }}
                                                    value={
                                                      workerCounts[
                                                        stream._id
                                                      ] || ""
                                                    }
                                                    onChange={(e) =>
                                                      setWorkerCounts({
                                                        ...workerCounts,
                                                        [stream._id]:
                                                          e.target.value,
                                                      })
                                                    }
                                                    inputProps={{ min: 1 }}
                                                    sx={{
                                                      mr: 1,
                                                      ml: 1,
                                                      "& .MuiOutlinedInput-root":
                                                        {
                                                          borderRadius: "14px",
                                                          background:
                                                            "rgba(255,255,255,0.08)",
                                                          color: "#fff",
                                                          "& fieldset": {
                                                            borderColor:
                                                              "rgba(255,255,255,0.35)",
                                                          },
                                                          "&:hover fieldset": {
                                                            borderColor: "#fff",
                                                          },
                                                          "&.Mui-focused fieldset":
                                                            {
                                                              borderColor:
                                                                "#fff",
                                                            },
                                                        },
                                                      "& .MuiInputLabel-root": {
                                                        color: "#fff",
                                                      },
                                                      "& .MuiInputBase-input": {
                                                        color: "#fff",
                                                      },
                                                    }}
                                                  />

                                                  <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => {
                                                      handleSendWorker(
                                                        stream?.ern_num,
                                                        stream?._id,
                                                        stream?.assignedAgentName,
                                                        stream?.assignedAgentId,
                                                        stream?.assignedAgentPhone,
                                                        stream?.workLocation,
                                                        workerCounts?.[
                                                          stream._id
                                                        ],
                                                        getPerHeadWages(
                                                          stream,
                                                          stream?.finalAgentRequiredWage,
                                                          stream?.assignedAgentId,
                                                        ),
                                                        stream?.emp_name,
                                                        stream?.employerPhone,
                                                        stream?.assignedAgentPhone,
                                                        stream?.assignedAgentName,
                                                        stream?.employerId,
                                                      );

                                                      setWorkerCounts(
                                                        (prev) => ({
                                                          ...prev,
                                                          [stream._id]: "",
                                                        }),
                                                      );
                                                    }}
                                                    sx={{
                                                      borderRadius: "14px",
                                                      textTransform: "none",
                                                      fontWeight: 800,
                                                      px: 2.5,
                                                      boxShadow:
                                                        "0 12px 24px rgba(37,99,235,0.22)",
                                                      whiteSpace: "nowrap",
                                                    }}
                                                  >
                                                    {t("send")}
                                                  </Button>
                                                </>
                                              )}
                                            </Box>

                                            {stream?.isAgentAccepted == "No" &&
                                              stream?.status === "Assigned" &&
                                              stream?.assignedAgentId ===
                                                user?._id && (
                                                <Box
                                                  className="balloon"
                                                  sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    pr: 0,
                                                    pl: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    background:
                                                      "linear-gradient(180deg, rgba(2,6,23,0.50) 0%, rgba(2,6,23,0.82) 100%)",
                                                    zIndex: 10,
                                                    color: "#fff",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    borderRadius: "24px",
                                                    p: 2,
                                                  }}
                                                >
                                                  <Alert
                                                    icon={false}
                                                    severity="success"
                                                    sx={{
                                                      p: 2,
                                                      top: "8px",
                                                      left: "3px",
                                                      right: "3px",
                                                      width: "100%",
                                                      maxWidth: 420,
                                                      borderRadius: "20px",
                                                      boxShadow:
                                                        "0 20px 40px rgba(15,23,42,0.20)",
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="h6"
                                                      sx={{
                                                        animation:
                                                          "celebrate 1s ease-in-out infinite",
                                                        position: "relative",
                                                        fontWeight: "bold",
                                                        "@keyframes celebrate":
                                                          {
                                                            "0%, 100%": {
                                                              transform:
                                                                "scale(1)",
                                                              color: "#FFD700",
                                                              textShadow:
                                                                "0 0 10px rgb(106, 187, 127), 0 0 20px rgb(132, 243, 130)",
                                                            },
                                                            "50%": {
                                                              transform:
                                                                "scale(1.1)",
                                                              color: "green",
                                                              textShadow:
                                                                "0 0 15px rgb(2, 63, 12), 0 0 30px rgb(12, 84, 36)",
                                                            },
                                                          },
                                                      }}
                                                    >
                                                      🎉 {t("congratsStream")}
                                                    </Typography>
                                                    <Typography sx={{ mb: 1 }}>
                                                      {t(
                                                        "agentmessagebeforeaccept",
                                                      )}
                                                    </Typography>
                                                    <Typography
                                                      sx={{
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {stream?.site +
                                                        " " +
                                                        stream?.district}
                                                    </Typography>

                                                    <Box
                                                      sx={{
                                                        mt: 2,
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        gap: 2,
                                                        flexWrap: "wrap",
                                                      }}
                                                    >
                                                      <Button
                                                        variant="contained"
                                                        color="success"
                                                        onClick={() =>
                                                          handleAccept(
                                                            stream?.assignedAgentId,
                                                            stream?.ern_num,
                                                          )
                                                        }
                                                        sx={{
                                                          borderRadius: "12px",
                                                          textTransform: "none",
                                                          fontWeight: 800,
                                                          px: 3,
                                                        }}
                                                      >
                                                        Accept
                                                      </Button>

                                                      <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() =>
                                                          handleReject(
                                                            stream?.assignedAgentId,
                                                            stream?.ern_num,
                                                          )
                                                        }
                                                        sx={{
                                                          borderRadius: "12px",
                                                          textTransform: "none",
                                                          fontWeight: 800,
                                                          px: 3,
                                                        }}
                                                      >
                                                        Reject
                                                      </Button>
                                                    </Box>
                                                  </Alert>
                                                </Box>
                                              )}
                                          </>
                                        </Card>
                                      </Grid>
                                    );
                                  })
                              )}
                            </Grid>
                          </Box>
                        </Box>
                      </Box>
                    ) : null}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sx={{ mb: 5 }} xs={12}>
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
                          if (searchTimeout.current)
                            clearTimeout(searchTimeout.current);

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
                    className="dash-card-content"
                    sx={{
                      p: { xs: 1.5, sm: 2, md: 2.5 },
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    }}
                  >
                    {loading && (
                      <Box
                        sx={{
                          minHeight: "22vh",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "22px",
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
                        }}
                      >
                        <CircularProgress color="primary" size={32} />
                        <Typography
                          sx={{
                            color: "#64748b",
                            mt: 1.5,
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          {t ? t("SearchingPleaseWait") : "Searching..."}
                        </Typography>
                      </Box>
                    )}

                    <Grid sx={{ mt: 0.5 }} container spacing={2}>
                      {!currentReq ||
                      (currentReq.length === 0 &&
                        currentReq.every(
                          (stream) =>
                            stream.status?.toLowerCase() !== "assigned",
                        ) &&
                        currentReq.every(
                          (stream) =>
                            stream.status?.toLowerCase() !== "pending" ||
                            stream.req_type == "Contract_Based" ||
                            stream.req_type == "Office_Staff",
                        )) ? (
                        <Grid item xs={12} sx={{ pt: 0, pb: 0 }}>
                          {requirementsLoading ? (
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
                              <CircularProgress sx={{ color: "#1976d2" }} />
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
                                  p: 3,
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
                                  Keep your profile active and check again for
                                  fresh opportunities.
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Grid>
                      ) : (
                        currentReq
                          .filter((stream) => {
                            return (
                              (stream.status || "").trim().toLowerCase() !==
                                "assigned" &&
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
                                  boxShadow:
                                    "0 18px 50px rgba(15, 23, 42, 0.10)",
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  background: "#fff",
                                  transition: "all .25s ease",
                                  "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow:
                                      "0 24px 60px rgba(15, 23, 42, 0.14)",
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
                                    borderRadius: 0,
                                    overflow: "hidden",
                                    p: 2,
                                    backgroundImage: `url(${getBestMatchingImage(stream.workType)})`,
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
                                            pl: 1,
                                            pr: 1,
                                            borderRadius: "14px",
                                            background:
                                              "rgba(255,255,255,0.08)",
                                            backdropFilter: "blur(8px)",
                                            border:
                                              "1px solid rgba(255,255,255,0.08)",
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

                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                          >
                                            <ContactButtons
                                              stream={stream}
                                              currentLang={currentLang}
                                              isVerified={user?.veryfiedBage}
                                            />

                                            <IconButton
                                              onClick={() =>
                                                handleLocationClick(
                                                  stream?.latitude,
                                                  stream?.longitude,
                                                )
                                              }
                                              sx={{
                                                p: 0.75,
                                                m: 0,
                                                minWidth: 34,
                                                color: "#ffd180",
                                                background:
                                                  "rgba(255,255,255,0.08)",
                                                border:
                                                  "1px solid rgba(255,255,255,0.10)",
                                                "&:hover": {
                                                  background:
                                                    "rgba(255,255,255,0.16)",
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
                                          <AboutWorkSection
                                            stream={stream}
                                            t={t}
                                          />
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
                                          <Typography
                                            variant="body2"
                                            fontWeight={700}
                                          >
                                            <strong>{t("city")}:</strong>
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            sx={{ opacity: 0.95 }}
                                          >
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
                                            sx={{
                                              wordBreak: "break-word",
                                              opacity: 0.95,
                                            }}
                                          >
                                            <strong>{t("site")}:</strong>{" "}
                                            {stream?.tehsil +
                                              " " +
                                              stream?.site}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Grid
                                        container
                                        spacing={1.5}
                                        sx={{ mb: 2 }}
                                      >
                                        <Grid item xs={6}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                              p: 1.2,
                                              borderRadius: "14px",
                                              background:
                                                "rgba(255,255,255,0.08)",
                                              border:
                                                "1px solid rgba(255,255,255,0.08)",
                                            }}
                                          >
                                            <GroupsIcon
                                              fontSize="small"
                                              sx={{ color: "#fff59d" }}
                                            />
                                            <Typography variant="body2">
                                              <strong>
                                                {t("requiredWorkers")}:
                                              </strong>{" "}
                                              <span
                                                style={{ fontSize: "14px" }}
                                              >
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
                                              background:
                                                "rgba(255,255,255,0.08)",
                                              border:
                                                "1px solid rgba(255,255,255,0.08)",
                                            }}
                                          >
                                            <CurrencyRupeeIcon
                                              fontSize="small"
                                              sx={{ color: "#c5e1a5" }}
                                            />
                                            <Typography variant="body2">
                                              <strong>
                                                {t("perHeadWages")}:
                                              </strong>{" "}
                                              <span
                                                style={{ fontSize: "14px" }}
                                              >
                                                {getPerHeadWages(
                                                  stream,
                                                  stream.max_wages * 0.9,
                                                  stream?.assignedAgentId,
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
                                          .filter(
                                            (item) =>
                                              stream?.[item.key] === true,
                                          )
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
                                    mt: 0,
                                    gap: 1.2,
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
                                        stream?.min_wages,
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
                                        stream?.min_wages,
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

                    {hasMore && (
                      <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Button
                          variant="contained"
                          onClick={handleLoadMore}
                          disabled={loading}
                          sx={{
                            borderRadius: "999px",
                            textTransform: "none",
                            fontWeight: 800,
                            px: 4.5,
                            py: 1.35,
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            boxShadow: "0 14px 28px rgba(37, 99, 235, 0.22)",
                            letterSpacing: "0.2px",
                            "&:hover": {
                              boxShadow: "0 18px 36px rgba(37, 99, 235, 0.28)",
                              transform: "translateY(-2px)",
                              background:
                                "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                            },
                            "&:active": {
                              transform: "scale(0.98)",
                            },
                          }}
                        >
                          {loading ? "Loading…" : "Load More"}
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {user?.role === "Worker" && (
            <>
              {/* Worker Active Site */}
              <Grid className="dash-card" item xs={12}>
                <Grid item sx={{ mb: 5 }} xs={12}>
                  {/* Opportunity for work */}
                  <Card sx={{ boxShadow: 0, borderRadius: 2 }}>
                    <CardContent className="dash-card-content">
                      <Divider
                        sx={{
                          borderColor: "#1876d2",
                          borderBottomWidth: "5px",
                          opacity: 1.25,
                        }}
                      />
                      {/* <InviteForWorkHeader
                        t={t}
                        onSearch={(value) => {
                          if (searchTimeout.current)
                            clearTimeout(searchTimeout.current);

                          searchTimeout.current = setTimeout(() => {
                            fetchRequirements(1, false, 20, value);
                          }, 500); // 500ms delay
                        }}
                      /> */}
                      <Divider
                        sx={{
                          mb: 1,
                          borderColor: "#1876d2",
                          borderBottomWidth: "5px",
                          opacity: 1.25,
                        }}
                      />{" "}
                      {loading && (
                        <Box
                          sx={{
                            height: "20vh",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CircularProgress color="primary" size={32} />
                          <p
                            style={{
                              color: "#666",
                              marginTop: "12px",
                              fontSize: "13px",
                            }}
                          >
                            {t ? t("SearchingPleaseWait") : "Searching..."}
                          </p>
                        </Box>
                      )}
                      <Grid sx={{ mt: 0.5 }} container spacing={0.5}>
                        {!currentReq ||
                        (currentReq.length === 0 &&
                          currentReq.every(
                            (stream) =>
                              stream.status?.toLowerCase() !== "assigned",
                          ) &&
                          currentReq.every(
                            (stream) =>
                              stream.status?.toLowerCase() !== "pending" ||
                              stream.req_type == "Contract_Based" ||
                              stream.req_type == "Office_Staff",
                          )) ? (
                          <Grid item xs={12} sx={{ pt: 0, pb: 0 }}>
                            {requirementsLoading ? (
                              <Box
                                sx={{
                                  height: "250px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CircularProgress sx={{ color: "#1976d2" }} />
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  height: "250px",
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
                                    sm: "initial",
                                  },
                                  backgroundPosition: "center",
                                  backgroundRepeat: "no-repeat",
                                  borderRadius: 2,
                                  overflow: "hidden",
                                }}
                              >
                                {/* dark overlay */}
                                <Box
                                  sx={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                  }}
                                />

                                {/* text */}
                                <Box
                                  sx={{
                                    position: "relative",
                                    zIndex: 1,
                                    p: 3,
                                    color: "#fff",
                                    fontSize: 18,
                                    fontWeight: 600,
                                    textAlign: "center",
                                  }}
                                >
                                  {t("noRequirementsFound")}
                                </Box>
                              </Box>
                            )}
                          </Grid>
                        ) : (
                          currentReq
                            .filter((stream) => {
                              return (
                                (stream.status || "").trim().toLowerCase() !==
                                  "assigned" &&
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
                                    boxShadow: 5,
                                    borderRadius: 2,
                                    // backgroundColor: '#f5f5f5',
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    "&::before": {
                                      content: `"${t("companyName")}"`,
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      fontSize: "2.5rem",
                                      fontWeight: 600,
                                      color: "rgba(0, 0, 0, 0.04)",
                                      zIndex: 0,
                                      pointerEvents: "none",
                                      whiteSpace: "nowrap",
                                    },
                                  }}
                                >
                                  <CardContent
                                    sx={{
                                      position: "relative",
                                      borderRadius: 2,
                                      overflow: "hidden",
                                      p: 2,
                                      backgroundImage: `url(${getBestMatchingImage(stream.workType)})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      backgroundRepeat: "no-repeat",
                                      color: "#fff", // make all text light by default
                                      // Add a semi-transparent dark overlay to improve contrast
                                      "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        inset: 0,
                                        background: "rgba(0, 0, 0, 0.80)", // darker overlay for better readability
                                        zIndex: 0,
                                      },
                                      // Ensure text and icons are above overlay
                                      "& > *": {
                                        position: "relative",
                                        zIndex: 1,
                                      },
                                    }}
                                    className="invitecard"
                                  >
                                    <Grid container spacing={1} sx={{ pt: 0 }}>
                                      {/* Employer Details */}
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
                                            borderRadius: 2,
                                            pt: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: "12px",
                                                color: "#aeeaff",
                                              }}
                                              fontWeight={600}
                                            >
                                              {t("ernLabel")}: {stream.ern_num}
                                            </Typography>

                                            <Box
                                              display="flex"
                                              alignItems="center"
                                              gap={1}
                                            >
                                              <IconButton
                                                color="success"
                                                component="a"
                                                href={`https://wa.me/15557193421?text=${encodeURIComponent(
                                                  `Hello, here is the ERN number: ${stream.ern_num}`,
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                  p: 0,
                                                  m: 0,
                                                  minWidth: 32,
                                                }}
                                              >
                                                <WhatsAppIcon
                                                  fontSize="small"
                                                  sx={{ color: "#25D366" }}
                                                />
                                              </IconButton>

                                              <IconButton
                                                color="primary"
                                                component="a"
                                                href="tel:7389791873"
                                                sx={{
                                                  p: 0,
                                                  m: 0,
                                                  minWidth: 32,
                                                  color: "#90caf9",
                                                }}
                                              >
                                                <CallIcon fontSize="small" />
                                              </IconButton>

                                              <IconButton
                                                onClick={() =>
                                                  handleLocationClick(
                                                    stream?.latitude,
                                                    stream?.longitude,
                                                  )
                                                }
                                                sx={{
                                                  p: 0,
                                                  m: 0,
                                                  minWidth: 32,
                                                  color: "#ffcc80",
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
                                              mb: 0.5,
                                            }}
                                          >
                                            <AboutWorkSection
                                              stream={stream}
                                              t={t}
                                            />
                                          </Box>

                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              alignItems: "center",
                                              gap: 1,
                                            }}
                                          >
                                            <LocationCityIcon
                                              sx={{ color: "#81d4fa" }}
                                              fontSize="small"
                                            />
                                            <Typography
                                              variant="body2"
                                              fontWeight={600}
                                            >
                                              <strong>{t("city")}:</strong>
                                            </Typography>
                                            <Typography variant="body2">
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
                                              sx={{ color: "#ffcc80" }}
                                              fontSize="small"
                                            />
                                            <Typography
                                              variant="body2"
                                              sx={{ wordBreak: "break-word" }}
                                            >
                                              <strong>{t("site")}:</strong>{" "}
                                              {stream?.tehsil +
                                                " " +
                                                stream?.site}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Grid>

                                      {/* Workers and Wages */}
                                      <Grid item xs={12}>
                                        <Grid
                                          container
                                          spacing={2}
                                          sx={{ mb: 2 }}
                                        >
                                          <Grid item xs={6}>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <GroupsIcon
                                                fontSize="small"
                                                sx={{ color: "#fff59d" }}
                                              />
                                              <Typography variant="body2">
                                                <strong>
                                                  {t("requiredWorkers")}:
                                                </strong>{" "}
                                                <span
                                                  style={{ fontSize: "14px" }}
                                                >
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
                                              }}
                                            >
                                              <CurrencyRupeeIcon
                                                fontSize="small"
                                                sx={{ color: "#c5e1a5" }}
                                              />
                                              <Typography variant="body2">
                                                <strong>
                                                  {t("perHeadWages")}:
                                                </strong>{" "}
                                                <span
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {getPerHeadWages(
                                                    stream,
                                                    stream.max_wages * 0.9,
                                                    stream?.assignedAgentId,
                                                  )}
                                                  /-
                                                </span>
                                              </Typography>
                                            </Box>
                                          </Grid>
                                        </Grid>

                                        {/* Facilities */}
                                        <Grid item xs={12}>
                                          {[
                                            {
                                              key: "accommodationAvailable",
                                              label: t(
                                                "accommodationAvailable",
                                              ),
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
                                            .filter(
                                              (item) =>
                                                stream?.[item.key] === true,
                                            )
                                            .map((item) => (
                                              <Box
                                                key={item.key}
                                                sx={{
                                                  display: "inline-block",
                                                  bgcolor:
                                                    "rgba(46, 125, 50, 0.9)",
                                                  color: "#fff",
                                                  px: 1.5,
                                                  py: 0.5,
                                                  borderRadius: 1,
                                                  mr: 1,
                                                  mb: 1,
                                                  fontSize: "0.8rem",
                                                  fontWeight: 500,
                                                }}
                                              >
                                                {item.label}
                                              </Box>
                                            ))}
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </CardContent>

                                  {/* Footer: Quote and Button */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      p: 1,
                                      mt: "4px",
                                      gap: 1,
                                      pt: 0,
                                      zIndex: 1,
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
                                          stream?.min_wages,
                                        )
                                      }
                                      inputRef={(el) =>
                                        (wageInputRefs.current[stream._id] = el)
                                      }
                                    />

                                    <Button
                                      onClick={() =>
                                        handleExpressInterest(
                                          stream._id,
                                          wagesMap[stream._id],
                                          stream?.min_wages,
                                        )
                                      }
                                      disabled={
                                        interestedMap[stream._id] ||
                                        hasUserShownInterest(stream, user._id)
                                      }
                                      variant="contained"
                                      color="primary"
                                      size="small"
                                      fullWidth
                                      sx={{ whiteSpace: "nowrap" }}
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
                      {hasMore && (
                        <Box sx={{ textAlign: "center", mt: 3 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLoadMore}
                            disabled={loading}
                            sx={{
                              borderRadius: "30px",
                              textTransform: "none",
                              fontWeight: 600,
                              px: 4,
                              py: 1.2,
                              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
                              letterSpacing: "0.5px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
                                transform: "translateY(-2px)",
                              },
                              "&:active": {
                                transform: "scale(0.98)",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                              },
                            }}
                          >
                            {loading ? "Loading…" : "Load More"}
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
        {/* Modal Dialog for showing the details */}

        <Dialog
          disablePortal
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="md"
          TransitionComponent={Transition}
          keepMounted
          fullScreen={isMobile}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: isMobile ? 0 : "28px",
              mt: isMobile ? 0 : "110px",
              p: 0,
              overflow: "hidden",
              border: "1px solid rgba(148,163,184,0.18)",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.6,
              px: { xs: 2, sm: 2.5, md: 3 },
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
              color: "white",
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
            <Typography
              fontSize="1.05rem"
              fontWeight={800}
              color="white"
              sx={{ position: "relative", zIndex: 1 }}
            >
              {t("Statement of Work")}
            </Typography>
            <Tooltip title={t("close")}>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: "white",
                  position: "relative",
                  zIndex: 1,
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.16)",
                  },
                }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>

          <DialogContent
            sx={{
              p: 0,
              background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            }}
          >
            <Box
              sx={{
                p: { xs: 1, sm: 1.5, md: 2 },
              }}
            >
              <Box
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "20px",
                  overflowX: "auto",
                  background: "#fff",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <TableContainer>
                  <Table size="small" sx={{ minWidth: 720 }}>
                    <TableHead
                      sx={{
                        background:
                          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                      }}
                    >
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: 800, color: "#334155", py: 1.2 }}
                        >
                          {t("S.No")}
                        </TableCell>

                        {!["Employer", "Agent", "SelfWorker"].includes(
                          user?.role,
                        ) && (
                          <TableCell
                            sx={{ fontWeight: 800, color: "#334155", py: 1.2 }}
                          >
                            {t("ERN")}
                          </TableCell>
                        )}

                        <TableCell
                          sx={{ fontWeight: 800, color: "#334155", py: 1.2 }}
                        ></TableCell>

                        {!["Agent", "SelfWorker", "Employer"].includes(
                          user?.role,
                        ) && (
                          <TableCell
                            sx={{ fontWeight: 800, color: "#334155", py: 1.2 }}
                          >
                            {t("Agent")}
                          </TableCell>
                        )}

                        {(user?.role === "Admin" ||
                          user?.role === "SuperAdmin") && (
                          <TableCell
                            sx={{ fontWeight: 800, color: "#334155", py: 1.2 }}
                          >
                            {t("Employer")}
                          </TableCell>
                        )}

                        <TableCell
                          sx={{ fontWeight: 800, color: "#334155", py: 1.2 }}
                        >
                          {t("Workers")}
                        </TableCell>

                        {(user?.role !== "SelfWorker" ||
                          user?.role !== "Agent" ||
                          user?.role === "Admin") && (
                          <TableCell
                            sx={{ fontWeight: 800, color: "#334155", py: 1.2 }}
                          >
                            {t("Wages")}
                          </TableCell>
                        )}

                        <TableCell
                          sx={{ fontWeight: 800, color: "#334155", py: 1.2 }}
                        >
                          {t("Date")}
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {statementOfWorkData.length > 0 ? (
                        statementOfWorkData
                          .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                          .map((row, index) => (
                            <TableRow
                              key={row._id || index}
                              sx={{
                                "&:nth-of-type(even)": {
                                  backgroundColor: "#f8fbff",
                                },
                                "&:hover": {
                                  backgroundColor: "#f1f5f9",
                                },
                              }}
                            >
                              <TableCell sx={{ py: 1.1 }}>
                                {page * rowsPerPage + index + 1}
                              </TableCell>

                              {!["Employer", "Agent", "SelfWorker"].includes(
                                user?.role,
                              ) && (
                                <TableCell sx={{ py: 1.1, fontWeight: 600 }}>
                                  {row.ERN_number}
                                </TableCell>
                              )}

                              <TableCell sx={{ py: 1.1 }}>
                                {row.employer_accepted ? (
                                  <Typography
                                    color="success.main"
                                    fontWeight="bold"
                                    fontSize={12}
                                  >
                                    {t("Approved")}
                                  </Typography>
                                ) : user?.role === "Agent" ||
                                  user?.role === "SelfWorker" ? (
                                  <Typography
                                    color="error"
                                    fontWeight="bold"
                                    fontSize={12}
                                  >
                                    {t("Pending")}
                                  </Typography>
                                ) : (
                                  <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    sx={{
                                      minWidth: 68,
                                      minHeight: 28,
                                      textTransform: "none",
                                      fontSize: "0.7rem",
                                      px: 1.2,
                                      borderRadius: "10px",
                                      fontWeight: 700,
                                      animation: "blink 1s infinite",
                                      "@keyframes blink": {
                                        "0%,100%": { opacity: 1 },
                                        "50%": { opacity: 0.4 },
                                      },
                                    }}
                                    onClick={() => handleApproveClick(row._id)}
                                  >
                                    {t("Accept")}
                                  </Button>
                                )}
                              </TableCell>

                              {!["Agent", "SelfWorker", "Employer"].includes(
                                user?.role,
                              ) && (
                                <TableCell sx={{ py: 1.1 }}>
                                  {row.agent_name}
                                </TableCell>
                              )}

                              {(user?.role === "Admin" ||
                                user?.role === "SuperAdmin") && (
                                <TableCell sx={{ py: 1.1 }}>
                                  {row.employer_name}
                                </TableCell>
                              )}

                              <TableCell sx={{ py: 1.1, fontWeight: 600 }}>
                                Count: {row.number_of_worker}
                              </TableCell>

                              {(user?.role === "Agent" ||
                                user?.role === "SelfWorker" ||
                                user?.role === "Employer" ||
                                user?.role === "Admin" ||
                                user?.role === "SuperAdmin") && (
                                <TableCell sx={{ py: 1.1, fontWeight: 600 }}>
                                  Rs.:{" "}
                                  {row.finalAgentRequiredWage ||
                                    row.per_worker_rates}
                                  /-
                                </TableCell>
                              )}

                              <TableCell sx={{ py: 1.1 }}>
                                {row.send_date_time
                                  ? new Date(
                                      row.send_date_time,
                                    ).toLocaleDateString()
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                            >
                              {t("No attendance data")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            <DialogActions
              sx={{
                justifyContent: "center",
                pb: 2,
                pt: 1,
                backgroundColor: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <Button
                size="small"
                onClick={handleClose}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  borderRadius: "12px",
                  px: 2.5,
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#eff6ff",
                    borderColor: "#2563eb",
                  },
                }}
              >
                {t("Close")}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Dialog
          disablePortal
          open={openDialog}
          onClose={handleCancel}
          fullWidth
          TransitionComponent={Transition}
          keepMounted
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: "24px",
              p: 0,
              overflow: "hidden",
              border: "1px solid rgba(148,163,184,0.18)",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              fontWeight: 800,
              textAlign: "center",
              pb: 1.2,
              pt: 2.2,
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
              color: "#fff !important",
            }}
          >
            Confirm Approval
          </DialogTitle>

          <DialogContent
            sx={{
              textAlign: "center",
              fontSize: { xs: "0.95rem", sm: "1rem" },
              px: { xs: 2, sm: 3 },
              py: 3,
              background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            }}
          >
            Are you sure you want to approve this action?
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 1.2,
              pb: 2.2,
              pt: 0.5,
              background: "#fff",
              borderTop: "1px solid #eef2f7",
            }}
          >
            <Button
              size="small"
              onClick={handleCancel}
              color="primary"
              variant="outlined"
              sx={{
                textTransform: "none",
                minWidth: 96,
                borderRadius: "12px",
                fontWeight: 700,
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              onClick={handleConfirm}
              color="primary"
              variant="contained"
              sx={{
                textTransform: "none",
                minWidth: 96,
                borderRadius: "12px",
                fontWeight: 800,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                boxShadow: "0 12px 24px rgba(37,99,235,0.22)",
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          TransitionComponent={Transition}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: fullScreen ? 0 : "24px",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
              width: fullScreen ? "calc(100% - 0px)" : "calc(100vw - 64px)",
              margin: fullScreen ? "0 auto" : "32px auto",
              position: "relative",
              maxHeight: fullScreen ? "100%" : "unset",
              overflow: "hidden",
              border: "1px solid rgba(148,163,184,0.18)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
            },
          }}
          sx={{
            "& .MuiDialog-paper": {
              margin: 0,
              borderRadius: fullScreen ? 0 : "24px",
              height: fullScreen ? "auto" : "fit-content",
            },
          }}
          open={requirementOpen}
          onClose={handleRequirementClose}
        >
          <DialogContent
            sx={{
              p: 0,
              m: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            }}
          >
            <RequestWorkers
              typeOfReq={requirementType}
              handleRequirementClose={handleRequirementClose}
              setSubscriptionOpen={setSubscriptionOpen}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={requirementTypeOpen}
          onClose={handleRequirementClose}
          fullScreen={fullScreen}
          TransitionComponent={Transition}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              overflow: "hidden",
              borderRadius: fullScreen ? 0 : "28px",
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22)",
              bgcolor: "#ffffff",
              width: fullScreen ? "100%" : 440,
              border: "1px solid #e2e8f0",
              ...(fullScreen
                ? {
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    m: 0,
                    borderRadius: 0,
                  }
                : {
                    m: "auto",
                    position: "relative",
                  }),
            },
          }}
        >
          <Box
            sx={{
              px: 3,
              pt: 2.5,
              pb: 2,
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
              color: "#fff",
              textAlign: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at top right, rgba(255,255,255,0.14), transparent 30%)",
                pointerEvents: "none",
              }}
            />

            <DialogTitle
              sx={{
                p: 0,
                fontWeight: 800,
                fontSize: { xs: "1.05rem", sm: "1.15rem" },
                color: "#fff !important",
                lineHeight: 1.2,
                position: "relative",
                zIndex: 1,
              }}
            >
              {t("selectRequirementType")}
            </DialogTitle>

            <Typography
              sx={{
                mt: 0.8,
                fontSize: "0.84rem",
                color: "rgba(255,255,255,0.88)",
                position: "relative",
                zIndex: 1,
              }}
            >
              Choose the type of requirement you want to post
            </Typography>
          </Box>

          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mt: 0,
              px: 3,
              py: 2.5,
              background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
            }}
          >
            <RadioGroup
              value={requirementType}
              onChange={handleRequirementSelect}
              sx={{ width: "100%", gap: 1.1 }}
            >
              {[
                { label: t("dailyWages"), value: "Daily_Wages" },
                { label: t("contractBased"), value: "Contract_Based" },
                { label: t("SupplyBased"), value: "Supply_Based" },
                { label: t("officeStaff"), value: "Office_Staff" },
              ].map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        color: "#1976d2",
                        "&.Mui-checked": {
                          color: "#1976d2",
                        },
                      }}
                    />
                  }
                  label={
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {option.label}
                    </span>
                  }
                  sx={{
                    mx: 0,
                    borderRadius: "16px",
                    border:
                      requirementType === option.value
                        ? "1.5px solid #1976d2"
                        : "1px solid #e2e8f0",
                    background:
                      requirementType === option.value
                        ? "linear-gradient(90deg, #eff6ff 0%, #e3f2fd 100%)"
                        : "#ffffff",
                    px: 1.8,
                    py: 0.9,
                    transition: "all 0.28s ease",
                    boxShadow:
                      requirementType === option.value
                        ? "0 8px 20px rgba(25,118,210,0.12)"
                        : "0 2px 8px rgba(15,23,42,0.04)",
                    "&:hover": {
                      backgroundColor:
                        requirementType === option.value
                          ? undefined
                          : "#f8fafc",
                      borderColor: "#90caf9",
                    },
                  }}
                />
              ))}
            </RadioGroup>

            <Box
              sx={{
                mt: 1,
                p: 2.5,
                borderRadius: "22px",
                width: "100%",
                background: (() => {
                  switch (requirementType) {
                    case "Daily_Wages":
                      return "linear-gradient(135deg, #e3f2fd, #bbdefb)";
                    case "Contract_Based":
                      return "linear-gradient(135deg, #fff3e0, #ffe0b2)";
                    case "Supply_Based":
                      return "linear-gradient(135deg, #e0f7fa, #b2ebf2)";
                    case "Office_Staff":
                      return "linear-gradient(135deg, #ede7f6, #d1c4e9)";
                    default:
                      return "linear-gradient(135deg, #f8fafc, #eef2f7)";
                  }
                })(),
                textAlign: "center",
                minHeight: fullScreen ? 220 : 190,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.35s ease",
                boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
                border: "1px solid rgba(255,255,255,0.55)",
              }}
            >
              <Box
                sx={{
                  mb: 1.2,
                  fontSize: 60,
                  lineHeight: 1,
                  filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.10))",
                }}
              >
                {requirementType === "Daily_Wages" && "💪"}
                {requirementType === "Contract_Based" && "📄"}
                {requirementType === "Supply_Based" && "🚚"}
                {requirementType === "Office_Staff" && "💼"}
                {!requirementType && "🧠"}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#1f2937",
                  fontSize: { xs: "1rem", sm: "1.08rem" },
                }}
              >
                {requirementType
                  ? {
                      Daily_Wages: "Daily Wage Workers",
                      Contract_Based: "Contract-Based Projects",
                      Supply_Based: "Supply and Labour Supply",
                      Office_Staff: "Office & Admin Staff",
                    }[requirementType]
                  : "Select Requirement Type"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "#475569",
                  maxWidth: 290,
                  lineHeight: 1.55,
                  fontSize: "0.88rem",
                  fontWeight: 500,
                }}
              >
                {requirementType
                  ? {
                      Daily_Wages:
                        "Hire skilled or unskilled workers for daily site work and short-term labour needs.",
                      Contract_Based:
                        "Get manpower teams for time-bound projects, contracts, and planned work execution.",
                      Supply_Based:
                        "Connect for worker supply, bulk labour needs, and manpower arrangement support.",
                      Office_Staff:
                        "Hire professional office, admin, and support staff for business operations.",
                    }[requirementType]
                  : "Choose an option above to see details and continue with the right requirement type."}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "space-between",
              px: 3,
              pb: 2.5,
              pt: 1.2,
              backgroundColor: "#fff",
              borderTop: "1px solid #eef2f7",
            }}
          >
            <Button
              onClick={handleRequirementClose}
              sx={{
                color: "#475569",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 700,
                border: "1px solid #e2e8f0",
                "&:hover": {
                  backgroundColor: "#eef2f7",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirmReqType}
              disabled={!requirementType}
              variant="contained"
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 800,
                background: "linear-gradient(90deg, #1976d2 0%, #185a9d 100%)",
                boxShadow: "0 10px 24px rgba(25,118,210,0.24)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #1669bb 0%, #144e87 100%)",
                },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openVerifyDialog}
          onClose={() => setOpenVerifyDialog(false)}
          maxWidth="lg"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              maxWidth: "980px",
              m: { xs: 2, md: 3 },
              borderRadius: "28px",
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
              border: "1px solid rgba(148, 163, 184, 0.18)",
            },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
                color: "#fff",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(255,255,255,0.10), transparent 30%)",
                  pointerEvents: "none",
                }}
              />

              <Box
                sx={{
                  position: "relative",
                  px: { xs: 2.5, md: 4 },
                  py: { xs: 3, md: 4 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "center", md: "flex-start" },
                    gap: 3,
                  }}
                >
                  {/* Left: Avatar + badge */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minWidth: { md: 170 },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        p: 1.2,
                        borderRadius: "50%",
                        backdropFilter: "blur(12px)",
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
                      }}
                    >
                      <Avatar
                        src={
                          user?.profilePhoto
                            ? `${config.FILE_BASE_URL}/${user.profilePhoto}`.replace(
                                /([^:]\/)\/+/g,
                                "$1",
                              )
                            : "/usericon.png"
                        }
                        sx={{
                          width: 96,
                          height: 96,
                          border: "4px solid rgba(255,255,255,0.95)",
                          boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
                        }}
                      />

                      <Box
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -14,
                          background:
                            "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "999px",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: ".05em",
                          boxShadow: "0 8px 18px rgba(0,0,0,0.28)",
                        }}
                      >
                        VERIFIED
                      </Box>

                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          border: "3px solid #fff",
                          boxShadow: "0 8px 18px rgba(0,0,0,0.24)",
                          fontSize: 16,
                          fontWeight: 800,
                        }}
                      >
                        ✔
                      </Box>
                    </Box>
                  </Box>

                  {/* Right: Content */}
                  <Box
                    sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "1.65rem", md: "2.1rem" },
                        fontWeight: 800,
                        lineHeight: 1.15,
                        mb: 1,
                      }}
                    >
                      {t("getVerifiedNow")}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: { xs: ".95rem", md: "1rem" },
                        color: "rgba(255,255,255,0.84)",
                        maxWidth: 620,
                        mx: { xs: "auto", md: 0 },
                      }}
                    >
                      {t("getVerifiedSubtitle")}
                    </Typography>

                    <Box
                      sx={{
                        mt: 2.5,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.5,
                        py: 0.9,
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        backdropFilter: "blur(8px)",
                        cursor: isMobile ? "pointer" : "default",
                      }}
                      onClick={() => isMobile && setShowBenefits(!showBenefits)}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "#4ade80",
                        }}
                      />
                      <Typography sx={{ fontSize: ".88rem", fontWeight: 600 }}>
                        {t("whyGetVerified")}{" "}
                        {isMobile && (showBenefits ? "▲" : "▼")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Body */}
            <Box
              sx={{
                px: { xs: 2.5, md: 4 },
                py: { xs: 2.5, md: 3.5 },
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
                  gap: 3,
                  alignItems: "start",
                }}
              >
                {isMobile ? (
                  <Collapse in={showBenefits} unmountOnExit>
                    <Box
                      sx={{
                        borderRadius: "22px",
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        p: 2,
                        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                      }}
                    >
                      <Box
                        component="ul"
                        sx={{
                          listStyle: "none",
                          p: 0,
                          m: 0,
                          display: "grid",
                          gap: 1.2,
                        }}
                      >
                        {[
                          t("verifiedBenefits.b1"),
                          t("verifiedBenefits.b2"),
                          t("verifiedBenefits.b5"),
                          t("verifiedBenefits.b6"),
                          t("verifiedBenefits.b7"),
                          t("verifiedBenefits.b8"),
                        ].map((item, index) => (
                          <Box
                            component="li"
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.2,
                              p: 1.2,
                              borderRadius: "14px",
                              background:
                                "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <Box
                              sx={{
                                minWidth: 24,
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 13,
                                fontWeight: 800,
                                mt: "2px",
                                boxShadow: "0 6px 14px rgba(34,197,94,0.25)",
                              }}
                            >
                              ✓
                            </Box>
                            <Typography
                              sx={{
                                color: "#334155",
                                fontSize: ".95rem",
                                lineHeight: 1.55,
                                fontWeight: 500,
                              }}
                            >
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Collapse>
                ) : (
                  <Box
                    sx={{
                      borderRadius: "22px",
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      p: { xs: 2, md: 2.5 },
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <Box
                      component="ul"
                      sx={{
                        listStyle: "none",
                        p: 0,
                        m: 0,
                        display: "grid",
                        gap: 1.2,
                      }}
                    >
                      {[
                        t("verifiedBenefits.b1"),
                        t("verifiedBenefits.b2"),
                        t("verifiedBenefits.b5"),
                        t("verifiedBenefits.b6"),
                        t("verifiedBenefits.b7"),
                        t("verifiedBenefits.b8"),
                      ].map((item, index) => (
                        <Box
                          component="li"
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.2,
                            p: 1.2,
                            borderRadius: "14px",
                            background:
                              "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: 24,
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 800,
                              mt: "2px",
                              boxShadow: "0 6px 14px rgba(34,197,94,0.25)",
                            }}
                          >
                            ✓
                          </Box>
                          <Typography
                            sx={{
                              color: "#334155",
                              fontSize: ".95rem",
                              lineHeight: 1.55,
                              fontWeight: 500,
                            }}
                          >
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Price card */}
                <Box
                  sx={{
                    borderRadius: "22px",
                    overflow: "hidden",
                    border: "1px solid #dbeafe",
                    background: "#fff",
                    boxShadow: "0 12px 34px rgba(37, 99, 235, 0.08)",
                  }}
                >
                  <Box
                    sx={{
                      p: 2.2,
                      background:
                        "linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)",
                      borderBottom: "1px solid #dbeafe",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        mb: 0.5,
                      }}
                    >
                      {t("verifiedFeeBox")}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: ".92rem",
                      }}
                    >
                      {t("premiumResponse")}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2.4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1.2,
                        flexWrap: "wrap",
                        mb: 1.2,
                      }}
                    >
                      {user?.role === "Agent" ? (
                        <>
                          {/* Old Price */}
                          <Typography
                            component="span"
                            sx={{
                              textDecoration: "line-through",
                              color: "#94a3b8",
                              fontWeight: 600,
                              fontSize: "1.05rem",
                              mr: 1,
                            }}
                          >
                            ₹499
                          </Typography>

                          {/* New Price */}
                          <Typography
                            component="span"
                            sx={{
                              color: "#15803d",
                              fontWeight: 900,
                              fontSize: { xs: "2rem", md: "2.35rem" },
                              lineHeight: 1,
                              mr: 1,
                            }}
                          >
                            ₹199
                          </Typography>

                          {/* Discount Badge */}
                          <Typography
                            component="span"
                            sx={{
                              backgroundColor: "#dcfce7",
                              color: "#15803d",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              px: 1.2,
                              py: 0.3,
                              borderRadius: "999px",
                            }}
                          >
                            60% OFF
                          </Typography>
                        </>
                      ) : (
                        <>
                          {/* Old Price */}
                          <Typography
                            component="span"
                            sx={{
                              textDecoration: "line-through",
                              color: "#94a3b8",
                              fontWeight: 600,
                              fontSize: "1.05rem",
                              mr: 1,
                            }}
                          >
                            ₹199
                          </Typography>

                          {/* New Price */}
                          <Typography
                            component="span"
                            sx={{
                              color: "#15803d",
                              fontWeight: 900,
                              fontSize: { xs: "2rem", md: "2.35rem" },
                              lineHeight: 1,
                              mr: 1,
                            }}
                          >
                            ₹49
                          </Typography>

                          {/* Discount Badge */}
                          <Typography
                            component="span"
                            sx={{
                              backgroundColor: "#dcfce7",
                              color: "#15803d",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              px: 1.2,
                              py: 0.3,
                              borderRadius: "999px",
                            }}
                          >
                            75% OFF • Save ₹150
                          </Typography>
                        </>
                      )}
                    </Box>

                    <Typography
                      sx={{
                        color: "#475569",
                        fontSize: ".9rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {t("verifiedFeeNote")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        mt: 3,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleClose}
                        sx={{
                          height: 48,
                          borderRadius: "14px",
                          textTransform: "none",
                          fontWeight: 700,
                          borderColor: "#cbd5e1",
                          color: "#334155",
                        }}
                      >
                        {t("maybeLater")}
                      </Button>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handlePayment}
                        sx={{
                          height: 48,
                          borderRadius: "14px",
                          textTransform: "none",
                          fontWeight: 800,
                          background:
                            "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                          boxShadow: "0 14px 30px rgba(34,197,94,0.26)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
                          },
                        }}
                      >
                        {t("getVerifiedNow")}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
        <AgentAssignModal
          open={assignOpenModal}
          onClose={handleAssignCloseModal}
          ern={assignSelectedErn}
          // agentList={assignAgentList}
          intrestedList={intrestedAgentList}
          role={user?.role} // 'admin' or 'employer'
          onAssign={handleAssignAgent} // for admin
          onAccept={handleAssignAgent} // for employer
          initialDistrict={assignSelectedDistrict}
        />
        <ConfirmationDialog
          open={isOpen}
          message={message}
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
        />
        <CloserSummaryModal
          employerId={user?._id}
          pay_request={payReq}
          open={isCloserModalOpen}
          handleClose={handleCloseCloserModal}
        />
        {user?.role === "Employer" && !user?.isSubscribed && (
          <EmployerSubscriptionDialog
            user={user}
            open={subscriptionOpen}
            onClose={handleClose}
          />
        )}
        <PathLocationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedLocation={selectedLocation}
        />
      </Box>
    </>
  );
};

export default Dashboard;

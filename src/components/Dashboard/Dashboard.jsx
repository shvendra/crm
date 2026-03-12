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
import Location from "../Location"
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

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const availableRoles = JSON.parse(
    localStorage.getItem("availableRoles") || "[]"
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
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
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
    (agent) => agent.status === "Verified" || agent.status === "Unverified"
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
          }
        );

        if (res.data.success) {
          setAgents((prev) =>
            pageNumber === 1 ? res.data.agents : [...prev, ...res.data.agents]
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
      (agent) => agent.agentId === assignedAgentId
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
          stream.status === "Assigned" && stream?.isAgentAccepted === "Yes"
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
        `${config.API_BASE_URL}/api/v1/chat/unread-counts/${user?._id}`
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
        }
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
        { withCredentials: true }
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
              : item
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

  // Close modal
  const handleClose = async () => {
    setOpen(false);
    setOpenVerifyDialog(false);
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
      (agent) => agent?.agentId?.toString?.() === userId?.toString()
    );
  };
  const [agentloading, setagentLoading] = useState(false);

  const getUserWage = (stream, userId) => {
    const agentEntry = stream.intrestedAgents?.find(
      (agent) => agent?.agentId?.toString?.() === userId?.toString()
    );
    return agentEntry?.agentRequiredWage || "";
  };
  const fetchRequirements = async (
    page = 1,
    append = false,
    limit = null,
    search = ""
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
        append ? [...prev, ...transformedData] : transformedData
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
        }
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
        { withCredentials: true }
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
        "Are you sure you want to perform this action?"
      );
      if (confirmed) {
        const res = await axios.put(
          `${config.API_BASE_URL}/api/v1/application/update-status?id=${id}&status=${status}`,
          {},
          {
            withCredentials: true,
          }
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
          { withCredentials: true }
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

  const handleAssignOpenModal = async (
    ern,
    district,
    intrestedAgents,
  ) => {
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
        }
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
    agentRequiredWage
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
          { withCredentials: true }
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
        "Are you sure you want to perform this action?"
      );
      if (confirmed) {
        const response = await axios.put(
          `${config.API_BASE_URL}/api/v1/application/unassignOrAccept`,
          {
            agentId,
            ern,
            isAgentAccepted: "No", // Mark as rejected
          },
          { withCredentials: true }
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
        "Are you sure you want to perform this action?"
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
          }
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
    employer_id
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
    ernNumber
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        pt: "6px",
                      }}
                    >
                      <Location />
                      {/* <DiwaliPopup /> */}
                      {/* <RoleTabs
                        availableRoles={availableRoles}
                        currentUser={user}
                        setUser={setUser}
                      /> */}
                     {/* <a
                        href="tel:+917389791873"
                        style={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.2,
                            px: 1,
                            py: 0.4,
                            borderRadius: "12px",
                            backgroundColor: "rgba(25,118,210,0.08)",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "rgba(25,118,210,0.15)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <SupportAgentIcon sx={{ color: "#1976d2" }} />
                          
                          
                          </Box>
                        </Box>
                      </a>
                      <a
                        href="https://wa.me/15557193421"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.2,
                            px: 1,
                            py: 0.4,
                            borderRadius: "12px",
                            backgroundColor: "rgba(37, 211, 102, 0.08)",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "rgba(37, 211, 102, 0.15)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <WhatsAppIcon sx={{ color: "#25D366" }} />
                           
                           
                          </Box>
                        </Box>
                      </a> */}
                      {/* <a
                        href="https://wa.me/15557193421"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.2,
                            px: 1,
                            py: 0.4,
                            borderRadius: "12px",
                            backgroundColor: "rgba(37, 211, 102, 0.08)",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "rgba(37, 211, 102, 0.15)",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#25D366",
                              opacity: 0.8,
                            }}
                          >
                            10:00 AM – 5:30 PM
                          </Typography>
                        </Box>
                      </a> */}
                    </Box>
                    {user?.isSubscribed && user?.subscriptionExpery && (
                      <SubscriptionPatti expiry={user.subscriptionExpery} />
                    )}{" "}
                    {user?.status === "Unverified" && (
                      <>
                        <Alert
                          severity="error"
                          sx={{
                            mt: "4px",
                            mb: "2px",
                            backgroundColor: "#fff3cd",
                            color: "#795548",
                            borderLeft: "6px solid #ffa000",
                            fontSize: "0.875rem",
                            p: "6px 8px",
                            display: "flex",
                            alignItems: "center", // Center icon + text vertically
                            "& .MuiAlert-icon": {
                              alignItems: "center",
                              marginTop: "0px",
                            },
                            "& .MuiAlert-message": {
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center", // Center text horizontally
                              gap: "4px",
                              p: 0,
                            },
                          }}
                        >
                          {t("kycNotVerifiedMessage")}{" "}
                          {t("kycVerificationInstructions")}{" "}
                          <a
                            onClick={() => navigateTo("/my/profile")}
                            style={{
                              color: "#d84315",
                              fontWeight: "bold",
                              textDecoration: "none",
                              cursor: "pointer",
                              transition: "color 0.3s ease",
                              animation: "blink 1.5s infinite",
                              textTransform: "none",
                              "@keyframes blink": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0.4 },
                                "100%": { opacity: 1 },
                              },
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.color = "#bf360c")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.color = "#d84315")
                            }
                          >
                            {t("upload")}
                          </a>
                        </Alert>
                      </>
                    )}
                    <ServiceBoxGrid />
                    
                    <Divider
                      sx={{
                        borderColor: "#1876d2",
                        borderBottomWidth: "5px",
                        opacity: 1.25,
                      }}
                    />
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ p: 0, m: 0 }}
                    >
                      <Box>
                        <Typography
                          className="dash-head"
                          variant="h6"
                          sx={{ mb: 0, p: 0, ml: "3px", lineHeight: 1.2 }}
                        >
                          {user?.isSubscribed === false ||
                          currentReq.length === 0 ||
                          currentReq.every(
                            (req) => req.status === "Assigned"
                          ) ? (
                            <>
                              {t("agentnearyoudash")}
                              <Box
                                component="span"
                                sx={{
                                  display: "block",
                                  color: "lightgray",
                                  fontSize: "0.9rem",
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
                                  color: "lightgray",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {t("reqpostdash")}
                              </Box>
                            </>
                          )}
                        </Typography>
                      </Box>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ p: 0, m: 0 }}
                      >
                        {/* Left Section: History + Refresh */}
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{ pb: "12px", mr: "7px" }}
                        >
                          {/* History Button */}
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            sx={{ gap: 0 }}
                          >
                            <IconButton
                              onClick={() => navigate("/history")}
                              aria-label="History"
                              color="primary"
                              sx={{ p: 0, m: 0 }}
                            >
                              <HistoryIcon sx={{ p: 0, m: 0 }} />
                            </IconButton>
                            <Typography
                              variant="caption"
                              sx={{ lineHeight: 0.4 }}
                            >
                              {t("history")}
                            </Typography>
                          </Box>

                          {/* Refresh Button */}
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            sx={{ gap: 0 }}
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
                              sx={{ p: 0, m: 0 }}
                            >
                              <RefreshIcon sx={{ p: 0, m: 0 }} />
                            </IconButton>
                            <Typography
                              variant="caption"
                              sx={{ lineHeight: 0.4 }}
                            >
                              {t("refresh")}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Right Section: Post Requirement Button */}
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            py: 0.2,
                            px: 1.2,

                            fontSize: "0.75rem",
                            lineHeight: 1,
                            minHeight: "32px",
                            borderRadius: "6px",
                            borderColor: "#1b76d3",
                            textTransform: "none",
                            animation: `${blink} 1s infinite`,
                            "&:hover": {
                              borderColor: "black",
                              backgroundColor: "rgba(0,0,0,0.08)",
                            },
                          }}
                          startIcon={<AddCircleIcon sx={{ fontSize: 14 }} />}
                          onClick={handleRequirementOpen}
                        >
                          {t("postRequirement")}
                        </Button>
                      </Box>
                    </Box>
                    <Divider
                      sx={{
                        // mb: 1,
                        borderColor: "#1876d2",
                        borderBottomWidth: "5px",
                        opacity: 1.25,
                      }}
                    />
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
                    <Grid sx={{ mt: 0.5 }} container spacing={0}>
                      
                      {currentReq.length === 0 ||
                      currentReq.every((req) => req.status === "Assigned") ? (
                        <Grid item xs={12}>
  <Box
    sx={{
      borderRadius: 4,
      background:
        "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
      border: "1px solid #e3eefc",
      boxShadow: "0 12px 40px rgba(25, 118, 210, 0.08)",
      px: { xs: 1.2, sm: 2, md: 2.5 },
      py: { xs: 1.5, sm: 2, md: 2.5 },
      overflow: "hidden",
    }}
  >
    {/* Header */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem" },
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.2,
          }}
        >
          Verified Agents
        </Typography>
        <Typography
          sx={{
            fontSize: "0.84rem",
            color: "#64748b",
            mt: 0.4,
          }}
        >
          Trusted manpower suppliers and verified workforce providers near you
        </Typography>
      </Box>

      <Box
        sx={{
          px: 1.4,
          py: 0.7,
          borderRadius: "999px",
          bgcolor: "#e8f1fd",
          color: "#185a9d",
          fontSize: "0.8rem",
          fontWeight: 700,
        }}
      >
        {totalAgents + 300}+ Agents
      </Box>
    </Box>

    {/* Agents Grid */}
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
            minHeight: 140,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {displayedAgents.map((agent, idx) => (
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
            borderRadius: 3,
            p: { xs: 1, sm: 1.2 },
            background: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
            transition: "all 0.25s ease",
            textAlign: "center",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 14px 28px rgba(25, 118, 210, 0.16)",
              borderColor: "#90caf9",
            },
          }}
        >
          <Stack alignItems="center" spacing={0.8} sx={{ position: "relative" }}>
            {/* Avatar */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={
                  agent?.profilePhoto
                    ? `${config.FILE_BASE_URL}/${agent?.profilePhoto}`.replace(
                        /([^:]\/)\/+/g,
                        "$1"
                      )
                    : "/usericon.png"
                }
                alt={agent.name}
                sx={{
                  width: { xs: 52, sm: 58 },
                  height: { xs: 52, sm: 58 },
                  border: "2.5px solid #1976d2",
                  boxShadow: "0 8px 20px rgba(25, 118, 210, 0.18)",
                }}
              />

              {/* Verified Badge */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -3,
                  right: -3,
                  background: "linear-gradient(135deg, #1976d2 0%, #185a9d 100%)",
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

            {/* Name */}
            <Typography
              variant="body2"
              fontWeight={700}
              noWrap
              sx={{
                color: "#14532d",
                fontSize: { xs: "0.72rem", sm: "0.76rem" },
                maxWidth: "100%",
              }}
            >
              {agent.name?.split(" ")[0]?.slice(0, 8) || "-"}
            </Typography>

            {/* Masked Number */}
            <Typography
              variant="caption"
              sx={{
                color: "#2563eb",
                fontSize: { xs: "0.66rem", sm: "0.7rem" },
                wordBreak: "break-word",
                fontWeight: 600,
              }}
            >
              {getRandom10DigitNumber()}
            </Typography>

            {/* Rating */}
            <Box
              mt={0.2}
              display="flex"
              justifyContent="center"
              sx={{
                px: 0.8,
                py: 0.4,
                borderRadius: "999px",
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
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
      ))}

      {/* +More Card */}
      {!showAll && verifiedAgents.length > 20 && (
        <Box
          onClick={() => navigate("/verified-agents")}
          sx={{
            cursor: "pointer",
            borderRadius: 3,
            p: { xs: 1, sm: 1.2 },
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "1px dashed #60a5fa",
            boxShadow: "0 6px 18px rgba(37, 99, 235, 0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: { xs: 118, sm: 132 },
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 14px 28px rgba(37, 99, 235, 0.16)",
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1rem", sm: "1.15rem" },
                fontWeight: 800,
                color: "#185a9d",
                lineHeight: 1.2,
              }}
            >
              +{totalAgents + 300 - 8} More
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "#475569",
              }}
            >
              Verified Agents
            </Typography>
          </Box>
        </Box>
      )}
    </Box>

    {/* Load More */}
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
            fontWeight: 700,
            fontSize: "0.95rem",
            px: 4,
            py: 1.2,
            background: "linear-gradient(90deg, #1976d2 0%, #185a9d 100%)",
            boxShadow: "0 8px 20px rgba(25, 118, 210, 0.28)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 28px rgba(25, 118, 210, 0.35)",
              transform: "translateY(-2px)",
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
                              stream?.status !== "Assigned"
                          )
                          .map((stream, index) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              key={index}
                              sx={{
                                pt: "8px !important",
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
                                  p: "4px",
                                  m: "2px",
                                  backgroundImage: `url(${getBestMatchingImage(stream?.workType)})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",

                                  // ✅ Make sure children are above overlays
                                  "& > *": {
                                    position: "relative",
                                    zIndex: 2,
                                  },

                                  // ✅ Dark overlay behind content
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    inset: 0,
                                    backgroundColor: "rgba(0, 0, 0, 0.80)", // overlay darkness
                                    zIndex: 1, // ensure it's *below* children
                                  },

                                  // ✅ Watermark text in the very back
                                  "&::after": {
                                    content: '"BookMyWorker"',
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "2.5rem",
                                    fontWeight: 600,
                                    color: "rgba(0, 100, 0, 0.04)",
                                    zIndex: 0, // stays behind everything
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
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                flexWrap: "wrap", // Important for responsiveness on smaller screens
                                                rowGap: 1, // Add some vertical gap when wrapping
                                              }}
                                            >
                                              {/* Left: ERN Number with Clickable */}
                                              {stream.status === "Approved" ? (
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    fontWeight: 600,
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
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    color: "#aeeaff",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    fontSize: "17px",
                                                    flex: "1 1 auto",
                                                    minWidth: 0,
                                                  }}
                                                  onClick={() =>
                                                    handleAssignOpenModal(
                                                      stream.ern_num,
                                                      stream.city,
                                                      stream?.intrestedAgents
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

                                              {/* Right: Date + Chat + Close (Stacked Inline) */}
                                              <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1}
                                                sx={{
                                                  flexShrink: 0,
                                                  flexWrap: "wrap", // In case buttons need to wrap on mobile
                                                }}
                                              >
                                                {/* <Typography
                                                  variant="body2"
                                                  sx={{
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    color: '#1a76d2',
                                                  }}
                                                >
                                                  {stream?.workerNeedDate}
                                                </Typography> */}

                                                {/* Chat Button */}
                                                <Button
                                                  variant="contained"
                                                  color="success"
                                                  size="small"
                                                  sx={{
                                                    padding: "0 6px",
                                                    minHeight: "22px",
                                                    height: "22px",
                                                    fontSize: "0.65rem",
                                                    lineHeight: 1,
                                                    borderRadius: "6px",
                                                    textTransform: "none",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    "@media (max-width:600px)":
                                                      {
                                                        padding: "0 4px",
                                                        minHeight: "20px",
                                                        height: "20px",
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
                                                      padding: "0 6px",
                                                      minHeight: "22px",
                                                      height: "22px",
                                                      fontSize: "0.65rem",
                                                      lineHeight: 1,
                                                      borderRadius: "6px",
                                                      textTransform: "none",
                                                      display: "flex",
                                                      alignItems: "center",

                                                      color: "#fff",
                                                      "@media (max-width:600px)":
                                                        {
                                                          padding: "0 4px",
                                                          minHeight: "20px",
                                                          height: "20px",
                                                          fontSize: "0.6rem",
                                                        },
                                                      "&:hover": {
                                                        backgroundColor:
                                                          "#058034ff",
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
                                                      padding: "0 6px",
                                                      minHeight: "22px",
                                                      height: "22px",
                                                      fontSize: "0.65rem",
                                                      lineHeight: 1,
                                                      borderRadius: "6px",
                                                      textTransform: "none",
                                                      display: "flex",
                                                      alignItems: "center",
                                                      color: "#fff",
                                                      "@media (max-width:600px)":
                                                        {
                                                          padding: "0 4px",
                                                          minHeight: "20px",
                                                          height: "20px",
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
                                                        stream._id
                                                      )
                                                    }
                                                  >
                                                    {t("close")}
                                                  </Button>
                                                )}

                                                {/* Close Button */}
                                              </Stack>

                                              {/* Chat Component */}
                                              {openChatIds.has(stream._id) && (
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

                                            {/* District */}
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <LocationCityIcon
                                                color="primary"
                                                fontSize="small"
                                              />
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontWeight: 600,
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
                                              }}
                                            >
                                              <PlaceIcon
                                                color="primary"
                                                fontSize="small"
                                              />
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontWeight: 600,
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
                                              }}
                                            >
                                              <BusinessIcon
                                                color="primary"
                                                fontSize="small"
                                              />
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontWeight: 600,
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
                                                  i18n.language
                                                )}{" "}
                                                - {""}
                                                {translateFromJson(
                                                  stream?.subCategory,
                                                  i18n.language
                                                )}
                                              </Typography>
                                            </Box>
                                            {/* District */}
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <GroupsIcon
                                                color="primary"
                                                fontSize="small"
                                              />
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontWeight: 600,
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

                                            {/* Site */}
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                mb: 2,
                                              }}
                                            >
                                              <CurrencyRupeeIcon
                                                color="primary"
                                                fontSize="small"
                                              />
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontWeight: 600,
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
                                                  stream?.assignedAgentId
                                                )}
                                              </Typography>
                                            </Box>
                                            <Grid item xs={12}>
                                              {[
                                                {
                                                  key: "accommodationAvailable",
                                                  label: t(
                                                    "accommodationAvailable"
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
                                                    stream?.[item.key] === true
                                                )
                                                .map((item) => (
                                                  <Box
                                                    key={item.key}
                                                    sx={{
                                                      display: "inline-block",
                                                      bgcolor: "#2e7d32", // dark green (Material color)
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
                                            <Box sx={{ mt: 1 }}>
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  gap: 1,
                                                  border: "1px solid black",
                                                  borderRadius: 1,
                                                }}
                                              >
                                                <Button
                                                  fullWidth
                                                  startIcon={<SupportAgent />}
                                                  sx={{
                                                    // ...menuButtonStyle,
                                                    backgroundColor: "#e0f7fa",
                                                    color: "#00796b",
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
                                    {/* <Button
                                    variant="contained"
                                    color="warning"
                                    size="small"
                                    sx={{ margin: 1 }}
                                  >
                                    {t("open")}
                                  </Button> */}
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
                                          bgcolor: "rgba(0,0,0,0.7)",
                                          zIndex: 10,
                                          color: "#fff",
                                          display: "flex",
                                          flexDirection: "column",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          p: 3,
                                          textAlign: "center",
                                          borderRadius: 2,
                                        }}
                                      >
                                        <Alert
                                          icon={false}
                                          severity="warning"
                                          sx={{}}
                                        >
                                          <Typography
                                            sx={{
                                              fontWeight: "bold",
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
                    {/* { currentReq.length > visibleCount && (
                      <Box sx={{ textAlign: "center", mt: 1 }}>
                        <Button variant="outlined" onClick={handleLoadMore}>
                          {t("loadMore") || "Load More"}
                        </Button>
                      </Box>
                    )} */}
                    
                  </CardContent>
                </Card>
              </Grid>
{currentReq.filter(
  (stream) => stream?.isAgentAccepted !== "No"
).length !== 0 ? (
  <div>   <Grid item sx={{ mb: 0 }} xs={12}>
                <Card sx={{ boxShadow: 0, borderRadius: 2 }}>
                  <CardContent className="dash-card-content">
                    <Divider
                      sx={{
                        borderColor: "#1876d2",
                        borderBottomWidth: "5px",
                        opacity: 1.25,
                      }}
                    />
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ p: 0, m: 0 }}
                    >
                      <Typography
                        className="dash-head"
                        variant="h6"
                        sx={{ mb: 0, p: 0 }}
                      >
                        {t("activeWorkStream")}
                      </Typography>
                    </Box>

                    <Divider
                      sx={{
                        borderColor: "#1876d2",
                        borderBottomWidth: "5px",
                        opacity: 1.25,
                      }}
                    />
                    <Grid sx={{ mt: 0.5 }} container spacing={0.5}>
                      {currentReq.filter(
                        (stream) => stream?.isAgentAccepted !== "No"
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
  sm: `url("${config.FILE_BASE_URL}/ImagesWeb/emp_head.png")`,     // Tablets and up
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
                              stream?.isAgentAccepted === "Yes"
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
                                  pt: "8px !important",
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
                                    p: "4px",
                                    backgroundImage: `url(${getBestMatchingImage(stream?.workType)})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",

                                    // ✅ Make sure children are above overlays
                                    "& > *": {
                                      position: "relative",
                                      zIndex: 2,
                                    },

                                    // ✅ Dark overlay behind content
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      inset: 0,
                                      backgroundColor: "rgba(0, 0, 0, 0.80)", // overlay darkness
                                      zIndex: 1, // ensure it's *below* children
                                    },

                                    // ✅ Watermark text in the very back
                                    "&::after": {
                                      content: '"BookMyWorker"',
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      fontSize: "2.5rem",
                                      fontWeight: 600,
                                      color: "rgba(0, 100, 0, 0.04)",
                                      zIndex: 0, // stays behind everything
                                      pointerEvents: "none",
                                      whiteSpace: "nowrap",
                                    },
                                  }}
                                >
                                  <>
                                    <CardContent
                                      className="dash-card-content"
                                      sx={{ color: "#000" }}
                                    >
                                      <Box sx={{ mb: 0 }}>
                                        {/* ERN and Date */}
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                          }}
                                        >
                                          <Tooltip
                                            title={t("clickToViewDetails")}
                                            arrow
                                          >
                                            <ButtonBase
                                              onClick={() =>
                                                handleCardClick(
                                                  stream?._id,
                                                  stream?.finalAgentRequiredWage
                                                )
                                              }
                                              sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                  backgroundColor:
                                                    "rgba(25, 118, 210, 0.1)",
                                                  textDecoration: "underline",
                                                },
                                              }}
                                            >
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontWeight: 600,
                                                  color: "#aeeaff",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "3px",
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
                                          {/* {stream.req_type !== 'Contract_Based' && (
                                            <>
                                              <Typography sx={{ fontWeight: 600 }} variant="body2">
                                                {stream?.workerNeedDate}
                                              </Typography>
                                            </>
                                          )} */}
                                          <IconButton
                                            onClick={() =>
                                              handleLocationClick(
                                                stream?.latitude,
                                                stream?.longitude
                                              )
                                            }
                                            sx={{
                                              p: 0,
                                              m: 0,
                                              minWidth: 32,
                                            }}
                                          >
                                            <LocationOnIcon
                                              color="primary"
                                              fontSize="small"
                                            />
                                          </IconButton>
                                        </Box>

                                        {/* Site & Worker Details */}
                                        <Box
                                          sx={{
                                            justifyContent: "space-between",
                                            mb: 1,
                                          }}
                                        >
                                          <Typography
                                            variant="body1"
                                            sx={{
                                              fontWeight: 600,
                                              color: "white",
                                            }}
                                          >
                                            {t("city")}: {stream.city}
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            sx={{
                                              fontWeight: 600,
                                              color: "white",
                                            }}
                                          >
                                            {t("site")}: {stream?.tehsil + " "}
                                            {stream?.site}
                                          </Typography>
                                        </Box>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mt: 1,
                                          }}
                                        >
                                          {/* Attendance Stats */}
                                          {stream.req_type !==
                                            "Contract_Based" && (
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                border: "1px solid black",
                                                p: 0.5,
                                                borderRadius: 1,
                                                background: "white",
                                                fontWeight: "800",
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
                                              border: "1px solid black",
                                              p: 0.5,
                                              borderRadius: 1,
                                              background: "white",
                                              fontWeight: "800",
                                            }}
                                          >
                                            {stream.req_type !==
                                            "Contract_Based"
                                              ? `${t("quotePerHead")}: ₹ `
                                              : `${t("BudgetContract")}: ₹ `}
                                            {getPerHeadWages(
                                              stream,
                                              stream?.finalAgentRequiredWage,
                                              stream?.assignedAgentId
                                            )}
                                          </Typography>
                                        </Box>

                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mt: 1,
                                          }}
                                        >
                                          {stream.req_type !==
                                            "Contract_Based" && (
                                            <>
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  border: "1px solid black",
                                                  p: 0.5,
                                                  borderRadius: 1,
                                                  background: "white",
                                                  fontWeight: "800",
                                                }}
                                              >
                                                {t("totalWorkersReceived")}:{" "}
                                                {reqStats?.attendancedetails_total_workers ??
                                                  0}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  border: "1px solid black",
                                                  p: 0.5,
                                                  borderRadius: 1,
                                                  background: "white",
                                                  fontWeight: "800",
                                                }}
                                              >
                                                {t("workDaysLabel")}:{" "}
                                                {reqStats?.attendancedetails_total_work_days ??
                                                  0}
                                              </Typography>
                                            </>
                                          )}
                                        </Box>

                                        {(stream?.assignedAgentName ||
                                          stream?.assignedAgentPhone) && (
                                          <Box sx={{ mt: 1 }}>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                gap: 1,
                                                border: "1px solid black",
                                                borderRadius: 1,
                                              }}
                                            >
                                              {/* Assigned Agent Button */}
                                              <Button
                                                fullWidth
                                                startIcon={<SupportAgent />}
                                                sx={{
                                                  backgroundColor: "#e0f7fa",
                                                  color: "#00796b",
                                                  "&:hover": {
                                                    backgroundColor: "#b2ebf2",
                                                  },
                                                }}
                                                href={`tel:${stream?.assignedAgentPhone ?? ""}`}
                                              >
                                                {t("Agent")}:{" "}
                                                <IconButton
                                                  color="primary"
                                                  component="a"
                                                  href={`tel:${stream?.assignedAgentPhone ?? ""}`}
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  } // Prevent nested click propagation
                                                  sx={{ ml: 1 }}
                                                >
                                                  <CallIcon titleAccess="Call" />
                                                </IconButton>
                                              </Button>

                                              {/* Support Button */}
                                              <Button
                                                fullWidth
                                                startIcon={<SupportAgent />}
                                                sx={{
                                                  backgroundColor: "#e0f7fa",
                                                  color: "#00796b",
                                                  "&:hover": {
                                                    backgroundColor: "#b2ebf2",
                                                  },
                                                }}
                                                href="tel:7389791873"
                                              >
                                                {t("support")}:{" "}
                                                <IconButton
                                                  color="primary"
                                                  component="a"
                                                  href="tel:7389791873"
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  sx={{ ml: 1 }}
                                                >
                                                  <CallIcon titleAccess="Call" />
                                                </IconButton>
                                              </Button>
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    </CardContent>

                                    {/* Buttons */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        p: 0,
                                      }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        sx={{ margin: 1 }}
                                        startIcon={
                                          <Badge
                                            badgeContent={
                                              unreadCounts[stream._id] || 0
                                            }
                                            color="error"
                                          >
                                            <ChatIcon />
                                          </Badge>
                                        }
                                        onClick={() => toggleChat(stream._id)}
                                      >
                                        Chat
                                      </Button>

                                      {openChatIds.has(stream._id) && (
                                        <Chat
                                          postId={stream._id}
                                          senderId={user._id}
                                          senderRole={user.role}
                                          employerName={t("Admin")}
                                          onClose={() => toggleChat(stream._id)}
                                          onUnreadCountChange={
                                            handleUnreadCountChange
                                          } // ✅
                                        />
                                      )}

                                      <Button
                                        variant="contained"
                                        color="info"
                                        size="small"
                                        sx={{ margin: 1 }}
                                        onClick={() =>
                                          handleOpenCloserModal(
                                            stream?._id,
                                            stream?.finalAgentRequiredWage,
                                            stream?.req_type,
                                            stream?.assignedAgentId,
                                            "Assigned",
                                            stream?.ern_num
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
              </Grid></div>
) : null}

              {/* Active work stream */}
           
            </>
          )}
          {(user?.role === "Agent" || user?.role === "SelfWorker") && (
            <>
              {/* Active work stream */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 0, borderRadius: 2 }}>
                  <CardContent className="dash-card-content">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        pt: "6px",
                      }}
                    >
                      {/* <DiwaliPopup /> */}
                                            <Location />

                      {/* <RoleTabs
                        availableRoles={availableRoles}
                        currentUser={user}
                        setUser={setUser}
                      /> */}
                      {/* <a
                        href="tel:+917389791873"
                        style={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.2,
                            px: 1,
                            py: 0.4,
                            borderRadius: "12px",
                            backgroundColor: "rgba(25,118,210,0.08)",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "rgba(25,118,210,0.15)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <SupportAgentIcon sx={{ color: "#1976d2" }} />
                           
                          </Box>
                        </Box>
                      </a>
                      <a
                        href="https://wa.me/15557193421"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.2,
                            px: 1,
                            py: 0.4,
                            borderRadius: "12px",
                            backgroundColor: "rgba(37, 211, 102, 0.08)",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "rgba(37, 211, 102, 0.15)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <WhatsAppIcon sx={{ color: "#25D366" }} />
                         
                          </Box>
                        </Box>
                      </a> */}
                      {/* <a
                        href="https://wa.me/15557193421"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.2,
                            px: 1,
                            py: 0.4,
                            borderRadius: "12px",
                            backgroundColor: "rgba(37, 211, 102, 0.08)",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "rgba(37, 211, 102, 0.15)",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#25D366",
                              opacity: 0.8,
                            }}
                          >
                            10:00 AM – 5:30 PM
                          </Typography>
                        </Box>
                      </a> */}
                    </Box>
                    {user?.status === "Unverified" && (
                      <>
                        <Alert
                          severity="error"
                          sx={{
                            mt: "4px",
                            mb: "4px",
                            backgroundColor: "#fff3cd",
                            color: "#795548",
                            borderLeft: "6px solid #ffa000",
                            fontSize: "0.875rem",
                            // p: 0,
                            "& .MuiAlert-message": {
                              padding: 0,
                            },
                          }}
                        >
                          {t("kycNotVerifiedMessage")}
                          {t("kycVerificationInstructions")}{" "}
                          <a
                            onClick={() => navigateTo("/my/profile")}
                            style={{
                              color: "#d84315",
                              fontWeight: "bold",
                              textDecoration: "none",
                              cursor: "pointer",
                              transition: "color 0.3s ease",
                              animation: "blink 1.5s infinite",
                              textTransform: "none",
                              "@keyframes blink": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0.4 },
                                "100%": { opacity: 1 },
                              },
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.color = "#bf360c")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.color = "#d84315")
                            }
                          >
                            {t("upload")}
                          </a>
                          .
                        </Alert>
                      </>
                    )}
                    {user?.role === "Agent" && myJobsCount < 10 && (
                      <>
                        {/* Second Alert */}
                        <Alert
                          severity="error"
                          sx={{
                            mt: "4px",
                            mb: "4px",
                            backgroundColor: "#fff3cd",
                            color: "#795548",
                            borderLeft: "6px solid #ffa000",
                            fontSize: "0.875rem",
                            "& .MuiAlert-message": {
                              padding: 0,
                            },
                          }}
                        >
                          {t("YouMustAddMinimum")} <strong>10</strong>{" "}
                          {t("WorkersToActivateProfile")}{" "}
                          {t("HigherChancesMessage")}{" "}
                          <a
                            onClick={() => navigateTo("/job/post")}
                            style={{
                              color: "#d84315",
                              fontWeight: "bold",
                              textDecoration: "none",
                              cursor: "pointer",
                              transition: "color 0.3s ease",
                              animation: "blink 1.5s infinite",
                              textTransform: "none",
                              "@keyframes blink": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0.4 },
                                "100%": { opacity: 1 },
                              },
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.color = "#bf360c")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.color = "#d84315")
                            }
                          >
                            {t("CurrentWorkerCount")} {myJobsCount}.
                          </a>
                        </Alert>
                      </>
                    )}
                   <ServiceBoxGrid />
                    
              {currentReq.filter(
  (stream) =>
    stream.status === "Assigned" &&
    stream.assignedAgentId === user?._id
).length !== 0 ? (
  <div>   <Divider
                      sx={{
                        mb: 1,
                        borderColor: "#1876d2",
                        borderBottomWidth: "5px",
                        opacity: 1.25,
                      }}
                    />
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ p: 0, m: 0 }}
                    >
                      <Typography
                        className="dash-head"
                        variant="h6"
                        sx={{ mb: 0, p: 0, lineHeight: 1.1 }}
                      >
                        {t("activeWorkStream")}
                        <Box
                          component="span"
                          sx={{
                            display: "block",
                            color: "lightgray",
                            fontSize: "0.9rem",
                            lineHeight: 1.1,
                          }}
                        >
                          {t("activeWorkStreamSubtext")}
                        </Box>
                      </Typography>

                      <Stack direction="row" spacing={0.5} sx={{ pb: "8px" }}>
                        {/* History Button */}
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          sx={{ gap: 0 }}
                        >
                          <IconButton
                            onClick={() => navigate("/history")}
                            aria-label="History"
                            color="primary"
                            sx={{ p: 0, m: 0 }}
                          >
                            <HistoryIcon sx={{ p: 0, m: 0 }} />
                          </IconButton>
                          <Typography
                            variant="caption"
                            sx={{ lineHeight: 0.4 }}
                          >
                            {t("history")}
                          </Typography>
                        </Box>

                        {/* Refresh Button */}
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          sx={{ gap: 0 }}
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
                            sx={{ p: 0, m: 0 }}
                          >
                            <RefreshIcon sx={{ p: 0, m: 0 }} />
                          </IconButton>
                          <Typography
                            variant="caption"
                            sx={{ lineHeight: 0.4 }}
                          >
                            {t("refresh")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Divider
                      sx={{
                        mb: 1,
                        borderColor: "#1876d2",
                        borderBottomWidth: "5px",
                        opacity: 1.25,
                      }}
                    />{" "}
                    <Grid sx={{ mt: 0.5 }} container spacing={0.5}>
                      {currentReq.filter(
                        (stream) =>
                          stream.status === "Assigned" &&
                          stream.assignedAgentId === user?._id
                      ).length === 0 ? (
                        <Grid item xs={12} sx={{ pt: 0, pb: 0 }}>
                          <Box
                            sx={{
                              height: "250px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
backgroundImage: {
  xs: `url("${config.FILE_BASE_URL}/ImagesWeb/${
    user?.role === "Agent"
      ? {
          en: "head-agent_mob.png",
          hi: "agent-hindi.png",
          mr: "agent-marathi.png",
          gu: "agent-gujrati.png",
        }[currentLang] || "agent-hindi.png"
      : {
          en: "worker-hindi.png",
          hi: "worker-hindi.png",
          mr: "worker-marathi.png",
          gu: "worker-gujrati.png",
        }[currentLang] || "worker-hindi.png"
  }")`,
  sm: `url("${config.FILE_BASE_URL}/ImagesWeb/agent_desk_1.png")`,
},


                              backgroundSize: {
                                xs: "cover",
                                sm: "cover",
                              }, // or "contain" depending on your need
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              borderRadius: 2,
                            }}
                          >
                            {!showWelcome ? (
                              <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ fontSize: "0.875rem" }} // Adjust font size as needed
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
                                      borderRadius: 4,
                                      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                                      overflow: "hidden",
                                    },
                                  }}
                                >
                                  <DialogTitle
                                    sx={{
                                      textAlign: "center",
                                      fontWeight: 700,
                                      fontSize: "1.6rem",
                                      background:
                                        "linear-gradient(90deg, #1e88e5, #64b5f6)",
                                      color: "#fff !important", // Force white text
                                      py: 1.5,
                                    }}
                                  >
                                    {t("greetingTitle")}
                                  </DialogTitle>

                                  <DialogContent
                                    sx={{
                                      px: 1,
                                      py: 1,
                                      backgroundColor: "#fafafa",
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
                                          "url('/home-slide-2.jpeg')", // Replace with your actual path
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        opacity: 0.15, // Adjust opacity here (0.05–0.15 is subtle)
                                        zIndex: 0,
                                      }}
                                    />

                                    {/* Content Above the Background */}
                                    <Box
                                      sx={{ position: "relative", zIndex: 1 }}
                                    >
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          mb: 2,
                                          fontWeight: 600,
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
                                          // backgroundColor: "#fff",
                                          borderRadius: 3,
                                          p: 1,
                                          mb: 2,
                                          boxShadow:
                                            "0 4px 20px rgba(0,0,0,0.05)",
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
                                              mb: index !== 2 ? 1 : 0,
                                            }}
                                          >
                                            <CheckCircleIcon
                                              sx={{
                                                color: "#4caf50",
                                                fontSize: "1.1rem",
                                                mt: "2px",
                                                mr: 1,
                                              }}
                                            />
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                color: "text.secondary",
                                                fontWeight: "bolder",
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
                                          fontWeight: 600,
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
                                        }}
                                      >
                                        {t("regards")}
                                        <br />
                                        <strong>Team BookMyWorker</strong>
                                      </Typography>
                                    </Box>
                                  </DialogContent>

                                  <DialogActions
                                    sx={{
                                      justifyContent: "center",
                                      py: 1.5,
                                      background: "#f9f9f9",
                                      borderTop: "1px solid #e0e0e0",
                                    }}
                                  >
                                    <Button
                                      onClick={handleCloseWelcome}
                                      variant="contained"
                                      color="primary"
                                      size="small"
                                      sx={{ borderRadius: 3 }}
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
                              stream.assignedAgentId === user?._id
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
                                  pt: "8px !important",
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
                                    p: "4px",
                                    backgroundImage: `url(${getBestMatchingImage(stream?.workType)})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      inset: 0,
                                      backgroundColor: "rgba(0, 0, 0, 0.80)", // white overlay for readability
                                      zIndex: 0,
                                    },
                                    "&::after": {
                                      content: '"BookMyWorker"',
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      fontSize: "2.5rem",
                                      fontWeight: 600,
                                      color: "rgba(0, 100, 0, 0.04)",
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
                                        color: "#000",
                                        position: "relative",
                                        zIndex: 1,
                                      }}
                                    >
                                      <Box sx={{ mb: 1 }}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                          }}
                                        >
                                          <Tooltip
                                            title={t("clickToViewDetails")}
                                            arrow
                                          >
                                            <ButtonBase
                                              onClick={() =>
                                                handleCardClick(
                                                  stream?._id,
                                                  stream?.finalAgentRequiredWage
                                                )
                                              }
                                              sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                  backgroundColor:
                                                    "rgba(25, 118, 210, 0.1)",
                                                  textDecoration: "underline",
                                                },
                                              }}
                                            >
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontWeight: 600,
                                                  color: "#aeeaff",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "3px",
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
                                          {/* {stream.req_type !== 'Contract_Based' && (
                                            <>
                                              <Typography sx={{ fontWeight: 600 }} variant="body2">
                                                {stream?.workerNeedDate}
                                              </Typography>
                                            </>
                                          )} */}
                                          <IconButton
                                            onClick={() =>
                                              handleLocationClick(
                                                stream?.latitude,
                                                stream?.longitude
                                              )
                                            }
                                            sx={{
                                              p: 0,
                                              m: 0,
                                              minWidth: 32,
                                            }}
                                          >
                                            <LocationOnIcon
                                              color="primary"
                                              fontSize="small"
                                            />
                                          </IconButton>
                                        </Box>

                                        <Box
                                          sx={{
                                            mb: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            // gap: 0.6,
                                          }}
                                        >
                                          {/* City */}
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                            }}
                                          >
                                            <LocationCityIcon
                                              fontSize="small"
                                              sx={{ color: "white" }}
                                            />
                                            <Typography
                                              variant="body1"
                                              sx={{ fontWeight: 400 }}
                                            >
                                              <strong
                                                style={{ fontWeight: 600 }}
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

                                          {/* Site */}
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                            }}
                                          >
                                            <LocationOnIcon
                                              fontSize="small"
                                              sx={{ color: "white" }}
                                            />
                                            <Typography
                                              variant="body1"
                                              sx={{ fontWeight: 400 }}
                                            >
                                              <strong
                                                style={{ fontWeight: 600 }}
                                              >
                                                {t("site")}:
                                              </strong>{" "}
                                              <span
                                                style={{
                                                  fontSize: "14px",
                                                  color: "white",
                                                }}
                                              >
                                                {stream?.tehsil} {stream?.site}
                                              </span>
                                            </Typography>
                                          </Box>

                                          {/* Work Type */}
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                            }}
                                          >
                                            <WorkIcon
                                              fontSize="small"
                                              sx={{ color: "white" }}
                                            />
                                            <Typography
                                              variant="body1"
                                              sx={{ fontWeight: 400 }}
                                            >
                                              <strong
                                                style={{ fontWeight: 600 }}
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
                                                  i18n.language
                                                )}{" "}
                                                - {""}
                                                {translateFromJson(
                                                  stream?.subCategory,
                                                  i18n.language
                                                )}
                                              </span>
                                            </Typography>
                                          </Box>

                                          {/* About Work */}
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
                                                sx={{ color: "white" }}
                                              />
                                              <AboutWork
                                                stream={stream}
                                                t={t}
                                              />
                                            </Box>
                                          )}
                                        </Box>

                                        {/* Attendance Info */}
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mt: 1,
                                          }}
                                        >
                                          {stream.req_type !==
                                            "Contract_Based" && (
                                            <>
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  border: "1px solid black",
                                                  p: 0.5,
                                                  borderRadius: 1,
                                                  background: "white",
                                                  fontWeight: "800",
                                                }}
                                              >
                                                {t("workersSentToday")}: {""}
                                                {reqStats?.attendancedetails_workers_today ??
                                                  0}
                                              </Typography>
                                            </>
                                          )}
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              border: "1px solid black",
                                              p: 0.5,
                                              borderRadius: 1,
                                              display: "inline-block",
                                              background: "white",
                                              fontWeight: "800",
                                            }}
                                          >
                                            {stream.req_type !==
                                            "Contract_Based"
                                              ? `${t("perHeadWages")}:`
                                              : `${t("BudgetContract")}:`}{" "}
                                            ₹{" "}
                                            <span
                                              style={{
                                                fontWeight: 500,
                                                fontSize: "14px",
                                              }}
                                            >
                                              {getPerHeadWages(
                                                stream,
                                                stream?.finalAgentRequiredWage,
                                                stream?.assignedAgentId
                                              )}
                                            </span>
                                          </Typography>
                                        </Box>

                                        {/* Wages / Budget Info */}
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mt: 1,
                                            mb: 1,
                                          }}
                                        >
                                          {stream.req_type !==
                                            "Contract_Based" && (
                                            <>
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  border: "1px solid black",
                                                  p: 0.5,
                                                  borderRadius: 1,
                                                  background: "white",
                                                  fontWeight: "800",
                                                }}
                                              >
                                                {t("totalWorkersSent")}: {""}
                                                {reqStats?.attendancedetails_total_workers ??
                                                  0}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  border: "1px solid black",
                                                  p: 0.5,
                                                  borderRadius: 1,
                                                  background: "white",
                                                  fontWeight: "800",
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
                                              stream?.[item.key] === true
                                          )
                                          .map((item) => (
                                            <Box
                                              key={item.key}
                                              sx={{
                                                display: "inline-block",
                                                bgcolor: "#2e7d32", // dark green (Material color)
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
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 2, // spacing between buttons
                                          flexWrap: "wrap",
                                          border: "1px solid black",
                                          // p: 0.5,
                                          borderRadius: 1, // optional: allows wrap on smaller screens
                                        }}
                                      >
                                        <Button
                                          startIcon={<SupportAgent />}
                                          sx={{
                                            flex: 1, // make both buttons take equal space
                                            backgroundColor: "#e0f7fa",
                                            color: "#00796b",
                                            "&:hover": {
                                              backgroundColor: "#b2ebf2",
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
                                            }}
                                          >
                                            {t("employerContact")}:{" "}
                                            <IconButton
                                              color="primary"
                                              component="a"
                                              href={`tel:${stream?.employerPhone ?? 0}`}
                                            >
                                              <CallIcon titleAccess="Call" />
                                            </IconButton>
                                          </Typography>
                                        </Button>

                                        <Button
                                          startIcon={<SupportAgent />}
                                          sx={{
                                            flex: 1,
                                            backgroundColor: "#e0f7fa",
                                            color: "#00796b",
                                            "&:hover": {
                                              backgroundColor: "#b2ebf2",
                                            },
                                          }}
                                        >
                                          {t("support")}
                                          <IconButton
                                            color="primary"
                                            component="a"
                                            href="tel:7389791873"
                                          >
                                            <CallIcon titleAccess="Call" />
                                          </IconButton>
                                        </Button>
                                      </Box>
                                    </CardContent>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 1,
                                        mb: 1,
                                      }}
                                    >
                                      {/* <Button
                                      variant="contained"
                                      color="success"
                                      size="small"
                                    >
                                      {t("active")}
                                    </Button> */}

                                      {stream.req_type !== "Contract_Based" && (
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
                                              workerCounts[stream._id] || ""
                                            }
                                            onChange={(e) =>
                                              setWorkerCounts({
                                                ...workerCounts,
                                                [stream._id]: e.target.value,
                                              })
                                            }
                                            inputProps={{ min: 1 }}
                                            sx={{
                                              mr: 1,
                                              ml: 1,
                                              "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                  borderColor: "white", // default border color
                                                },
                                                "&:hover fieldset": {
                                                  borderColor: "#fff", // hover color
                                                },
                                                "&.Mui-focused fieldset": {
                                                  borderColor: "#fff", // focused color
                                                },
                                              },
                                              "& .MuiInputLabel-root": {
                                                color: "#fff", // label color
                                              },
                                              "& .MuiInputBase-input": {
                                                color: "#fff", // text color
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
                                                workerCounts?.[stream._id],
                                                getPerHeadWages(
                                                  stream,
                                                  stream?.finalAgentRequiredWage,
                                                  stream?.assignedAgentId
                                                ),
                                                stream?.emp_name,
                                                stream?.employerPhone,
                                                stream?.assignedAgentPhone,
                                                stream?.assignedAgentName,
                                                stream?.employerId
                                              );

                                              // ✅ Clear the input after sending
                                              setWorkerCounts((prev) => ({
                                                ...prev,
                                                [stream._id]: "", // or undefined/null based on your default state
                                              }));
                                            }}
                                          >
                                            {t("send")}
                                          </Button>
                                        </>
                                      )}
                                    </Box>
                                    {stream?.isAgentAccepted == "No" &&
                                      stream?.status === "Assigned" &&
                                      stream?.assignedAgentId === user?._id && (
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
                                            bgcolor: "rgba(0,0,0,0.7)",
                                            zIndex: 10,
                                            color: "#fff",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            textAlign: "center",
                                            borderRadius: 2,
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
                                            }}
                                          >
                                            <Typography
                                              variant="h6"
                                              sx={{
                                                animation:
                                                  "celebrate 1s ease-in-out infinite",
                                                position: "relative",
                                                fontWeight: "bold",
                                                // fontSize: "1.5rem",
                                                "@keyframes celebrate": {
                                                  "0%, 100%": {
                                                    transform: "scale(1)",
                                                    color: "#FFD700", // gold!
                                                    textShadow:
                                                      "0 0 10pxrgb(106, 187, 127), 0 0 20pxrgb(132, 243, 130)",
                                                  },
                                                  "50%": {
                                                    transform: "scale(1.1)",
                                                    color: "green",
                                                    textShadow:
                                                      "0 0 15pxrgb(2, 63, 12), 0 0 30pxrgb(12, 84, 36)",
                                                  },
                                                },
                                              }}
                                            >
                                              🎉 {t("congratsStream")}
                                            </Typography>
                                            <Typography sx={{ mb: 1 }}>
                                              {t("agentmessagebeforeaccept")}
                                            </Typography>
                                            <Typography
                                              sx={{ fontWeight: "bold" }}
                                            >
                                              {stream?.site +
                                                " " +
                                                stream?.district}
                                            </Typography>
                                            {/* <Typography sx={{ fontWeight: 'bold' }}>
                                              {stream?.workerNeedDate}
                                            </Typography> */}

                                            <Box
                                              sx={{
                                                mt: 1,
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: 2,
                                              }}
                                            >
                                              <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() =>
                                                  handleAccept(
                                                    stream?.assignedAgentId,
                                                    stream?.ern_num
                                                  )
                                                }
                                              >
                                                Accept
                                              </Button>

                                              <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() =>
                                                  handleReject(
                                                    stream?.assignedAgentId,
                                                    stream?.ern_num
                                                  )
                                                }
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
                    </Grid></div>
) : null}


                  </CardContent>
                </Card>
              </Grid>
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
                    <InviteForWorkHeader
                      t={t}
                      onSearch={(value) => {
                        if (searchTimeout.current)
                          clearTimeout(searchTimeout.current);

                        searchTimeout.current = setTimeout(() => {
                          fetchRequirements(1, false, 20, value);
                        }, 500); // 500ms delay
                      }}
                    />
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
 <ContactButtons
        stream={stream}
        currentLang={currentLang}
        isVerified={user?.veryfiedBage} // true or false
      />
                                            <IconButton
                                              onClick={() =>
                                                handleLocationClick(
                                                  stream?.latitude,
                                                  stream?.longitude
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
                                                  stream?.assignedAgentId
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
                                              stream?.[item.key] === true
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
                                        stream?.min_wages
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
                                        stream?.min_wages
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
                        currentReq.length === 0 &&
                        (currentReq.every(
                          (stream) =>
                            stream.status?.toLowerCase() !== "assigned"
                        ) &&
                          currentReq.every(
                            (stream) =>
                              stream.status?.toLowerCase() !== "pending" ||
                              stream.req_type == "Contract_Based" ||
                              stream.req_type == "Office_Staff"
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
                                                  `Hello, here is the ERN number: ${stream.ern_num}`
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
                                                    stream?.longitude
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
                                                    stream?.assignedAgentId
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
                                                "accommodationAvailable"
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
                                                stream?.[item.key] === true
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
                                          stream?.min_wages
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
                                          stream?.min_wages
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
          fullScreen={isMobile} // ← this makes it full screen on small devices
          sx={{
            "& .MuiPaper-root": {
              borderRadius: isMobile ? 0 : 3,
              mt: "110px",
              p: isMobile ? "5px" : "auto",
              // boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            },
          }}
        >
          {/* Header */}
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // mt: 6,
              py: 1,
              backgroundColor: "#093d71",
              color: "white",
            }}
          >
            <Typography fontSize="1.1rem" fontWeight={600} color="white">
              {t("Statement of Work")}
            </Typography>
            <Tooltip title={t("close")}>
              <IconButton
                onClick={handleClose}
                sx={{ color: "white" }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>

          {/* Content */}
          <DialogContent
            sx={{
              p: 0,
            }}
          >
            <Box
              sx={{
                border: "1px solid #ddd",
                // borderRadius: 2,
                overflowX: "auto",
                // boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "#fafafa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "#333", py: 1 }}>
                        {t("S.No")}
                      </TableCell>

                      {/* Show ERN only for non-Employer */}
                      {/* Show ERN only for Admin or SuperAdmin */}
                      {!["Employer", "Agent", "SelfWorker"].includes(
                        user?.role
                      ) && (
                        <TableCell
                          sx={{ fontWeight: 600, color: "#333", py: 1 }}
                        >
                          {t("ERN")}
                        </TableCell>
                      )}

                      {/* Empty spacer */}
                      <TableCell
                        sx={{ fontWeight: 600, color: "#333", py: 1 }}
                      ></TableCell>

                      {/* Show Agent column to everyone except Agent */}
                      {/* Show Agent column only for Admin, SuperAdmin, and Employer */}
                      {!["Agent", "SelfWorker", "Employer"].includes(
                        user?.role
                      ) && (
                        <TableCell
                          sx={{ fontWeight: 600, color: "#333", py: 1 }}
                        >
                          {t("Agent")}
                        </TableCell>
                      )}
                      {/* Show Employer column only to Admin/SuperAdmin */}
                      {(user?.role === "Admin" ||
                        user?.role === "SuperAdmin") && (
                        <TableCell
                          sx={{ fontWeight: 600, color: "#333", py: 1 }}
                        >
                          {t("Employer")}
                        </TableCell>
                      )}
                      <TableCell sx={{ fontWeight: 600, color: "#333", py: 1 }}>
                        {t("Workers")}
                      </TableCell>

                      {/* Wages column for all relevant roles */}
                      {(user?.role !== "SelfWorker" ||
                        user?.role !== "Agent" ||
                        user?.role === "Admin") && (
                        <TableCell
                          sx={{ fontWeight: 600, color: "#333", py: 1 }}
                        >
                          {t("Wages")}
                        </TableCell>
                      )}
                      <TableCell sx={{ fontWeight: 600, color: "#333", py: 1 }}>
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
                                backgroundColor: "#f9f9f9",
                              },
                            }}
                          >
                            <TableCell sx={{ py: 1 }}>
                              {page * rowsPerPage + index + 1}
                            </TableCell>

                            {/* ERN for non-Employer */}
                            {/* ERN for Admin or SuperAdmin only */}
                            {!["Employer", "Agent", "SelfWorker"].includes(
                              user?.role
                            ) && (
                              <TableCell sx={{ py: 1 }}>
                                {row.ERN_number}
                              </TableCell>
                            )}

                            <TableCell sx={{ py: 1 }}>
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
                                    minWidth: 60,
                                    minHeight: 24,
                                    textTransform: "none",
                                    fontSize: "0.65rem",
                                    padding: "2px 6px",
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

                            {/* Agent column */}
                            {/* Agent value only for Admin, SuperAdmin, and Employer */}
                            {!["Agent", "SelfWorker", "Employer"].includes(
                              user?.role
                            ) && (
                              <TableCell sx={{ py: 1 }}>
                                {row.agent_name}
                              </TableCell>
                            )}

                            {/* Employer column only for Admin/SuperAdmin */}
                            {(user?.role === "Admin" ||
                              user?.role === "SuperAdmin") && (
                              <TableCell sx={{ py: 1 }}>
                                {row.employer_name}
                              </TableCell>
                            )}

                            <TableCell sx={{ py: 1 }}>
                              Count: {row.number_of_worker}
                            </TableCell>

                            {(user?.role === "Agent" ||
                              user?.role === "SelfWorker" ||
                              user?.role === "Employer" ||
                              user?.role === "Admin" ||
                              user?.role === "SuperAdmin") && (
                              <TableCell sx={{ py: 1 }}>
                                Rs.:{" "}
                                {row.finalAgentRequiredWage ||
                                  row.per_worker_rates}
                                /-
                              </TableCell>
                            )}

                            <TableCell sx={{ py: 1 }}>
                              {row.send_date_time
                                ? new Date(
                                    row.send_date_time
                                  ).toLocaleDateString()
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="subtitle1" color="textSecondary">
                            {t("No attendance data")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <DialogActions
              sx={{
                justifyContent: "center",
                pb: 2,
                backgroundColor: "#fafafa",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <Button
                size="small"
                onClick={handleClose}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "#1a76d2",
                  color: "#1a76d2",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                    borderColor: "#1a76d2",
                  },
                }}
              >
                {t("Close")}
              </Button>
            </DialogActions>
          </DialogContent>

          {/* Footer */}
        </Dialog>
        {/* Confirmation Dialog */}
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
              borderRadius: 3,
              p: { xs: 1.5, sm: 2 },
            },
          }}
        >
          <DialogTitle
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              fontWeight: 600,
              textAlign: "center",
              pb: 1,
            }}
          >
            Confirm Approval
          </DialogTitle>

          <DialogContent
            sx={{
              textAlign: "center",
              fontSize: { xs: "0.95rem", sm: "1rem" },
              px: { xs: 1, sm: 2 },
            }}
          >
            Are you sure you want to approve this action?
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              pb: { xs: 1, sm: 2 },
            }}
          >
            <Button
              size="small"
              onClick={handleCancel}
              color="primary"
              variant="outlined"
              sx={{ textTransform: "none", minWidth: 90 }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              onClick={handleConfirm}
              color="primary"
              variant="contained"
              sx={{ textTransform: "none", minWidth: 90 }}
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
              borderRadius: 2,
              boxShadow: 8,
              width: fullScreen ? "calc(100% - 16px)" : "calc(100vw - 64px)",
              margin: fullScreen ? "8px auto" : "32px auto", // smaller gap on mobile
              position: "relative",
              maxHeight: fullScreen ? "100%" : "unset", // ✅ remove bottom white space
              overflow: "hidden",
            },
          }}
          sx={{
            "& .MuiDialog-paper": {
              margin: 0,
              borderRadius: 2,
              height: fullScreen ? "auto" : "fit-content", // ✅ ensures it wraps tightly
            },
          }}
          open={requirementOpen}
          onClose={handleRequirementClose}
        >
          <DialogContent
            sx={{
              p: 0,
              m: 0,
              height: "100%", // ✅ ensures no gap below
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
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
              borderRadius: fullScreen ? 0 : "20px",
              boxShadow: 6,
              bgcolor: "#fafafa",
              width: fullScreen ? "100%" : 420,
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
          {/* ---- Header ---- */}
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: "18px",
              pt: 2,
              pb: 0,
              color: "#333",
            }}
          >
            {t("selectRequirementType")}
          </DialogTitle>

          {/* ---- Content ---- */}
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mt: 2,
              px: 3,
            }}
          >
            <RadioGroup
              value={requirementType}
              onChange={handleRequirementSelect}
              sx={{ width: "100%", gap: 0 }}
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
                        fontWeight: 500,
                        color: "#333",
                      }}
                    >
                      {option.label}
                    </span>
                  }
                  sx={{
                    mx: 0,
                    backgroundColor:
                      requirementType === option.value ? "#e3f2fd" : "#fff",
                    borderRadius: "12px",
                    border:
                      requirementType === option.value
                        ? "1.5px solid #1976d2"
                        : "1px solid #e0e0e0",
                    px: 2,
                    py: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
              ))}
            </RadioGroup>

            {/* ---- Dynamic Info Section ---- */}
            <Box
              sx={{
                mt: 2,
                p: 2.5,
                borderRadius: 3,
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
                      return "linear-gradient(135deg, #f5f5f5, #eeeeee)";
                  }
                })(),
                textAlign: "center",
                minHeight: fullScreen ? 220 : 180,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.4s ease",
                boxShadow: 2,
              }}
            >
              <Box sx={{ mb: 1, fontSize: 60 }}>
                {requirementType === "Daily_Wages" && "💪"}
                {requirementType === "Contract_Based" && "📄"}
                {requirementType === "Supply_Based" && "🚚"}
                {requirementType === "Office_Staff" && "💼"}
                {!requirementType && "🧠"}
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>
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
                sx={{ mt: 1, color: "#555", maxWidth: 280, lineHeight: 1.4 }}
              >
                {requirementType
                  ? {
                      Daily_Wages:
                        "Hire skilled/unskilled workers for daily site work.",
                      Contract_Based:
                        "Get teams for time-bound projects and contracts.",
                      Supply_Based:
                        "Partner for bulk manpower or supply agreements.",
                      Office_Staff:
                        "Hire professional staff for office operations.",
                    }[requirementType]
                  : "Choose an option above to see details."}
              </Typography>
            </Box>
          </DialogContent>

          {/* ---- Footer ---- */}
          <DialogActions
            sx={{
              justifyContent: "space-between",
              px: 3,
              pb: 2.5,
              pt: 1,
            }}
          >
            <Button
              onClick={handleRequirementClose}
              sx={{
                color: "#555",
                backgroundColor: "#f5f5f5",
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 500,
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReqType}
              disabled={!requirementType}
              variant="contained"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 600,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
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
        <SubscriptionModel
          employerId={user?._id}
          pay_request={user?.id}
          open={subscriptionOpen}
          handleClose={handleSubscriptionClose}
        />
        <PathLocationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedLocation={selectedLocation}
        />
        <Dialog
          open={openVerifyDialog}
          onClose={() => setOpenVerifyDialog(false)}
          maxWidth="lg"
          fullWidth
          sx={{
    '& .MuiDialog-paper': {
      width: 'auto',        // removes calc(100% - 64px)
      maxWidth: '1200px',   // or any value you want
      m: "16px"
    }
  }}
        >
          {" "}
          <DialogContent sx={{ textAlign: "center", p: 3 }}>
            {/* <Box
  sx={{
    position: "absolute",
    top: 12,
    right: 12,
    display: "flex",
    gap: 1
  }}
>
  <Button
    size="small"
    variant={popupLang === "hi" ? "contained" : "outlined"}
    onClick={() => setPopupLang("hi")}
  >
    हिंदी
  </Button>

  <Button
    size="small"
    variant={popupLang === "en" ? "contained" : "outlined"}
    onClick={() => setPopupLang("en")}
  >
    EN
  </Button>
</Box> */}

            {/* Badge Icon */}

            <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
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
                  src="/usericon.png"
                  sx={{
                    width: 80,
                    height: 80,
                    border: "3px solid #4caf50",
                  }}
                />

                {/* Floating Verified Tag */}
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
            </Box>

            <Typography variant="body2" color="text.secondary" mb={2}>
              {t("getVerifiedSubtitle")}
            </Typography>

            <Typography fontWeight={600}>{t("whyGetVerified")}</Typography>

            {/* Benefits */}
            <Box sx={{ textAlign: "left", mt: 2 }}>

             <ul className="no-bullets">
  <li>{t("verifiedBenefits.b1")}</li>
  <li>{t("verifiedBenefits.b2")}</li>
  <li>{t("verifiedBenefits.b3")}</li>
  <li>{t("verifiedBenefits.b4")}</li>
  <li>{t("verifiedBenefits.b5")}</li>
  <li>{t("verifiedBenefits.b6")}</li>
    <li>{t("verifiedBenefits.b7")}</li>
  <li>{t("verifiedBenefits.b8")}</li>

</ul>
            </Box>

{/* Price */}
<Box
  sx={{
    mt: 2,
    p: 1.5,
    borderRadius: 2,
    bgcolor: "#e8f5e9",
    fontWeight: 700,
    color: "success.main",
    display: "flex",
    alignItems: "center",
    gap: 1,
  }}
>
  {t("verifiedFeeBox")}

  {user?.role === "Agent" ? (
    <>
      {/* Old price */}
      <span
        style={{
          textDecoration: "line-through",
          color: "#9e9e9e",
          fontWeight: 500,
        }}
      >
        ₹499
      </span>

      {/* New price */}
      <span
        style={{
          color: "#2e7d32",
          fontWeight: 800,
          fontSize: "1.1rem",
        }}
      >
        ₹199
      </span>
    </>
  ) : (
<>      <span
        style={{
          textDecoration: "line-through",
          color: "#9e9e9e",
          fontWeight: 500,
        }}
      >
        ₹199
      </span>
    <span
      style={{
        color: "#2e7d32",
        fontWeight: 800,
        fontSize: "1.1rem",
      }}
    >
      ₹49
    </span>
    </>
  )}
</Box>


            <Typography
              variant="caption"
              display="block"
              mt={1}
              color="text.secondary"
            >
              {t("verifiedFeeNote")}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
              <Button fullWidth variant="outlined" onClick={handleClose}>
                {t("maybeLater")}
              </Button>

              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={handlePayment}
              >
                {t("getVerifiedNow")}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default Dashboard;

import React, { useContext, useEffect, useState } from "react";
import { Box, Card, Divider, Pagination } from "@mui/material";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../../utils/axiosConfig";
import config from "../../config";
import { useTranslation } from "react-i18next";

// Components
import PayoutTabs from "./PayoutTabs";
import PayoutTable from "./PayoutTable";
import AgentDetailDialog from "./AgentDetailDialog";
import LoaderBackdrop from "./LoaderBackdrop";

const SuperAdminPayout = () => {
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editableRows, setEditableRows] = useState({});
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // 🔢 Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Auth and Data Check
  useEffect(() => {
    if (isAuthorized === false) {
      navigate("/landing");
      return;
    }

    if (!user) return;

    if (user?.role === "SuperAdmin" || user?.role === "Admin") {
      fetchAgentsPayouts(tabValue, page);
    } else {
      navigate("/login"); // unauthorized roles
    }
  }, [isAuthorized, user?.role, tabValue, page]);

  const getStatusForTab = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return "pending";
      case 1:
        return "COMPLETED";
      case 2:
        return "REJECTED";
      case 3:
        return "COMPLETED";
      default:
        return "pending";
    }
  };

  const fetchAgentsPayouts = async (tabIndex, currentPage) => {
    setLoading(true);
    try {
      const status = getStatusForTab(tabIndex);
      const params = {
        paymentType: tabIndex === 3 ? "credit" : "debit",
        page: currentPage,
        limit: limit,
      };

      if (tabIndex === 3) {
        params.creditStatus = status;
      } else {
        params.paymentStatus = status;
      }

      const res = await axios.get(
        `${config.API_BASE_URL}/api/v1/payment/agents-payout-list`,
        {
          params,
          withCredentials: true,
        }
      );

      if (res.data.message?.includes("No matching agent payouts found")) {
        setAgents([]);
        setTotalPages(1);
      } else if (res.data.transactions) {
        setAgents(res.data.transactions);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setAgents([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("❌ Failed to fetch agents payout list:", error);
      setAgents([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handleInputChange = (id, field, value) => {
    setEditableRows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleApprove = async (agentId) => {
    const updates = editableRows[agentId] || {};

    if (!updates.creditTransactionId?.trim()) {
      toast.error("⚠️ Transaction ID is required before approving.");
      return;
    }

    if (!window.confirm("✅ Approve this payout?")) return;

    setActionLoading(true);
    updates.paymentStatus = "COMPLETED";
    updates.paymentType = "debit";

    try {
      await axios.put(
        `${config.API_BASE_URL}/api/v1/payment/approve-payout/${agentId}`,
        updates,
        { withCredentials: true }
      );
      toast.success("✅ Payout Approved");
      fetchAgentsPayouts(tabValue, page);
    } catch (error) {
      console.error("❌ Approval failed:", error);
      toast.error("❌ Action Failed");
    }
    setActionLoading(false);
  };

  const handleReject = async (agentId) => {
    if (!window.confirm("⚠️ Reject this payout?")) return;

    setActionLoading(true);
    const updates = editableRows[agentId] || {};
    updates.paymentStatus = "REJECTED";
    updates.paymentType = "debit";

    try {
      await axios.put(
        `${config.API_BASE_URL}/api/v1/payment/approve-payout/${agentId}`,
        updates,
        { withCredentials: true }
      );
      toast.success("❌ Payout Rejected");
      fetchAgentsPayouts(tabValue, page);
    } catch (error) {
      console.error("❌ Rejection failed:", error);
      toast.error("❌ Action Failed");
    }
    setActionLoading(false);
  };

  const openDetail = async (agent) => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/api/v1/user/agent/${agent?.agentId}`,
        { withCredentials: true }
      );
      setSelectedAgent(res.data);
      setOpenDetailDialog(true);
    } catch (error) {
      console.error("❌ Failed to fetch agent details:", error);
      toast.error(t("FailedToLoadData"));
    }
  };

  return (
    <Box sx={{ mx: "auto", p: 2 }}>
      {/* 🔹 Tabs */}
      <PayoutTabs
        tabValue={tabValue}
        setTabValue={(newValue) => {
          setTabValue(newValue);
          setPage(1);
        }}
      />

      <Card>
        <Divider />
        <PayoutTable
          loading={loading}
          agents={agents}
          editableRows={editableRows}
          handleInputChange={handleInputChange}
          openDetail={openDetail}
          handleApprove={handleApprove}
          handleReject={handleReject}
          tabValue={tabValue}
          t={t}
        />
      </Card>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={1} mb={8}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <LoaderBackdrop open={actionLoading} />

      <AgentDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        selectedAgent={selectedAgent}
        t={t}
      />
    </Box>
  );
};

export default SuperAdminPayout;

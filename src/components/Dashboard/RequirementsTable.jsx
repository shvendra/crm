import React, { useContext, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Box,
  Divider,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Tabs,
  Typography,
  Tab,
  Stack,
} from "@mui/material";
import { Edit2 } from "lucide-react";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import Chat from "../Chat/chat";
import ConfirmationDialog from "../ConfirmationDialog";
import UserCommentDialog from "../UserCommentDialog";
import { Context } from "../../main";
import toast from "react-hot-toast";
import axios from "../../utils/axiosConfig";
import config from "../../config";
import { useConfirm } from "../../hook/confirmHook";

const RequirementsTable = ({
  rows = [],
  tab,
  page,
  totalPages,
  search,
  onSearch,
  onPageChange,
  onTabChange,
  toggleChat,
  openChatIds = new Set(),
  unreadCounts = {},
  onEdit,
  onAssign,
  t,
}) => {
  const { user } = useContext(Context);
  const {
    isOpen,
    message,
    requestConfirm,
    handleDialogConfirm,
    handleDialogCancel,
  } = useConfirm();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [editData, setEditData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const booleanFields = [
    "accommodationAvailable",
    "foodAvailable",
    "incentive",
    "bonus",
    "transportProvided",
    "weeklyOff",
    "overtimeAvailable",
    "insuranceAvailable",
    "pfAvailable",
    "esicAvailable",
  ];

  // Open edit dialog
  const handleOpenEditDialog = (req) => {
    setSelectedReq(req);
    const newEditData = {
      remarks: req?.remarks || "",
      minBudgetPerWorker: req?.minBudgetPerWorker || "",
      maxBudgetPerWorker: req?.maxBudgetPerWorker || "",
      ...booleanFields.reduce((acc, key) => {
        acc[key] = req[key] ?? false;
        return acc;
      }, {}),
    };
    if (req?.req_type === "Office_Staff") {
      newEditData.status = req?.status || "";
      newEditData.finalAgentRequiredWage = req?.finalAgentRequiredWage || "";
    }
    setEditData(newEditData);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const confirmed = await requestConfirm(
        "Are you sure you want to save changes?",
      );
      if (!confirmed) return;

      await axios.put(
        `${config.API_BASE_URL}/api/v1/application/update-stream-moreinfo`,
        {
          id: selectedReq._id,
          ...editData,
        },
        { withCredentials: true },
      );
      toast.success("Details updated successfully");
      setEditDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update requirement");
    }
  };

  const handleChangeSwitch = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeRemarks = (e) => {
    setEditData((prev) => ({ ...prev, remarks: e.target.value }));
  };

  const handleCloseDialogComment = () => setDialogOpen(false);
  const handleOpenDialogComment = (req) => {
    setSelectedUser(req);
    setDialogOpen(true);
  };
  const handleSaveComment = async (newComment, uid = null) => {
    try {
      const userIdToSave = uid ?? selectedUser?.targetId;
      if (!userIdToSave) return;

      await fetch(`${config.API_BASE_URL}/api/user-comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userIdToSave,
          text: newComment.text,
          createdAt: newComment.createdAt,
          createdBy: newComment.createdBy,
        }),
      });

      toast.success("Comment saved successfully");

      // Close the dialog
      handleCloseDialogComment();
    } catch (error) {
      console.error("Error saving comment:", error);
      toast.error("Failed to save comment");
    }
  };

  const handleCloseRequirement = async (id) => {
    try {
      const confirmed = await requestConfirm(
        "Are you sure you want to close this requirement?",
      );
      if (!confirmed) return;

      await axios.put(
        `${config.API_BASE_URL}/api/v1/application/update-status?id=${id}&status=Closed`,
        {},
        { withCredentials: true },
      );
      toast.success("Requirement closed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to close requirement");
    }
  };

  const handleReqTypeChange = async (id, newValue) => {
    try {
      const confirmed = await requestConfirm(
        "Are you sure you want to update requirement type?",
      );
      if (!confirmed) return;

      await axios.put(
        `${config.API_BASE_URL}/api/v1/application/update-reqtype`,
        { id, req_type: newValue },
        { withCredentials: true },
      );
      toast.success("Requirement type updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update requirement type");
    }
  };

  const tabsList = ["all", "active", "chat"];

  return (
    <Box sx={{ mb: 5 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          {/* Tabs + Search Row */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            flexWrap="wrap"
            gap={2}
          >
            {/* Tabs on left */}
            <Tabs
              value={tab || "all"} // fallback
              onChange={onTabChange} // ✅ directly pass it
              indicatorColor="primary"
              textColor="primary"
            >
              {["all", "active", "chat"].map((t) => (
                <Tab
                  key={t}
                  label={t.charAt(0).toUpperCase() + t.slice(1)}
                  value={t} // ✅ This is the value received in newTab
                />
              ))}
            </Tabs>

            {/* Search box on right */}
            <TextField
              placeholder="Search by ERN / Name / Phone"
              size="small"
              value={search}
              onChange={onSearch}
              sx={{ minWidth: 200 }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>SN</TableCell>
                  <TableCell>ERN</TableCell>
                  <TableCell>REQ Type</TableCell>
                  <TableCell>Employer</TableCell>
                  <TableCell>Phone</TableCell>
                  {tab === "active" && (
                    <>
                      <TableCell>Agent</TableCell>
                      <TableCell>Agent Phone</TableCell>
                    </>
                  )}
                  <TableCell>District</TableCell>
                  <TableCell>Site</TableCell>
                  <TableCell>WorkType</TableCell>
                  <TableCell>Workers</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Chat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tab === "active" ? 16 : 14}
                      align="center"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((req, i) => (
                    <TableRow key={req._id}>
                      <TableCell>
                        <CloseIcon
                          sx={{
                            fontSize: 18,
                            color: "error.main",
                            cursor: "pointer",
                            transition: "0.2s",
                            "&:hover": {
                              transform: "scale(1.15)",
                              opacity: 0.8,
                            },
                          }}
                          onClick={() => handleCloseRequirement(req._id)}
                        />
                      </TableCell>

                      <TableCell>{i + 1 + (page - 1) * 30}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            cursor: "pointer",
                            color: "#1976d2",
                          }}
                          onClick={() =>
                            onAssign?.(
                              req.ern_num,
                              req.city,
                              req.intrestedAgents,
                              req.status,
                            )
                          }
                        >
                          {req.ERN_NUMBER}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={req.req_type || ""}
                          size="small"
                          onChange={(e) =>
                            handleReqTypeChange(req._id, e.target.value)
                          }
                        >
                          <MenuItem value="">Select Type</MenuItem>
                          <MenuItem value="Contract_Based">
                            Contract Based
                          </MenuItem>
                          <MenuItem value="Daily_Wages">Daily Wages</MenuItem>
                          <MenuItem value="Supply_Based">Supply Based</MenuItem>
                          <MenuItem value="Office_Staff">Office Staff</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell
                        sx={{ cursor: "pointer", color: "#1976d2" }}
                        onClick={() =>
                          handleOpenDialogComment({
                            ...req,
                            targetId: req.employerId || req._id,
                            commentType: "employer",
                          })
                        }
                      >
                        {req.employerName || "--"}
                      </TableCell>
                      <TableCell>{req.employerPhone || "--"}</TableCell>

                      {/* 👇 Show Agent only on active tab */}
                      {tab === "active" && (
                        <>
                          <TableCell
                            sx={{ cursor: "pointer", color: "#1976d2" }}
                            onClick={() =>
                              handleOpenDialogComment({
                                ...req,
                                targetId: req.assignedAgentId || req._id,
                                commentType: "agent",
                              })
                            }
                          >
                            {req.assignedAgentName || "--"}
                          </TableCell>
                          <TableCell>
                            {req.assignedAgentPhone || "--"}
                          </TableCell>
                        </>
                      )}

                      <TableCell>{req.district}</TableCell>
                      <TableCell>{req.workLocation}</TableCell>
                      <TableCell>{req.workType}</TableCell>
                      <TableCell>{req.workerQuantitySkilled}</TableCell>
                      <TableCell>
                        ₹{req.minBudgetPerWorker} - ₹{req.maxBudgetPerWorker}
                      </TableCell>
                      <TableCell>
                        {req.workerNeedDate
                          ? new Date(req.workerNeedDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )
                          : "--"}
                      </TableCell>
                      <TableCell>
                        <Edit2
                          size={16}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleOpenEditDialog(req)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={
                            <Badge
                              badgeContent={unreadCounts[req._id] || 0}
                              color="error"
                            >
                              <ChatIcon />
                            </Badge>
                          }
                          onClick={() => toggleChat(req._id)}
                        />
                        {openChatIds.has(req._id) && (
                          <Chat
                            postId={req._id}
                            senderId={user._id}
                            senderRole={user.role}
                            employerName={req.employerName}
                            onClose={() => toggleChat(req._id)}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Stack alignItems="center" mt={2}>
            <span style={{ margin: "0 10px" }}>
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => onPageChange(null, page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => onPageChange(null, page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Requirement</DialogTitle>
        <DialogContent dividers>
          {booleanFields.map((field) => (
            <FormControlLabel
              key={field}
              control={
                <Switch
                  checked={!!editData[field]}
                  onChange={(e) => handleChangeSwitch(field, e.target.checked)}
                />
              }
              label={field}
            />
          ))}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Remarks"
            value={editData.remarks}
            onChange={handleChangeRemarks}
            sx={{ mt: 2 }}
          />
          {/* ✅ Show Approve Button and Final Rate input only for Office_Staff */}
          <TextField
            fullWidth
            type="number"
            label="Min Budget Per Worker"
            value={editData.minBudgetPerWorker || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                minBudgetPerWorker: e.target.value,
              }))
            }
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            type="number"
            label="Max Budget Per Worker"
            value={editData.maxBudgetPerWorker || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                maxBudgetPerWorker: e.target.value,
              }))
            }
            sx={{ mt: 2 }}
          />
          {selectedReq?.req_type === "Office_Staff" && (
            <>
              {/* Final Rate Input */}
              <TextField
                fullWidth
                label="Final Rate"
                type="number"
                value={editData.finalAgentRequiredWage || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    finalAgentRequiredWage: e.target.value,
                  }))
                }
                sx={{ mt: 2 }}
              />

              {/* Approve Button */}
              <Button
                variant={
                  editData.status === "Approved" ? "contained" : "outlined"
                }
                color={editData.status === "Approved" ? "success" : "primary"}
                sx={{ mt: 2 }}
                onClick={() =>
                  setEditData((prev) => ({
                    ...prev,
                    status: prev.status === "Approved" ? "" : "Approved",
                  }))
                }
              >
                {editData.status === "Approved" ? "Approved" : "Approve"}
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={isOpen}
        message={message}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />

      <UserCommentDialog
        open={dialogOpen}
        onClose={handleCloseDialogComment}
        selectedUser={selectedUser}
        loggedInUser={user}
        onSaveComment={handleSaveComment} // ✅ add this
      />
    </Box>
  );
};

export default RequirementsTable;

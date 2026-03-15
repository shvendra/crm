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
  <Card
    sx={{
      borderRadius: "28px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
    }}
  >
    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
      {/* Tabs + Search Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
        sx={{
          p: 1.2,
          borderRadius: "18px",
          border: "1px solid #e2e8f0",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
        }}
      >
        {/* Tabs on left */}
        <Tabs
          value={tab || "all"}
          onChange={onTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "999px",
              background:
                "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              minHeight: 42,
              color: "#64748b",
            },
            "& .Mui-selected": {
              color: "#1d4ed8 !important",
            },
          }}
        >
          {["all", "active", "chat"].map((t) => (
            <Tab
              key={t}
              label={t.charAt(0).toUpperCase() + t.slice(1)}
              value={t}
            />
          ))}
        </Tabs>

        {/* Search box on right */}
        <TextField
          placeholder="Search by ERN / Name / Phone"
          size="small"
          value={search}
          onChange={onSearch}
          sx={{
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
            },
          }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "22px",
          overflowX: "auto",
          border: "1px solid #e2e8f0",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: tab === "active" ? 1450 : 1250,
            "& th": {
              background:
                "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
              fontWeight: 700,
              color: "#334155",
              borderBottom: "1px solid #e2e8f0",
              whiteSpace: "nowrap",
            },
            "& td": {
              borderBottom: "1px solid #eef2f7",
              whiteSpace: "nowrap",
            },
            "& tr:nth-of-type(even)": {
              backgroundColor: "#fafcff",
            },
            "& tr:hover": {
              backgroundColor: "#f0f7ff",
            },
          }}
        >
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
                  sx={{ py: 4, color: "#64748b", fontWeight: 600 }}
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

                  <TableCell sx={{ fontWeight: 600 }}>
                    {i + 1 + (page - 1) * 30}
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        cursor: "pointer",
                        color: "#2563eb",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() =>
                        onAssign?.(
                          req.ern_num,
                          req.city,
                          req.intrestedAgents,
                          req.status
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
                      sx={{
                        minWidth: 150,
                        borderRadius: "12px",
                        background: "#fff",
                      }}
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
                    sx={{
                      cursor: "pointer",
                      color: "#2563eb",
                      fontWeight: 600,
                    }}
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

                  {tab === "active" && (
                    <>
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          color: "#2563eb",
                          fontWeight: 600,
                        }}
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
                      <TableCell>{req.assignedAgentPhone || "--"}</TableCell>
                    </>
                  )}

                  <TableCell>{req.district}</TableCell>
                  <TableCell>{req.workLocation}</TableCell>
                  <TableCell>{req.workType}</TableCell>
                  <TableCell>{req.workerQuantitySkilled}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#166534" }}>
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
                          }
                        )
                      : "--"}
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(37,99,235,0.08)",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgba(37,99,235,0.14)",
                        },
                      }}
                      onClick={() => handleOpenEditDialog(req)}
                    >
                      <Edit2 size={16} />
                    </Box>
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
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 700,
                        minWidth: 44,
                        boxShadow: "0 10px 20px rgba(37,99,235,0.18)",
                      }}
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
      <Stack
        alignItems="center"
        mt={2}
        direction="row"
        justifyContent="center"
        spacing={1}
        sx={{
          p: 1.2,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          background: "#fff",
        }}
      >
        <span style={{ margin: "0 10px", fontWeight: 600, color: "#475569" }}>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(null, page - 1)}
          disabled={page <= 1}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(null, page + 1)}
          disabled={page >= totalPages}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
          }}
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
    PaperProps={{
      sx: {
        borderRadius: "24px",
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
        fontWeight: 800,
        fontSize: "1.15rem",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
        color: "#fff !important",
      }}
    >
      Edit Requirement
    </DialogTitle>

    <DialogContent
      dividers
      sx={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
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
        sx={{
          mt: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            background: "#fff",
          },
        }}
      />

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
        sx={{
          mt: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            background: "#fff",
          },
        }}
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
        sx={{
          mt: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            background: "#fff",
          },
        }}
      />

      {selectedReq?.req_type === "Office_Staff" && (
        <>
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
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                background: "#fff",
              },
            }}
          />

          <Button
            variant={editData.status === "Approved" ? "contained" : "outlined"}
            color={editData.status === "Approved" ? "success" : "primary"}
            sx={{
              mt: 2,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
            }}
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

    <DialogActions
      sx={{
        px: 2,
        py: 1.5,
        borderTop: "1px solid #e2e8f0",
        background: "#fff",
      }}
    >
      <Button
        onClick={() => setEditDialogOpen(false)}
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleSaveEdit}
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 800,
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          boxShadow: "0 12px 24px rgba(37,99,235,0.22)",
        }}
      >
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
    onSaveComment={handleSaveComment}
  />
</Box>
  );
};

export default RequirementsTable;

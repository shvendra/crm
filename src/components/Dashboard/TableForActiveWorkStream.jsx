import React, { useContext, useState } from "react";
import {
  TextField,
  Card,
  CardContent,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Badge,
  Tooltip,
  ButtonBase,
  Paper,
  TablePagination,
} from "@mui/material";
import {
  InfoOutlined as InfoOutlinedIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import { Context } from "../../main";
import Chat from "../Chat/chat";
import UserCommentDialog from "../UserCommentDialog";
import config from "../../config";

const TableForActiveWorkStream = ({
  filteredData = [],
  searchQuery,
  handleSearchChange,
  unreadCounts,
  toggleChat,
  handleCardClick,
  onAssign,
  t,
  openChatIds,
  handleUnreadCountChange,

  // 👇 pagination props from parent
  page,
  rowsPerPage,
  totalPages,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const { user } = useContext(Context);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const handleOpenDialogComment = (stream, type) => {
    let targetId =
      type === "agent"
        ? stream.assignedAgentId
        : type === "employer"
        ? stream.employerId
        : stream._id;

    setSelectedEntity({ ...stream, targetId, commentType: type });
    setDialogOpen(true);
  };

  const handleCloseDialogComment = () => {
    setDialogOpen(false);
    setSelectedEntity(null);
  };

  const handleSaveComment = async (newComment, uid = null) => {
    try {
      const userIdToSave = uid ?? selectedEntity?.targetId;
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
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  return (
    <Box sx={{ mb: 5 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
            mb={2}
          >
            <Typography variant="h6" className="dash-head">
              All Active Work Streams
            </Typography>

            <TextField
              variant="outlined"
              placeholder="Search by ERN, Name or Phone..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: { xs: "100%", sm: "300px" } }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {filteredData.length === 0 ? (
            <Box
              sx={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {t("detailsNotAvailable")}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>SN</TableCell>
                      {user.role === "SuperAdmin" && (
                        <TableCell><b>{t("UnAssign")}</b></TableCell>
                      )}
                      <TableCell><b>{t("ERN")}</b></TableCell>
                      <TableCell><b>{t("city")}</b></TableCell>
                      <TableCell><b>{t("site")}</b></TableCell>
                      <TableCell><b>Agent</b></TableCell>
                      <TableCell><b>Employer</b></TableCell>
                      <TableCell><b>Work</b></TableCell>
                      <TableCell><b>Rate</b></TableCell>
                      <TableCell><b>Date</b></TableCell>
                      <TableCell><b>Chat</b></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredData.map((stream, index) => (
                      <TableRow key={stream._id}>
                        <TableCell>
                          {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>

                        {user.role === "SuperAdmin" && (
                          <TableCell>
                            <Button
                              size="small"
                              variant="contained"
                              color="warning"
                              onClick={() => onAssign("", stream.ern_num)}
                            >
                              {t("UnAssign")}
                            </Button>
                          </TableCell>
                        )}

                        <TableCell>
                          <ButtonBase
                            onClick={() => handleCardClick(stream._id)}
                            sx={{ color: "#1976d2", fontWeight: 600 }}
                          >
                            <InfoOutlinedIcon fontSize="small" />
                            {stream.ern_num}
                          </ButtonBase>
                        </TableCell>

                        <TableCell>{stream.city}</TableCell>
                        <TableCell>{stream.site}</TableCell>

                        <TableCell
                          sx={{ cursor: "pointer", color: "#1976d2" }}
                          onClick={() => handleOpenDialogComment(stream, "agent")}
                        >
                          {stream.assignedAgentName || "--"}
                          {stream.assignedAgentPhone &&
                            ` - ${stream.assignedAgentPhone}`}
                        </TableCell>

                        <TableCell
                          sx={{ cursor: "pointer", color: "#1976d2" }}
                          onClick={() =>
                            handleOpenDialogComment(stream, "employer")
                          }
                        >
                          {stream.emp_name || "--"}
                          {stream.employerPhone &&
                            ` - ${stream.employerPhone}`}
                        </TableCell>

                        <TableCell>
                          {stream.workType} {stream.subCategory}{" "}
                          {stream.remarks}
                        </TableCell>

                        <TableCell>
                          {stream.finalAgentRequiredWage ?? "--"}
                        </TableCell>

                        <TableCell>
                          {stream.workerNeedDate || "--"}
                        </TableCell>

                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
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
                              employerName={stream.emp_name}
                              onClose={() => toggleChat(stream._id)}
                              onUnreadCountChange={
                                handleUnreadCountChange
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ✅ Pagination */}
              {/* <TablePagination
                component="div"
                page={page - 1}
                rowsPerPage={rowsPerPage}
                count={totalPages * rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 20, 50]}
              /> */}
            </>
          )}
        </CardContent>
      </Card>

      {selectedEntity && (
        <UserCommentDialog
          open={dialogOpen}
          onClose={handleCloseDialogComment}
          selectedUser={selectedEntity}
          loggedInUser={user}
          onSaveComment={(c) =>
            handleSaveComment(c, selectedEntity.targetId)
          }
        />
      )}
    </Box>
  );
};

export default TableForActiveWorkStream;

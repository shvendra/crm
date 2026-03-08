import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import config from "../config";

const UserCommentDialog = ({ open, onClose, selectedUser, loggedInUser, onSaveComment }) => {
  const [comment, setComment] = useState("");
  const [commentsHistory, setCommentsHistory] = useState([]);
  const commentsEndRef = useRef(null);

  // Pick the correct ID to fetch comments
const targetId =
  selectedUser?.commentType === "agent"
    ? selectedUser?.assignedAgentId ||
      selectedUser?.employerId ||
      selectedUser?._id
    : selectedUser?.employerId || selectedUser?.assignedAgentId || selectedUser?._id;


  // Fetch comments whenever dialog opens or targetId changes
  useEffect(() => {
    if (!open || !targetId) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/user-comments/${targetId}`);
        const data = await res.json();
        setCommentsHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setCommentsHistory([]);
      }
    };

    fetchComments();
    setComment("");
  }, [open, targetId]);

  // Scroll to bottom whenever comments change
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [commentsHistory]);

  const handleSave = async () => {
    if (!comment.trim()) return;

    const newComment = {
      text: comment.trim(),
      createdAt: new Date().toISOString(),
      createdBy: loggedInUser?.name || "Unknown User",
    };

    // ✅ 1. Append locally for instant feedback
    setCommentsHistory((prev) => [...prev, newComment]);

    // ✅ 2. Send to backend for persistence
    try {
      await onSaveComment(newComment, targetId); // Pass targetId so backend saves against correct entity
    } catch (err) {
      console.error("Failed to save comment:", err);
      // Optional rollback
      setCommentsHistory((prev) => prev.filter((c) => c !== newComment));
    }

    setComment("");
  };

  if (!targetId) return null; // no user/agent/employer -> nothing to show

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* HEADER - only show user info if neither employerId nor agentId exists */}
      {!selectedUser?.employerId && !selectedUser?.agentId && (
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {selectedUser?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📞 {selectedUser?.phone} | Status:{" "}
            <span
              style={{
                color: selectedUser?.status === "Verified" ? "green" : "orange",
                fontWeight: "bold",
              }}
            >
              {selectedUser?.status}
            </span>
          </Typography>
        </DialogTitle>
      )}

      {/* CONTENT */}
      <DialogContent>
        <Box
          maxHeight="200px"
          overflow="auto"
          mb={2}
          p={1}
          sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
        >
          {commentsHistory.length > 0 ? (
            commentsHistory.map((c, index) => (
              <Box key={index} mb={1}>
                <Typography variant="body2">{c.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(c.createdAt).toLocaleString()} —{" "}
                  <strong>By: {c.createdBy}</strong>
                </Typography>
                {index < commentsHistory.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          )}
          <div ref={commentsEndRef} />
        </Box>

        {/* New Comment Input */}
        <TextField
          fullWidth
          multiline
          minRows={1}
          label="Add Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
        />
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!comment.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserCommentDialog;

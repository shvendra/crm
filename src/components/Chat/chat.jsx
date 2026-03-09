import React, { useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import config from "../../config";
import { createPortal } from "react-dom";

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { Context } from "../../main";

// Initialize socket connection
const socket = io(config.API_BASE_URL, {
  path: "/app/socket.io", // <--- THIS IS THE KEY FIX
  withCredentials: true,
  transports: ["websocket", "polling"], // ✅ MATCH BACKEND
});
const Chat = ({ postId, senderId, senderRole, employerName, onClose }) => {
  const { user } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch previous messages and handle socket events
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${config.API_BASE_URL}/api/v1/chat/${postId}`);
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error("Error fetching chat:", err);
      } finally {
        setLoading(false);
      }
    };

    setMessages([]);
    fetchMessages();

    // Join chat room
    socket.emit("join_room", postId);

    if (user?._id && postId) {
      socket.emit("mark_messages_read", { roomId: postId, userId: user._id });
    }

    // Listen for new messages
    const handleReceive = (newMsg) => {
      if (newMsg?.roomId === postId || !newMsg.roomId) {
        setMessages((prev) => [...prev, newMsg]);
        if (newMsg.sender !== user._id) {
          socket.emit("mark_messages_read", { roomId: postId, userId: user._id });
        }
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [postId, user?._id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send_message", {
      room: postId,
      message,
      sender: senderId,
      role: senderRole,
    });
    setMessage("");
  };
useEffect(() => {
  // Stop background scrolling when chat opens
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);
return createPortal(
<Card
  sx={{
    position: "fixed",
    bottom: 66,
    right: { xs: "50%", sm: 20 },
    transform: { xs: "translateX(50%)", sm: "none" },
    zIndex: 999999, // 🟢 Very high priority
    borderRadius: 3,
    width: { xs: "90%", sm: "400px" },
    maxHeight: "600px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
  }}
>

      {/* Chat Header */}
      <CardHeader
        title={`Chat with ${employerName}`}
        titleTypographyProps={{ variant: "subtitle1", sx: { fontSize: "1rem", fontWeight: 600 } }}
        action={
          <IconButton onClick={onClose} size="small">
            <CloseIcon sx={{ color: "#fff" }} />
          </IconButton>
        }
        sx={{ bgcolor: "#1976d2", color: "#fff", py: 1, px: 2 }}
      />

      {/* Chat Messages */}
      <CardContent
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 1,
          bgcolor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center", color: "text.secondary" }}>
            <Box component="span" sx={{ fontSize: 40, mb: 1 }}>💬</Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>No messages yet</Typography>
            <Typography variant="body2" sx={{ textAlign: "center", maxWidth: 220 }}>
              Start the conversation by sending a message.
            </Typography>
          </Box>
        ) : (
          messages.map((msg, i) => {
            const isSender = msg.sender === user?._id;
            return (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: isSender ? "flex-end" : "flex-start",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    bgcolor: isSender ? "#1976d2" : "#ffffff",
                    color: isSender ? "#fff" : "#000",
                    p: 1.2,
                    borderRadius: 2,
                    maxWidth: "75%",
                    wordBreak: "break-word",
                    boxShadow: isSender
                      ? "0px 2px 6px rgba(25,118,210,0.3)"
                      : "0px 2px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: isSender ? "right" : "left",
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                    {msg.message}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: "0.7rem", mt: 0.5, alignSelf: "flex-end", opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <Divider />

      {/* Chat Input */}
      <CardActions sx={{ p: 1, bgcolor: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          multiline
          minRows={1}
          maxRows={4}
          sx={{
            "& .MuiInputBase-root": { borderRadius: 3, backgroundColor: "#f5f5f5", padding: "4px" },
            "& .MuiInputBase-input": { lineHeight: 1.4, padding: "4px 6px" },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{ minWidth: 44, height: 44, borderRadius: "50%", p: 0, boxShadow: "0px 3px 8px rgba(25,118,210,0.3)" }}
        >
          <SendIcon />
        </Button>
      </CardActions>
    </Card>,
      document.body // ✅ add this
  );
};

export default Chat;

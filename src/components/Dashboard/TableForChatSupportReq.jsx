import React, { useContext, useState, useEffect, useRef } from "react";
import {  TextField,
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
  Grid,
  Stack } from '@mui/material';
import { InfoOutlined as InfoOutlinedIcon, Chat as ChatIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Chat from "../Chat/chat";
import { Context } from "../../main";

const TableForActiveWorkStream = ({ currentReq, filteredData, searchQuery, handleSearchChange, unreadCounts, toggleChat, handleCardClick, t, openChatIds, handleUnreadCountChange}) => {
const { isAuthorized, user } = useContext(Context);
  return (
    <Box sx={{ mb: 5 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Typography className="dash-head" variant="h6">
              Support
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
          {currentReq.length === 0 ? (
            <Box
              sx={{
                height: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: 2,
                mt: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {t("detailsNotAvailable")}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 2 }}>
              <Grid container  spacing={2}>
    {([...filteredData].sort((a, b) => (unreadCounts[b._id] || 0) - (unreadCounts[a._id] || 0))).map((stream, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        p: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor:
                          stream.status === "Assigned" ? "lightgreen" : "white", // default card background
                      }}
                    >
                      <Stack spacing={1}>
                        {/* ERN and Rate in Same Line */}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            color="primary.main"
                          >
                            ERN: {stream.ern_num}
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            ₹{stream.finalAgentRequiredWage ?? "--"}
                          </Typography>
                        </Box>

                        {/* Status and Work Type in Same Line */}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color:
                                stream.status === "Active" ? "green" : "orange",
                            }}
                          >
                            Status: {stream.status ?? "Pending"}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {stream.req_type || stream.req_type || "--"}
                          </Typography>
                        </Box>

                        {/* Assigned Agent */}
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Agent: {stream.assignedAgentName || "--"}{" "}
                          {stream.assignedAgentPhone
                            ? `(${stream.assignedAgentPhone})`
                            : ""}
                        </Typography>

                        {/* Assigned Employer */}
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Employer: {stream.emp_name || "--"}{" "}
                          {stream.employerPhone
                            ? `(${stream.employerPhone})`
                            : ""}
                        </Typography>

                        {/* Chat Button */}
                        <Box mt={1}>
                          <Badge
                            badgeContent={unreadCounts[stream._id] || 0}
                            color="error"
                            overlap="circular"
                          >
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<ChatIcon />}
                              onClick={() => toggleChat(stream._id)}
                              color="success"
                              fullWidth
                            >
                              Chat
                            </Button>
                          </Badge>
                        </Box>

                        {/* Chat Popup */}
                        {openChatIds.has(stream?._id) && (
                          <Chat
                            postId={stream?._id}
                            senderId={user?._id}
                            senderRole={user?.role}
                            employerName={stream?.emp_name}
                            onClose={() => toggleChat(stream?._id)}
                            onUnreadCountChange={handleUnreadCountChange}
                          />
                        )}
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TableForActiveWorkStream;

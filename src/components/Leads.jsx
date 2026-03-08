import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
  Paper,
  InputLabel,
} from '@mui/material';
import axios from '../utils/axiosConfig';
import config, { CALL_STATUS_OPTIONS } from '../config';
import toast from 'react-hot-toast';
import { Context } from '../main';
import { useConfirm } from '../hook/confirmHook';
import UserCommentDialog from './UserCommentDialog';

import { useNavigate } from 'react-router-dom';
const LeadList = () => {
  const { isAuthorized, user } = useContext(Context);
  const { isOpen, message, requestConfirm, handleDialogConfirm, handleDialogCancel } = useConfirm();
  const navigateTo = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: Employer, 1: Agent
  const [leads, setLeads] = useState([]);
  const [phoneFilter, setPhoneFilter] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [followUpStatusFilter, setFollowUpStatusFilter] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleOpenDialogComment = user => {
    setSelectedUser(user); // store clicked user
    setDialogOpen(true);
  };
  useEffect(() => {
    fetchLeads();
  }, [activeTab]);
  useEffect(() => {
    if (!isAuthorized) {
      navigateTo('/landing');
      return;
    }

    if (user && user.role !== 'Admin' && user.role !== 'SuperAdmin') {
      navigateTo('/Dashboard');
      return;
    }

    if (user?.role === 'Employer' && !user?.isSubscribed) {
      navigateTo('/Dashboard');
    }
  }, [isAuthorized, user, navigateTo]);

  const fetchLeads = async () => {
    try {
      setLoading(true); // Set loading state to true before fetching
      const { data } = await axios.get(`${config.API_BASE_URL}/api/v1/user/leads`, {
        params: {
          role: activeTab === 0 ? 'Employer' : activeTab === 1 ? 'Agent' : 'SelfWorker',
          phone: phoneFilter,
          followupstatus: followUpStatusFilter,
        },
        withCredentials: true,
      });
      setLeads(data.leads);
      setFilteredLeads(data.leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };
  const handleSaveComment = async newComment => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/user-comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser._id, // ✅ Required
          text: newComment.text, // ✅ Required
          createdAt: newComment.createdAt, // Optional (backend can auto-generate)
          createdBy: newComment.createdBy, // ✅ Required
        }),
      });

      if (!res.ok) throw new Error('Failed to save comment');
      const savedComment = await res.json();

      // Optimistic UI update (append comment)
      setCommentsHistory(prev => [...prev, savedComment]);
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePhoneFilterChange = event => {
    setPhoneFilter(event.target.value);
  };

  const handleCallStatusChange = async (leadId, newStatus) => {
    try {
      await axios.put(
        `${config.API_BASE_URL}/api/v1/users/${leadId}/lead-status`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update status locally
      setLeads(prevLeads =>
        prevLeads.map(lead => (lead._id === leadId ? { ...lead, status: newStatus } : lead))
      );

      toast.success('Lead status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleFollowUpStatusFilterChange = event => {
    setFollowUpStatusFilter(event.target.value);
    setPage(0); // Reset page on filter change
  };
  const applyFilters = () => {
    fetchLeads();
  };

  const handleCloseDialogComment = () => setDialogOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ margin: 'auto', padding: 1, mb: 5 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 2 }} // ← updated line
      >
        <Tab label="Employers" />
        <Tab label="Agents" />
        <Tab label="SelfWorker" />
      </Tabs>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Phone"
            value={phoneFilter}
            size="small"
            onChange={handlePhoneFilterChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>FollowUp Status</InputLabel>
            <Select
              value={followUpStatusFilter || 'All'}
              size="small"
              onChange={handleFollowUpStatusFilterChange}
              label="FollowUp Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="new">New</MenuItem>
              {CALL_STATUS_OPTIONS.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button variant="contained" onClick={applyFilters} fullWidth sx={{ height: '40px' }}>
            Apply Filter
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table
            size="medium"
            sx={{
              minWidth: 650,
              borderCollapse: 'separate',
              borderSpacing: 0,
              '& th': {
                backgroundColor: '#f5f5f5',
                fontWeight: '600',
                color: '#333',
                borderBottom: '1px solid #ddd',
              },
              '& td': {
                borderBottom: '1px solid #eee',
                fontSize: '14px',
              },
              '& tr:nth-of-type(even)': {
                backgroundColor: '#fafafa',
              },
              '& tr:hover': {
                backgroundColor: '#f0f7ff',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>SN</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>CreatedAt</TableCell>
                <TableCell>UpdatedAt</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lead, index) => (
                  <TableRow key={lead._id} hover>
                    <TableCell> {page * rowsPerPage + index + 1}</TableCell>

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap', // Prevent line break
                        overflow: 'hidden', // Hide overflow text
                        textOverflow: 'ellipsis', // Add ellipsis (...) if text overflows
                        maxWidth: '100%', // Ensure cell respects table width
                        cursor: 'pointer',
                        color: '#1976d2',
                      }}
                      onClick={() => handleOpenDialogComment(lead)}
                    >
                      {lead.name}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        <a
                          href={`tel:${lead.phone}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {lead.phone}
                        </a>
                      </Typography>
                    </TableCell>
                    <TableCell>{lead.role}</TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap', // Prevent line break
                        overflow: 'hidden', // Hide overflow text
                        textOverflow: 'ellipsis', // Add ellipsis (...) if text overflows
                        maxWidth: '100%', // Ensure cell respects table width
                      }}
                    >
                      {new Date(lead.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap', // Prevent line break
                        overflow: 'hidden', // Hide overflow text
                        textOverflow: 'ellipsis', // Add ellipsis (...) if text overflows
                        maxWidth: '100%', // Ensure cell respects table width
                      }}
                    >
                      {new Date(lead.updatedAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell sx={{ py: 0 }}>
                      <FormControl fullWidth size="small" key={lead._id}>
                        <Select
                          value={lead.status || ''}
                          onChange={e => handleCallStatusChange(lead._id, e.target.value)}
                        >
                          <MenuItem value="new">New</MenuItem>
                          {CALL_STATUS_OPTIONS.map(status => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[50, 100]}
        component="div"
        count={leads.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <UserCommentDialog
        open={dialogOpen}
        onClose={handleCloseDialogComment}
        selectedUser={selectedUser}
        loggedInUser={user} // ✅ Pass logged-in user here
        onSaveComment={handleSaveComment}
      />
    </Box>
  );
};

export default LeadList;

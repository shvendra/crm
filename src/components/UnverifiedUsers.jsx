import React, { useContext, useEffect, useState } from 'react';
import JobList from './JobList';
import AadharViewer from './AadharViewer';
import CloseIcon from '@mui/icons-material/Close';
import DebouncedTextField from './DebouncedTextField';
import { useReferralDialog } from './Context/ReferralDialogContext';
import {
  Grid,
  Radio,
  RadioGroup,
  Checkbox,
  ListItemText,
  OutlinedInput,
  ClickAwayListener,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Divider,
  Chip,
  Button,
  Tabs,
  Tab,
  TablePagination,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  ListSubheader,
  FormControlLabel,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

import axios from '../utils/axiosConfig';
import ConfirmationDialog from './ConfirmationDialog';
import UserCommentDialog from './UserCommentDialog';
import toast from 'react-hot-toast';
import config, { CALL_STATUS_OPTIONS } from '../config';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useConfirm } from '../hook/confirmHook';
import { Context } from '../main';
import { useNavigate } from 'react-router-dom';
import { indianStates } from '../stateDistrict';
import categories from '../categories.json';

const serviceAreaOptions = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore'];

const UnverifiedUsers = () => {
  const { isOpen, message, requestConfirm, handleDialogConfirm, handleDialogCancel } = useConfirm();
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const { t,  i18n} = useTranslation();
  const [search, setSearch] = useState('');
  const [imgError, setImgError] = useState(false);
  const [commentsHistory, setCommentsHistory] = useState([]);
  const { showReferralDialog } = useReferralDialog();
  const [users, setUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0); 
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(50); 
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Unverified');
  const [followUpStatusFilter, setFollowUpStatusFilter] = useState(); // State for follow-up status filter
  const [filterApplied, setFilterApplied] = useState(false); // This state seems unused
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [myJobs, setMyJobs] = useState([]); // Jobs for the selected user (in dialog)
  const [expandedRowId, setExpandedRowId] = useState(null); // This state seems unused
  const [userJobCounts, setUserJobCounts] = useState({}); // This state seems unused in the current render logic
  // At the top of your component (UnverifiedUsers.jsx)
  const [jobPage, setJobPage] = useState(0);
  const [jobRowsPerPage, setJobRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [selectedState, setSelectedState] = useState();
  const handleChange = event => {
    const {
      target: { value },
    } = event;
    setSelectedAreas(typeof value === 'string' ? value.split(',') : value);
  };
  const handleCategoryChange = event => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };

 

  const handleApply = async () => {
  if (!selectedUser?._id) return;

  try {
    const res = await axios.put(
      `${config.API_BASE_URL}/api/v1/users/${selectedUser._id}/update-service-areas`,
      {
        serviceArea: selectedAreas,
        categories: selectedCategories, // ✅ ADD THIS
      },
      { withCredentials: true }
    );

    toast.success('Service area & categories updated');

    // ✅ Update local selectedUser immediately
    setSelectedUser(prev => ({
      ...prev,
      serviceArea: selectedAreas,
      categories: selectedCategories,
    }));
  } catch (err) {
    console.error(err);
    toast.error('Failed to update data');
  }
};


  const handleSourceTypeUpdate = async newSourceType => {
    if (!selectedUser?._id) return;

    // Instantly update UI
    setSelectedUser(prev => ({ ...prev, sourcetype: newSourceType }));

    try {
      const res = await axios.put(
        `${config.API_BASE_URL}/api/v1/users/${selectedUser._id}/update-source-type`,
        { sourcetype: newSourceType },
        { withCredentials: true }
      );

      toast.success('Source type updated successfully');
      console.log('Source type updated:', res.data);
    } catch (err) {
      console.error('Error updating source type:', err);
      toast.error('Failed to update source type');

      // Optionally revert to previous value if API fails
      setSelectedUser(prev => ({
        ...prev,
        sourcetype: selectedUser?.sourcetype || 'Online',
      }));
    }
  };

  // Effect to handle redirection based on authorization and role
  useEffect(() => {
    if (!isAuthorized) {
      navigateTo('/landing');
      return;
    }
    // Assuming only Admin and SuperAdmin should access this page
    if (user && user.role !== 'Admin' && user.role !== 'SuperAdmin') {
      navigateTo('/Dashboard');
      return;
    }
    // This condition for Employer seems out of place in an UnverifiedUsers component
    // if (user?.role === "Employer" && !user?.isSubscribed) {
    //   navigateTo("/Dashboard");
    // }
  }, [isAuthorized, user, navigateTo]);

  // Effect to fetch users whenever relevant state changes (tab, pagination, filters)
  useEffect(() => {
    fetchUsers();
    console.log('Fetching users for tab:', activeTab, 'page:', page, 'rowsPerPage:', rowsPerPage); // Log fetch trigger
  }, [
    activeTab,
    page,
    rowsPerPage,
    stateFilter,
    districtFilter,
    phoneFilter,
    workTypeFilter,
    statusFilter,
    followUpStatusFilter, // Added followUpStatusFilter to dependencies
  ]); // Added pagination and filter states to dependencies
  useEffect(() => {
    if (selectedUser?.serviceArea?.length) {
      setSelectedAreas(selectedUser.serviceArea);

      // Try to find the state based on any matching district
      const foundState = Object.entries(indianStates).find(([state, districts]) =>
        Object.keys(districts).some(d => selectedUser.serviceArea.includes(d))
      );

      if (foundState) {
        setSelectedState(foundState[0]);
      }
    }
      if (selectedUser?.categories) {
    setSelectedCategories(selectedUser.categories);
  }
  }, [selectedUser]);
  const fetchUsers = async () => {
    try {
      let roleParam = null;
      setLoading(true);
      if (activeTab === 0) roleParam = 'Employer';
      else if (activeTab === 1) roleParam = 'Agent';
      else if (activeTab === 2) roleParam = 'SelfWorker';
      else if (activeTab === 3) roleParam = 'Worker';
      else if (activeTab === 4) roleParam = 'KYC';

      const { data } = await axios.get(`${config.API_BASE_URL}/api/v1/users/allUsers`, {
        params: {
          ...(roleParam ? { role: roleParam } : {}), // conditionally include `role`
          state: stateFilter,
          district: districtFilter,
          phone: phoneFilter,
          areaOfWork: workTypeFilter,
          status: statusFilter,
          followupstatus: followUpStatusFilter,
          // --- ADD PAGINATION PARAMETERS ---
          page: page + 1, // Backend typically expects 1-based page number
          limit: rowsPerPage,
          // --- END ADD PAGINATION PARAMETERS ---
          // Note: Search filter state 'search' is not included in backend params
          // If backend supports search, add: ...(search && { search })
        },
        withCredentials: true,
      });
      // Assuming backend returns { users: [...], totalUsersCount: N }
      setUsers(data.users); // Set users for the current page
      setTotalUsersCount(data.totalUsersCount || 0); // Set the total count from backend
      // setFilteredUsers(data.users); // filteredUsers state is no longer needed for pagination
      // setPage(data.page);
    } catch (error) {
      console.error('Error fetching data', error);
      toast.error('Failed to fetch users');
      setUsers([]);
      setTotalUsersCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0); // Reset user table pagination on tab change
    // rowsPerPage state can remain, or reset if desired
    // setRowsPerPage(50);
    // Reset filters when changing tabs if desired, or keep them
    // setStateFilter("");
    // setDistrictFilter("");
    // setPhoneFilter("");
    // setStatusFilter("Unverified"); // Or set a default based on tab
  };

  // Handle page change for USERS table
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Updating 'page' state will trigger useEffect and fetchUsers
  };

  // Handle rows per page change for USERS table
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Updating 'rowsPerPage' state will trigger useEffect
    setPage(0); // Reset page to 0 when changing rows per page
  };

  // Handle filter changes - these handlers already reset the page, which is good
  const handleStateFilterChange = event => {
    setStateFilter(event.target.value);
    setPage(0); // Reset page on filter change
  };

  const handleDistrictFilterChange = event => {
    setDistrictFilter(event.target.value);
    setPage(0); // Reset page on filter change
  };

  const handlePhoneFilterChange = value => {
    setPhoneFilter(value);
  };

  const handleWorkTypeFilterChange = value => {
    setWorkTypeFilter(value);
  };

  const handleStatusFilterChange = event => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset page on filter change
  };

  const handleFollowUpStatusFilterChange = event => {
    setFollowUpStatusFilter(event.target.value);
    setPage(0); // Reset page on filter change
  };

  const applyFilters = () => {
    setPage(0); // Reset user table pagination when applying filters
    // fetchUsers() is not needed here, as updating filter states will trigger the useEffect
  };

  const handleMakeVerified = async userId => {
    try {
      const confirmed = await requestConfirm('Are you sure you want to perform this action?');
      if (confirmed) {
        await axios.put(
          `${config.API_BASE_URL}/api/v1/users/${userId}/verify`,
          { status: 'Verified' },
          { withCredentials: true }
        );
        setUsers(prevUsers =>
          prevUsers.map(u => (u._id === userId ? { ...u, status: 'Verified' } : u))
        );
        toast.success('User verified successfully');
      }
    } catch (error) {
      console.error('Error verifying user', error);
      toast.error('Failed to verify user');
    }
  };

  const handleCallStatusChange = async (userId, newStatus) => {
    try {
      const confirmed = await requestConfirm('Are you sure you want to update the call status?');
      if (confirmed) {
        await axios.put(
          `${config.API_BASE_URL}/api/v1/users/${userId}/followup-status`,
          { followupstatus: newStatus },
          { withCredentials: true }
        );

        // ✅ Update followupstatus locally
        setUsers(prevUsers =>
          prevUsers.map(u => (u._id === userId ? { ...u, followupstatus: newStatus } : u))
        );

        toast.success('Call status updated successfully');
      }
    } catch (error) {
      console.error('Error updating call status', error);
      toast.error('Failed to update call status');
    }
  };

  const handleMakeUnVerified = async userId => {
    try {
      const confirmed = await requestConfirm('Are you sure you want to perform this action?');
      if (confirmed) {
        await axios.put(
          `${config.API_BASE_URL}/api/v1/users/${userId}/verify`,
          { status: 'Unverified' },
          { withCredentials: true }
        );
        // ✅ Update status locally
        setUsers(prevUsers =>
          prevUsers.map(u => (u._id === userId ? { ...u, status: 'Unverified' } : u))
        );
        toast.success('User status updated successfully');
      }
    } catch (error) {
      console.error('Error unverifying user', error);
      toast.error('Failed to unverify user');
    }
  };

  // handleToggleExpand and related states (expandedRowId, userJobCounts) seem unused in the current render logic
  // and might be remnants from a different feature or intended for the JobList component.
  // Keeping them for now but noting they don't affect the current table/dialog.
  const handleToggleExpand = jobId => {
    setExpandedRowId(prev => (prev === jobId ? null : jobId)); // Toggle row expand/collapse
  };
  const handleCloseDialogComment = () => setDialogOpen(false);
  const handleOpenDialogComment = user => {
    setSelectedUser(user); // store clicked user
    setDialogOpen(true);
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

  const handleOpenDialog = user => {
    setSelectedAreas([]); // Reset selected areas when opening dialog
    setSelectedState([]); // Reset selected state when opening dialog
    setSelectedUser(user);

    // Fetch jobs for the selected user when the dialog opens
    const fetchJobs = async () => {
      try {
        console.log('Fetching jobs for user:', user);
        // Assuming you want jobs posted by the selected user
        const params = { postedBy: user?._id };
        const { data } = await axios.get(`${config.API_BASE_URL}/api/v1/job/getmyjobs`, {
          withCredentials: true,
          params,
        });
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to fetch jobs');
        setMyJobs([]); // Clear jobs on error
      }
    };

    fetchJobs();
    setOpenDialog(true);
  };

  // filteredJobs and paginatedJobs logic for the dialog's job list
  // should ideally be moved inside the JobList component itself.
  // Keeping them here for now as they were in the original code,
  // but they are not used for the main users table pagination.
  const filteredJobs = myJobs.filter(
    job =>
      (job?.name?.toLowerCase() || '').includes(search.toLowerCase()) || // Apply search filter
      (job?.phone || '').includes(search) ||
      (job?.district?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setMyJobs([]); // Clear jobs when closing dialog
    // Reset job list pagination state here if it were managed in UnverifiedUsers
  };

  return (
    <Box sx={{ margin: 'auto', padding: 1, mb: 8 }}>
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
        <Tab label="Workers" />
        <Tab label="KYC" />
      </Tabs>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="State"
            size="small"
            value={stateFilter}
            onChange={handleStateFilterChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <TextField
              label="District"
              size="small"
              value={districtFilter}
              onChange={handleDistrictFilterChange}
              fullWidth
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DebouncedTextField
            label="Phone"
            value={phoneFilter}
            onDebouncedChange={handlePhoneFilterChange}
            delay={500} // optional, default 500ms
          />
        </Grid>

        {activeTab !== 0 && activeTab !== 4 && (
          <Grid item xs={12} sm={6} md={4}>
            <DebouncedTextField
              label="Work Type"
              value={workTypeFilter}
              onDebouncedChange={handleWorkTypeFilterChange}
              delay={500} // optional, default 500ms
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              size="small"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="Unverified">Unverified</MenuItem>
              <MenuItem value="Verified">Verified</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>FollowUp Status</InputLabel>
            <Select
              size="small"
              value={followUpStatusFilter || 'All'}
              onChange={handleFollowUpStatusFilterChange}
              label="FollowUp Status"
            >
              <MenuItem value="All">All</MenuItem>
              {CALL_STATUS_OPTIONS.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={applyFilters}
            fullWidth
            sx={{ height: '40px' }}
          >
            Apply Filters
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          {' '}
          {/* Added Paper for styling */}
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
                {/* Consider if AgentCount is relevant for all tabs or just Agents */}
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Location</TableCell>
                {(() => {
                  const cells = [];

                  if (activeTab === 1) {
                    cells.push(<TableCell key="workers">Workers</TableCell>);
                  } else if (activeTab === 2) {
                    cells.push(<TableCell key="agent">Agent</TableCell>);
                  } else if (activeTab === 3) {
                    cells.push(<TableCell key="agent">Agent</TableCell>);
                    cells.push(<TableCell key="worktype">WorkType</TableCell>);
                  }

                  return cells;
                })()}
                <TableCell>CreatedAt</TableCell>
                <TableCell>UpdatedAt</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Call Status</TableCell> {/* Changed label */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Render users for the current page */}
              {users?.length > 0 ? (
                users.map((user, index) => (
                  <TableRow key={user._id}>
                    {/* Serial Number Column - Calculate based on current page and rows per page */}
                    <TableCell
                      onClick={() => showReferralDialog(user?.phone)}
                      sx={{ py: 0, whiteSpace: 'nowrap' }}
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell
                      sx={{
                        py: 0,
                        whiteSpace: 'nowrap',
                        backgroundColor: user.isSubscribed ? 'lightgreen' : 'lightyellow',
                      }}
                      onClick={() => handleOpenDialogComment(user)} // Open dialog on name click
                    >
                      <a>{user.name}</a>
                    </TableCell>
                    <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>
                      <a
                        href={`tel:${user.phone}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {user.phone}
                      </a>
                    </TableCell>

                    <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>
                      {`${user.state || ''}, ${user.district || ''}, ${user.block || ''}`}{' '}
                      {/* Added null checks */}
                    </TableCell>
                    {activeTab !== 4 && activeTab !== 0 && (
                      <>
                        {/* 🔹 Agent Column */}
                        {(activeTab === 2 || activeTab === 3 || activeTab === 1) && (
                          <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>
                            {user.role === 'Agent' ? (
                              `${user?.workerCount || 0} Workers`
                            ) : user.role === 'Worker' ? (
                              <>
                                {user?.agentName
                                  ? `${user.agentName} - ${user.agentPhone || '-'}`
                                  : '-'}
                              </>
                            ) : (
                              'NA'
                            )}
                          </TableCell>
                        )}

                        {/* 🔹 Worktype Column */}
                        {activeTab === 3 && (
                          <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>
                            {(() => {
                              // Safely parse areasOfWork
                              let parsedArray = [];

                              if (
                                Array.isArray(user.areasOfWork) &&
                                typeof user.areasOfWork[0] === 'string'
                              ) {
                                try {
                                  parsedArray = JSON.parse(user.areasOfWork[0]);
                                } catch (e) {
                                  parsedArray = user.areasOfWork; // fallback if already proper array
                                }
                              }

                              const result = parsedArray.join(', ');

                              return expandedRowId === user._id ? (
                                <>
                                  {result}
                                  <Typography
                                    onClick={() => handleToggleExpand(user._id)}
                                    variant="body2"
                                    color="primary"
                                    component="span"
                                    sx={{
                                      ml: 1,
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                    }}
                                  >
                                    Read Less
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  {result.slice(0, 20)}
                                  {result.length > 20 && (
                                    <Typography
                                      onClick={() => handleToggleExpand(user._id)}
                                      variant="body2"
                                      color="primary"
                                      component="span"
                                      sx={{
                                        ml: 1,
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                      }}
                                    >
                                      Read More
                                    </Typography>
                                  )}
                                </>
                              );
                            })()}
                          </TableCell>
                        )}
                      </>
                    )}

                    <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>
                      {new Date(user.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>
                      {new Date(user.updatedAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>
                      <Box
                        component="span"
                        sx={{
                          backgroundColor: user.status === 'Verified' ? '#d4edda' : '#f8d7da',
                          color: user.status === 'Verified' ? '#155724' : '#721c24',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-block',
                        }}
                      >
                        {user.status}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>{user?.sourcetype}</TableCell>
                    <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>
                      <FormControl fullWidth size="small" key={user._id}>
                        <Select
                          value={user.followupstatus || ''}
                          onChange={e => handleCallStatusChange(user._id, e.target.value)}
                          displayEmpty
                        >
                          {CALL_STATUS_OPTIONS.map(status => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell sx={{ py: 0, whiteSpace: 'nowrap' }}>
                      {user.status === 'Unverified' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleMakeVerified(user._id)}
                          sx={{ mr: 1 }} // Add some margin
                        >
                          Approve
                        </Button>
                      )}
                      {user.status === 'Verified' && ( // Option to unverify if needed
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={() => handleMakeUnVerified(user._id)}
                          sx={{ mr: 1 }} // Add some margin
                        >
                          Unverify
                        </Button>
                      )}
                      {/* Show view icon for relevant tabs */}
                      {(activeTab === 0 ||
                        activeTab === 1 ||
                        activeTab === 2 ||
                        activeTab === 3 ||
                        activeTab === 4) && (
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(user)}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination for the USERS table */}
      <TablePagination
        rowsPerPageOptions={[50, 100, 150]}
        component="div"
        count={totalUsersCount} // Use the total count from the backend
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog for viewing user details */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md" scroll="paper">
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">User Profile</Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />

        <DialogContent dividers>
          {selectedUser && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' }, // stack on xs, row on md+
                  justifyContent: 'space-between',
                  mb: 4,
                  gap: 2, // gap between items on small screens
                }}
              >
                {/* Header: Avatar + Basic Info */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' }, // stack avatar and text on xs
                    mb: { xs: 2, md: 0 },
                    textAlign: { xs: 'center', sm: 'left' },
                  }}
                >
                  <Avatar
                    src={`${config.FILE_BASE_URL}/${selectedUser.profilePhoto}`}
                    alt={selectedUser.name}
                    sx={{
                      width: 100,
                      height: 100,
                      mr: { sm: 3, xs: 0 },
                      mb: { xs: 2, sm: 0 },
                    }}
                  />
                  <Box>
                    <Typography variant="h5">{selectedUser.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      <a
                        href={`tel:${selectedUser.phone}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {selectedUser.phone}
                      </a>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {selectedUser?.email || 'No email provided'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {[selectedUser.state, selectedUser.district, selectedUser.block]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Array.isArray(selectedUser?.categories) && selectedUser.categories.length > 0
                        ? selectedUser.categories.join(', ')
                        : 'No categories selected'}
                    </Typography>
                  </Box>
                </Box>

                {/* Serviceable Area Form */}
                  <Box
                    sx={{
                      width: { xs: '100%', md: 350 },
                      p: 2,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      alignSelf: { xs: 'center', md: 'flex-start' },
                    }}
                  >
                                    {(selectedUser.role === 'Agent' || selectedUser.role === 'SelfWorker' || selectedUser.role === 'Worker') && (

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        width: '100%',
                      }}
                    >
                      {/* Header: Title + Apply Button */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 1,
                          width: '100%',
                        }}
                      >
                        <Typography variant="subtitle1">Serviceable Area</Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleApply}
                          sx={{ textTransform: 'none' }}
                        >
                          Apply
                        </Button>
                      </Box>

                      <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                        <InputLabel id="state-label">State</InputLabel>
                        <Select
                          labelId="state-label"
                          id="state-select"
                          value={selectedState}
                          onChange={e => {
                            setSelectedState(e.target.value);
                          }}
                          label="State"
                        >
                          {Object.keys(indianStates).map(state => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Step 2: District Multi-Select */}
                      {selectedState && (
                        <FormControl sx={{ width: '100%', mt: 2 }} size="small">
                          <Select
                            multiple
                            value={selectedAreas}
                            onChange={handleChange}
                            input={<OutlinedInput placeholder="Select Districts" />}
                            renderValue={selected =>
                              selected.length === 0 ? 'Select Districts' : selected.join(', ')
                            }
                          >
                            {Object.keys(indianStates[selectedState] || {}).map(district => (
                              <MenuItem key={district} value={district}>
                                <Checkbox checked={selectedAreas.includes(district)} />
                                <ListItemText primary={district} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      {/* Step 3: Selected Areas Display */}
                      <Box sx={{ mt: 2, width: '100%', textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Selected Areas:
                        </Typography>

                        {selectedAreas.length > 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            {selectedAreas.join(', ')}
                          </Typography>
                        ) : selectedUser.serviceArea?.length > 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            {selectedUser.serviceArea.join(', ')}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No areas selected.
                          </Typography>
                        )}
                      </Box>
                           <FormControl size="small" sx={{ width: '100%', mb: 2 }}>
                      <InputLabel id="category-label">Work Categories</InputLabel>

                    <Select
  labelId="category-label"
  multiple
  value={selectedCategories}
  onChange={handleCategoryChange}
  input={<OutlinedInput label="Work Categories" />}
  renderValue={(selected) =>
    selected.length === 0 ? "Select Categories" : selected.join(", ")
  }
>
  {categories.map((cat) => [
    <ListSubheader key={`${cat.value}-header`} sx={{ fontWeight: 600, opacity: 0.7 }}>
      {cat.label}
    </ListSubheader>,

    cat.subcategories.map((sub) => (
      <MenuItem key={sub.value} value={sub.value}>
        <Checkbox checked={selectedCategories.includes(sub.value)} />
        {sub.label}
      </MenuItem>
    )),

    <Divider key={`${cat.value}-divider`} />
  ])}
</Select>
                    </FormControl>
                    </Box>
                                    )}

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Source Type
                      </Typography>
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          name="sourcetype"
                          value={selectedUser?.sourcetype || 'Online'}
                          onChange={e => handleSourceTypeUpdate(e.target.value)} // ✅ Call API here
                        >
                          <FormControlLabel value="Online" control={<Radio />} label="Online" />
                          <FormControlLabel
                            value="Offline"
                            control={<Radio />}
                            label="Offline"
                          />
                          <FormControlLabel value="Referral" control={<Radio />} label="Referral" />
                        </RadioGroup>
                      </FormControl>
                 
                    </Box>
                  </Box>
              </Box>

              {/* Aadhar Documents */}
              {/* Aadhar Documents — show only if NOT a Worker */}
              {/* {selectedUser?.role !== 'Worker' && (
              
              )} */}
  <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Aadhar Documents
                  </Typography>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    <AadharViewer selectedUser={selectedUser} config={config} />
                  </Box>
                </Box>
              {/* KYC Section (Tabular) */}
              {selectedUser.role == 'Employer' && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    KYC Information
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <strong>Subscription</strong>
                          </TableCell>
                          <TableCell>{selectedUser.isSubscribed ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                        {['firmName', 'firmAddress', 'gstNumber', 'aadharNumber'].map(key => (
                          <TableRow key={key}>
                            <TableCell>
                              <strong>{key.replace(/([A-Z])/g, ' $1').trim()}</strong>
                            </TableCell>
                            <TableCell>{selectedUser.kyc?.[key] || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Employer-Type Chips */}
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(selectedUser?.employerType || {})
                      .filter(([_, v]) => v)
                      .map(([type]) => (
                        <Chip
                          key={type}
                          label={type.charAt(0).toUpperCase() + type.slice(1)}
                          color="primary"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                  </Box>
                </Box>
              )}

              {/* Bank Info for Agent */}
              {(selectedUser.role === 'Agent' ||
                selectedUser.role === 'SelfWorker' ||
                selectedUser.role === 'Worker') && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Bank Information
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        {['accountNumber', 'ifscCode', 'bankName'].map(key => (
                          <TableRow key={key}>
                            <TableCell>
                              <strong>{key.replace(/([A-Z])/g, ' $1').trim()}</strong>
                            </TableCell>
                            <TableCell>{selectedUser.bankDetails?.[key] || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(selectedUser?.employerType || {})
                      .filter(([_, v]) => v)
                      .map(([type]) => (
                        <Chip
                          key={type}
                          label={type.charAt(0).toUpperCase() + type.slice(1)}
                          color="primary"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                  </Box>
                </Box>
              )}

              {/* Workers List for Agent */}
              {activeTab === 1 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Workers
                  </Typography>
                  <JobList
                    jobs={myJobs}
                    userId={selectedUser._id}
                    t={t}
                    page={jobPage}
                    setPage={setJobPage}
                    rowsPerPage={jobRowsPerPage}
                    setRowsPerPage={setJobRowsPerPage}
                  />
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
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
        loggedInUser={user} // ✅ Pass logged-in user here
        onSaveComment={handleSaveComment}
      />
    </Box>
  );
};

export default UnverifiedUsers;

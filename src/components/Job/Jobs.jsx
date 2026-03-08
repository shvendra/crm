import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  TextField,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from '../../utils/axiosConfig';
import toast from 'react-hot-toast';
import config from '../../config';
import stateDistrict from '../../stateDistrict';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../main';
import { useTranslation } from 'react-i18next';
import UserCommentDialog from '../UserCommentDialog';
import SearchComponent from './SearchComponent';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const roles = ['Agent', 'Employer', 'Worker', 'SelfWorker'];
const generateUploadLink = async (userId) => {
  const res = await axios.post(
    `${config.API_BASE_URL}/api/v1/user/generate-upload-link`,
    { userId },
    { withCredentials: true }
  );

  return res.data.link;
};

// const handleCopyLink = link => {
//   navigator.clipboard.writeText(link);
//   toast.success('Link copied to clipboard');
// };
const handleCopyLink = async (link) => {
  // const link = await generateUploadLink(userId);
  await navigator.clipboard.writeText(link);
  alert("Upload link copied!");
};

// ...imports remain same

const Jobs = () => {
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);
  const { t } = useTranslation();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [aadharFrontPreview, setAadharFrontPreview] = useState(
    selectedUserData?.kyc?.aadharFront
      ? `${config.FILE_BASE_URL}/${selectedUserData.kyc.aadharFront}`
      : null
  );
  const [aadharBackPreview, setAadharBackPreview] = useState(
    selectedUserData?.kyc?.aadharBack
      ? `${config.FILE_BASE_URL}/${selectedUserData.kyc.aadharBack}`
      : null
  );

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(role && { role }),
        ...(state && { state }),
        ...(district && { district }),
        ...(search && { search }),
      };
      const { data } = await axios.get(`${config.API_BASE_URL}/api/v1/job/getall`, {
        withCredentials: true,
        params,
      });
      setJobs(data.jobs);
      setTotalCount(data?.totalJobsCount || 0);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized) navigateTo('/landing');
    if (user && !['Admin', 'SuperAdmin'].includes(user.role)) navigateTo('/Dashboard');
  }, [isAuthorized, user, navigateTo]);

  useEffect(() => {
    fetchJobs();
  }, [role, state, district, page, rowsPerPage, search]);

  // Handlers for opening dialogs
  const handleOpenCommentDialog = job => {
    setSelectedUserData(job);
    setCommentDialogOpen(true);
  };

  // call when user clicks edit
  const handleOpenEditDialog = job => {
    // ensure deep copy so we don't mutate table state directly
    const copy = JSON.parse(JSON.stringify(job || {}));

    // keep existing File references if already set (rare)
    // set kyc object if missing
    if (!copy.kyc) copy.kyc = {};
  if (!copy.gender) copy.gender = ''; // IMPORTANT

    setSelectedUserData(copy);
    setEditDialogOpen(true);

    // initialize previews from existing server URLs (if present)
    setProfilePreview(
      job?.profilePhoto ? `${config.FILE_BASE_URL}/${job.profilePhoto}?t=${Date.now()}` : null
    );
    setAadharFrontPreview(
      job?.kyc?.aadharFront ? `${config.FILE_BASE_URL}/${job.kyc.aadharFront}?t=${Date.now()}` : null
    );
    setAadharBackPreview(
      job?.kyc?.aadharBack ? `${config.FILE_BASE_URL}/${job.kyc.aadharBack}?t=${Date.now()}` : null
    );
  };

  // Close handlers
  const handleCloseCommentDialog = () => setCommentDialogOpen(false);
  const handleCloseEditDialog = () => setEditDialogOpen(false);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);

    setSelectedUserData(prev => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleKYCFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update selectedUserData
    setSelectedUserData(prev => ({
      ...prev,
      kyc: {
        ...prev.kyc,
        [field]: file,
      },
    }));

    // Update preview
    if (field === 'aadharFront') setAadharFrontPreview(URL.createObjectURL(file));
    if (field === 'aadharBack') setAadharBackPreview(URL.createObjectURL(file));
  };

  const handleDialogSave = async () => {
    if (!selectedUserData) return;

    try {
      const formData = new FormData();

      // If backend uses req.user._id by default but you are sending userId for editing other users:
      formData.append('userId', selectedUserData._id || '');

      // ---- Basic fields ----
      formData.append('name', selectedUserData.name || '');
      formData.append('phone', selectedUserData.phone || '');
      formData.append('role', selectedUserData.role || '');
      formData.append('status', selectedUserData.status || '');
      formData.append('address', selectedUserData.address || '');
// ---- Gender ----
formData.append('gender', selectedUserData.gender || '');

      // ---- Location fields (important - you didn't append these earlier) ----
      formData.append('state', selectedUserData.state || '');
      formData.append('district', selectedUserData.district || '');
      // if backend expects 'block' or 'tehsil' field name, use that name:
      formData.append('block', selectedUserData.block || '');

      // ---- Bank details ----
      formData.append('accountNumber', selectedUserData.bankDetails?.accountNumber || '');
      formData.append('ifscCode', selectedUserData.bankDetails?.ifscCode || '');
      formData.append('bankName', selectedUserData.bankDetails?.bankName || '');

      // ---- KYC fields ----
      formData.append('aadharNumber', selectedUserData.kyc?.aadharNumber || '');
      formData.append('gstNumber', selectedUserData.kyc?.gstNumber || '');
      formData.append('firmName', selectedUserData.kyc?.firmName || '');
      formData.append('firmAddress', selectedUserData.kyc?.firmAddress || '');

      // ---- Files: append only if actual File object ----
      // profilePhoto stored as selectedUserData.profilePhoto (when user uploads a file)
      if (selectedUserData.profilePhoto instanceof File) {
        formData.append('profilePhoto', selectedUserData.profilePhoto);
      }

      // KYC files: aadharFront / aadharBack
      if (selectedUserData.kyc?.aadharFront instanceof File) {
        formData.append('aadharFront', selectedUserData.kyc.aadharFront);
      }
      if (selectedUserData.kyc?.aadharBack instanceof File) {
        formData.append('aadharBack', selectedUserData.kyc.aadharBack);
      }

      // ----- DEBUG: log formData contents (remove in production) -----
      // this prints key/value pairs in console (files will show as File objects)
      for (const pair of formData.entries()) {
        // eslint-disable-next-line no-console
        console.log('formData:', pair[0], pair[1]);
      }

      // ---- SEND: do NOT set Content-Type manually; browser sets the boundary ----
      const response = await axios.put(`${config.API_BASE_URL}/api/v1/user/update`, formData, {
        withCredentials: true,
        // IMPORTANT: do NOT set 'Content-Type' header here
      });

      if (response.data.success) {
        toast.success(response.data.message || 'User updated successfully');
        // refresh data & close dialog
        // await fetchJobs();
        setEditDialogOpen(false);

        // update previews to server-returned URLs if backend returned user
        if (response.data.user) {
          setProfilePreview(
            response.data.user.profilePhoto
              ? `${config.FILE_BASE_URL}/${response.data.user.profilePhoto}?t=${Date.now()}`
              : null
          );
          setAadharFrontPreview(
            response.data.user.kyc?.aadharFront
              ? `${config.FILE_BASE_URL}/${response.data.user.kyc.aadharFront}?t=${Date.now()}`
              : null
          );
          setAadharBackPreview(
            response.data.user.kyc?.aadharBack
              ? `${config.FILE_BASE_URL}/${response.data.user.kyc.aadharBack}?t=${Date.now()}`
              : null
          );

          // Optionally update the local selectedUserData with full user object
          setSelectedUserData(prev => ({ ...prev, ...response.data.user }));
        }
      } else {
        toast.error(response.data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Update failed', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Paper sx={{ padding: 2, m: 1, mb: 4 }}>
      <Typography variant="h5" mb={2}>
        {t('allUsers')}
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <SearchComponent t={t} handleSearchChange={value => setSearch(value)} />

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={role || ''}
              onChange={e => {
                setRole(e.target.value);
                setPage(0);
              }}
              size="small"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {roles.map(r => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* State/District/Tehsil filters */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              size="small"
              value={state || ''}
              onChange={e => {
                setState(e.target.value);
                setDistrict('');
                setTehsil('');
                setPage(0);
              }}
            >
              <MenuItem value="">
                <em>All States</em>
              </MenuItem>
              {Object.keys(stateDistrict).map(s => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth disabled={!state}>
            <InputLabel>District</InputLabel>
            <Select
              size="small"
              value={district || ''}
              onChange={e => {
                setDistrict(e.target.value);
                setTehsil('');
                setPage(0);
              }}
            >
              <MenuItem value="">
                <em>All Districts</em>
              </MenuItem>
              {state &&
                Object.keys(stateDistrict[state] || {}).map(d => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth disabled={!district}>
            <InputLabel>Block/Tehsil</InputLabel>
            <Select
              size="small"
              value={tehsil || ''}
              onChange={e => {
                setTehsil(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">
                <em>All Blocks</em>
              </MenuItem>
              {state &&
                district &&
                (stateDistrict[state]?.[district] || []).map(b => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Jobs Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
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
              '& .MuiTableCell-root': { py: 0.5, px: 0.5 },
            }}
          >
            <TableHead>
              <TableRow>
                {[
                  'SN',
                  'Name',
                  'Phone',
                  'Role',
                  'State',
                  'District',
                  'Block/Tehsil',
                  'Address',
                  'Date',
                  'Status',
                  'Action',
                ].map(head => (
                  <TableCell key={head}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <TableBody>
                {jobs.length > 0 ? (
                  jobs.map((job, idx) => (
                    <TableRow key={job._id}>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>
                        <Button variant="text" onClick={() => handleOpenCommentDialog(job)}>
                          {job.name || 'N/A'}
                        </Button>
                      </TableCell>
                      <TableCell>{job.phone || 'N/A'}</TableCell>
                      <TableCell>{job.role || 'N/A'}</TableCell>
                      <TableCell>{job.state || 'N/A'}</TableCell>
                      <TableCell>{job.district || 'N/A'}</TableCell>
                      <TableCell>{job.block || 'N/A'}</TableCell>
                      <TableCell>{job.address || 'N/A'}</TableCell>
                      <TableCell>
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Alert
                          severity={job.status === 'Verified' ? 'success' : 'error'}
                          sx={{ py: 0, px: 1 }}
                        >
                          {job.status}
                        </Alert>
                      </TableCell>
                 <TableCell>
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    {/* Edit */}
    <IconButton
      size="small"
      color="primary"
      onClick={() => handleOpenEditDialog(job)}
    >
      <EditIcon fontSize="small" />
    </IconButton>

    {/* Generate Link */}
    <IconButton
      size="small"
      color="secondary"
     onClick={async () => {
  const link = await generateUploadLink(job._id);
  handleCopyLink(link);
}}
    >
      <LinkIcon fontSize="small" />
    </IconButton>
  </Box>
</TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      No data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 25, 50, 100]}
          />
        </TableContainer>
      </Box>

      {/* Comment Dialog */}
      <UserCommentDialog
        open={commentDialogOpen}
        onClose={handleCloseCommentDialog}
        selectedUser={selectedUserData}
        loggedInUser={user}
      />

      {/* Edit Dialog */}
      {selectedUserData && (
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogContent dividers sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Grid container spacing={2}>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                {/* Profile Photo Preview */}
                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #e0e0e0',
                      mb: 2,
                      boxShadow: 1,
                    }}
                  >
                    <img
                      src={profilePreview || '/usericon.png'}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = '/usericon.png';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </Grid>

                {/* Upload Button */}
                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    component="label"
                    size="medium"
                    sx={{ minWidth: 200 }}
                  >
                    Upload Profile Photo
                    <input type="file" hidden onChange={e => handleFileChange(e, 'profilePhoto')} />
                  </Button>
                </Grid>
              </Grid>

              {/* Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Name"
                  value={selectedUserData?.name || ''}
                  onChange={e => setSelectedUserData(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone"
                  value={selectedUserData?.phone || ''}
                  onChange={e => setSelectedUserData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </Grid>

              {/* Role */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={selectedUserData?.role || ''}
                    label="Role"
                    onChange={e => setSelectedUserData(prev => ({ ...prev, role: e.target.value }))}
                  >
                    {roles.map(r => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  
                  <Select
                    value={selectedUserData?.status || ''}
                    label="Status"
                    onChange={e =>
                      setSelectedUserData(prev => ({ ...prev, status: e.target.value }))
                    }
                  >
                    <MenuItem value="Verified">Verified</MenuItem>
                    <MenuItem value="Unverified">Unverified</MenuItem>
                    <MenuItem value="Block">Block</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Address */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Address"
                  value={selectedUserData?.address || ''}
                  onChange={e =>
                    setSelectedUserData(prev => ({ ...prev, address: e.target.value }))
                  }
                />
              </Grid>
{/* Gender */}
<Grid item xs={12} sm={6}>
  <FormControl fullWidth size="small">
    <InputLabel>Gender</InputLabel>
    <Select
      value={selectedUserData?.gender || ''}
      label="Gender"
      onChange={e =>
        setSelectedUserData(prev => ({
          ...prev,
          gender: e.target.value,
        }))
      }
    >
      {/* Empty option so nothing is selected by default */}
      <MenuItem value="">
        <em>Select Gender</em>
      </MenuItem>

      <MenuItem value="Male">Male</MenuItem>
      <MenuItem value="Female">Female</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Select>
  </FormControl>
</Grid>

              {/* State / District / Block */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>State</InputLabel>
                  <Select
                    value={selectedUserData?.state || ''}
                    label="State"
                    onChange={e => {
                      setSelectedUserData(prev => ({
                        ...prev,
                        state: e.target.value,
                        district: '',
                        block: '',
                      }));
                    }}
                  >
                    {Object.keys(stateDistrict).map(s => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  size="small"
                  disabled={!selectedUserData?.state}
                >
                  <InputLabel>District</InputLabel>
                  <Select
                    value={selectedUserData?.district || ''}
                    label="District"
                    onChange={e =>
                      setSelectedUserData(prev => ({
                        ...prev,
                        district: e.target.value,
                        block: '',
                      }))
                    }
                  >
                    {selectedUserData?.state &&
                      Object.keys(stateDistrict[selectedUserData.state] || {}).map(d => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  size="small"
                  disabled={!selectedUserData?.district}
                >
                  <InputLabel>Block / Tehsil</InputLabel>
                  <Select
                    value={selectedUserData?.block || ''}
                    label="Block / Tehsil"
                    onChange={e =>
                      setSelectedUserData(prev => ({ ...prev, block: e.target.value }))
                    }
                  >
                    {selectedUserData?.state &&
                      selectedUserData?.district &&
                      (stateDistrict[selectedUserData.state][selectedUserData.district] || []).map(
                        b => (
                          <MenuItem key={b} value={b}>
                            {b}
                          </MenuItem>
                        )
                      )}
                  </Select>
                </FormControl>
              </Grid>

              {/* Bank Details */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Bank Account Number"
                  value={selectedUserData?.bankDetails?.accountNumber || ''}
                  onChange={e =>
                    setSelectedUserData(prev => ({
                      ...prev,
                      bankDetails: {
                        ...prev.bankDetails,
                        accountNumber: e.target.value,
                      },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="IFSC Code"
                  value={selectedUserData?.bankDetails?.ifscCode || ''}
                  onChange={e =>
                    setSelectedUserData(prev => ({
                      ...prev,
                      bankDetails: {
                        ...prev.bankDetails,
                        ifscCode: e.target.value,
                      },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Bank Name"
                  value={selectedUserData?.bankDetails?.bankName || ''}
                  onChange={e =>
                    setSelectedUserData(prev => ({
                      ...prev,
                      bankDetails: {
                        ...prev.bankDetails,
                        bankName: e.target.value,
                      },
                    }))
                  }
                />
              </Grid>

              {/* KYC Details */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Aadhaar Number"
                  value={selectedUserData?.kyc?.aadharNumber || ''}
                  onChange={e =>
                    setSelectedUserData(prev => ({
                      ...prev,
                      kyc: { ...prev.kyc, aadharNumber: e.target.value },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="contained" component="label" size="small">
                  Upload Aadhaar Front
                  <input type="file" hidden onChange={e => handleKYCFileChange(e, 'aadharFront')} />
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="contained" component="label" size="small">
                  Upload Aadhaar Back
                  <input type="file" hidden onChange={e => handleKYCFileChange(e, 'aadharBack')} />
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Aadhaar Front
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    p: 1,
                    backgroundColor: '#fafafa',
                  }}
                >
                  {aadharFrontPreview && (
                    <img
                      src={aadharFrontPreview}
                      alt="Aadhaar Front"
                      style={{ maxWidth: '100%', maxHeight: 160 }}
                    />
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Aadhaar Back
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    p: 1,
                    backgroundColor: '#fafafa',
                  }}
                >
                  {aadharBackPreview && (
                    <img
                      src={aadharBackPreview}
                      alt="Aadhaar Back"
                      style={{ maxWidth: '100%', maxHeight: 160 }}
                    />
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="GST Number"
                  value={selectedUserData?.kyc?.gstNumber || ''}
                  onChange={e =>
                    setSelectedUserData(prev => ({
                      ...prev,
                      kyc: { ...prev.kyc, gstNumber: e.target.value },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Firm Name"
                  value={selectedUserData?.kyc?.firmName || ''}
                  onChange={e =>
                    setSelectedUserData(prev => ({
                      ...prev,
                      kyc: { ...prev.kyc, firmName: e.target.value },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Firm Address"
                  value={selectedUserData?.kyc?.firmAddress || ''}
                  onChange={e =>
                    setSelectedUserData(prev => ({
                      ...prev,
                      kyc: { ...prev.kyc, firmAddress: e.target.value },
                    }))
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Close</Button>
            <Button variant="contained" color="primary" onClick={handleDialogSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

export default Jobs;

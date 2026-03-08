import React, { useContext, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  TablePagination,
  Typography,
  Box,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  MenuItem,
  Grid,
} from '@mui/material';
import axios from '../../utils/axiosConfig';
import { FaCheck } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { Edit as EditIcon } from '@mui/icons-material';
import { Context } from '../../main';
import toast from 'react-hot-toast';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = user?.role === 'Admin' ? {} : { postedBy: user?._id };
        const { data } = await axios.get(`${config.API_BASE_URL}/api/v1/job/getmyjobs`, {
          withCredentials: true,
          params,
        });
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to fetch jobs');
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user === undefined || user === null) return;
    if (!isAuthorized || (user && user.role !== 'Agent' && user.role !== 'SelfWorker')) {
      navigate('/landing');
    }
  }, [isAuthorized, user, navigate]);

  // 🔹 Format DOB → handle timestamps, strings, or small numbers
  const formatDOB = dob => {
    if (!dob) return '';
    if (typeof dob === 'number') {
      if (dob > 10000000000) {
        return new Date(dob).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      }
      return dob; // small numbers like 20, 40
    }
    const parsed = Date.parse(dob);
    if (!isNaN(parsed)) {
      return new Date(parsed).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
    return dob;
  };
  const getAge = dob => {
    if (dob == null || dob === '') return '';

    const timestamp = Number(dob);
    if (isNaN(timestamp)) return '';

    // If dob is just a small number (like 2–5 digits), assume it's already an age or year
    if (dob.toString().length <= 5) {
      // If it's clearly a year (e.g., 1999)
      if (timestamp > 1900 && timestamp <= new Date().getFullYear()) {
        return new Date().getFullYear() - timestamp;
      }
      // If it's a direct age (e.g., 25)
      return timestamp;
    }

    // Convert seconds → milliseconds if needed
    let finalTimestamp = timestamp;
    if (timestamp < 10000000000) {
      // seconds (10 digits or less)
      finalTimestamp *= 1000;
    }

    const birthDate = new Date(finalTimestamp);
    if (isNaN(birthDate.getTime())) return '';

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleEdit = job => setEditingJob(job);
  const handleCloseDialog = () => setEditingJob(null);

  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        `${config.API_BASE_URL}/api/v1/job/update/${editingJob._id}`,
        editingJob,
        { withCredentials: true }
      );
      toast.success(data.message);
      setEditingJob(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update job');
    }
  };

  const handleChange = (field, value) => {
    setEditingJob(prev => ({ ...prev, [field]: value }));
  };

  const filteredJobs = myJobs.filter(
    job => (job?.name?.toLowerCase() || '').includes(search) || (job?.phone || '').includes(search) || (job?.district?.toLowerCase() || '').includes(search)
  );

  const paginatedJobs = filteredJobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Box 
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                       pt: 2,
                                       pl: 2,
                                       pr: 2,
                                          mx: "auto"
                                      }}
                                    >
                                      <Box
                                         onClick={() => navigateTo(-1)}
                                        sx={{
                                          width: 36,
                                          height: 36,
                                          borderRadius: "50%",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          cursor: "pointer",
                                          transition: "background-color 0.2s ease",
                                          "&:hover": { backgroundColor: "#f1f1f1" },
                                        }}
                                      >
                                        <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                                      </Box>
                                   <Box>
                        <Typography fontSize={16} fontWeight={700}>
                          {t('MyRegisteredWorkers')}
                        </Typography>
                      
                        <Typography fontSize={12} color="text.secondary">
                          {t('MyRegisteredWorkers')}
                        </Typography>
                      </Box>
                      
                                    </Box>
    <Box sx={{ p: 1, mt: '15px' }}>
     
      <Paper elevation={3} sx={{ p: 1 }}>
        <Typography
          variant="h5"
          textAlign="center"
          color="primary"
          sx={{ fontWeight: 600, background: '#f4f5f8', p: 1 }}
        >
          {t('MyRegisteredWorkers')}
        </Typography>

        <TextField
          label={t('SearchByNamePhoneCity')}
          variant="outlined"
          fullWidth
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value.toLowerCase())}
          sx={{ mb: 2 }}
        />

        {/* 🔹 Compact Android-style Table */}
        <TableContainer component={Paper} sx={{ minWidth: 250 }}>
          <Table size="small" sx={{ backgroundColor: '#f9f9f9' }}>
            <TableHead>
              <TableRow>
                {[t('Name'), t('Phone'), t('DOB'), t('Action')].map(h => (
                  <TableCell
                    key={h}
                    sx={{
                      backgroundColor: 'rgb(248, 249, 250)',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map(job => (
                  <TableRow key={job._id} hover>
                    <TableCell>{job.name}</TableCell>
                    <TableCell>{job.phone}</TableCell>
                    <TableCell>{getAge(job.dob)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(job)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      {t('NoWorkersAdded')}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => navigate('/job/post')}
                    >
                      {t('ClickHereToAdd')}
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
              mb: 1,
              px: 1,
            }}
          >
            <Button
              size="small"
              variant="outlined"
              disabled={page === 0}
              onClick={() => setPage(prev => Math.max(prev - 1, 0))}
            >
              {t('Previous')}
            </Button>

            <Typography variant="body2">
              {t('Page')} {page + 1} {t('of')} {Math.ceil(filteredJobs.length / rowsPerPage)}
            </Typography>

            <Button
              size="small"
              variant="outlined"
              disabled={page >= Math.ceil(filteredJobs.length / rowsPerPage) - 1}
              onClick={() =>
                setPage(prev =>
                  Math.min(prev + 1, Math.ceil(filteredJobs.length / rowsPerPage) - 1)
                )
              }
            >
              {t('Next')}
            </Button>
          </Box>
        </TableContainer>
      </Paper>

      {/* 🔹 Popup Dialog for Full Details */}
      <Dialog
        open={!!editingJob}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            background: '#fafafa',
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
          {t('Worker Details')}
        </DialogTitle>
        <DialogContent dividers sx={{p: 0}}>
          {editingJob && (
            <>
              <TextField
                label={t('Name')}
                fullWidth
                sx={{ mt: 1 }}
                size="small"
                value={editingJob.name || ''}
                onChange={e => handleChange('name', e.target.value)}
              />
              <TextField
                label={t('Phone')}
                fullWidth
                sx={{ mt: 1 }}
                size="small"
                value={editingJob.phone || ''}
                onChange={e => handleChange('phone', e.target.value)}
              />
              <TextField
                label={t('Address')}
                fullWidth
                sx={{ mt: 1 }}
                size="small"
                value={editingJob.address || ''}
                onChange={e => handleChange('address', e.target.value)}
              />
              <TextField
                label={t('District')}
                fullWidth
                sx={{ mt: 1 }}
                size="small"
                value={editingJob.district || ''}
                onChange={e => handleChange('district', e.target.value)}
                disabled={editingJob.status === 'Verified'}
              />
              <TextField
                label={t('DOB')}
                fullWidth
                sx={{ mt: 1 }}
                size="small"
                value={formatDOB(editingJob.dob)}
                // InputProps={{ readOnly: true }}
                  disabled={editingJob.status === 'Verified'}

              />
       {/* 🔹 Bank Information Section */}
{editingJob.status === 'Verified' && (
  <Alert severity="info" sx={{ mt: 2 }}>
    Bank details cannot be edited once the profile is verified.
  </Alert>
)}

<TextField
  label={t('Bank Name')}
  fullWidth
  sx={{ mt: 1 }}
  size="small"
  value={editingJob.bankDetails?.bankName || ''}
  onChange={e =>
    handleChange('bankDetails', {
      ...editingJob.bankDetails,
      bankName: e.target.value,
    })
  }
  disabled={editingJob.status === 'Verified'}
/>

<TextField
  label={t('Account Number')}
  fullWidth
  sx={{ mt: 1 }}
  size="small"
  value={editingJob.bankDetails?.accountNumber || ''}
  onChange={e =>
    handleChange('bankDetails', {
      ...editingJob.bankDetails,
      accountNumber: e.target.value,
    })
  }
  disabled={editingJob.status === 'Verified'}
/>
{/* 🔹 Gender */}
<FormControl
  sx={{ mt: 1 }}
  disabled={editingJob.status === 'Verified'}
>
  <RadioGroup
    row
    value={editingJob.gender || ''}
    onChange={(e) => handleChange('gender', e.target.value)}
  >
    <FormControlLabel value="Male" control={<Radio size="small" />} label={t('Male')} />
    <FormControlLabel value="Female" control={<Radio size="small" />} label={t('Female')} />
    <FormControlLabel value="Other" control={<Radio size="small" />} label={t('Other')} />
  </RadioGroup>
</FormControl>

{/* 🔹 Work Experience */}
<TextField
  select
  label={t('Work Experience (Years)')}
  fullWidth
  sx={{ mt: 1 }}
  size="small"
  value={editingJob.workExperience ?? 0}
  onChange={(e) => handleChange('workExperience', e.target.value)}
  disabled={editingJob.status === 'Verified'}
>
  {Array.from({ length: 36 }, (_, i) => (
    <MenuItem key={i} value={i}>
      {i} {i === 1 ? 'Year' : 'Years'}
    </MenuItem>
  ))}
</TextField>

{/* 🔹 Wages Type */}
<TextField
  select
  label={t('Wages Type')}
  fullWidth
  sx={{ mt: 1 }}
  size="small"
  value={editingJob.salaryType || ''}
  onChange={(e) => handleChange('salaryType', e.target.value)}
  disabled={editingJob.status === 'Verified'}
>
  <MenuItem value="Fixed">{t('Fixed')}</MenuItem>
  <MenuItem value="Ranged">{t('Ranged')}</MenuItem>
</TextField>

{/* 🔹 Fixed Wage */}
{editingJob.salaryType === 'Fixed' && (
  <TextField
    label={t('Fixed Wage Amount')}
    fullWidth
    sx={{ mt: 1 }}
    size="small"
    type="number"
    value={editingJob.fixedSalary || ''}
    onChange={(e) => handleChange('fixedSalary', e.target.value)}
    disabled={editingJob.status === 'Verified'}
  />
)}

{/* 🔹 Ranged Wage */}
{editingJob.salaryType === 'Ranged' && (
  <Grid container spacing={1} sx={{ mt: 0.5 }}>
    <Grid item xs={6}>
      <TextField
        label={t('Min Wage')}
        fullWidth
        size="small"
        type="number"
        value={editingJob.salaryFrom || ''}
        onChange={(e) =>
          handleChange('salaryFrom', e.target.value)
        }
        disabled={editingJob.status === 'Verified'}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        label={t('Max Wage')}
        fullWidth
        size="small"
        type="number"
        value={editingJob.salaryTo || ''}
        onChange={(e) =>
          handleChange('salaryTo', e.target.value)
        }
        disabled={editingJob.status === 'Verified'}
      />
    </Grid>
  </Grid>
)}

<TextField
  label={t('IFSC Code')}
  fullWidth
  sx={{ mt: 1 }}
  size="small"
  value={editingJob.bankDetails?.ifscCode || ''}
  onChange={e =>
    handleChange('bankDetails', {
      ...editingJob.bankDetails,
      ifscCode: e.target.value,
    })
  }
  disabled={editingJob.status === 'Verified'}
/>



              <Alert
                severity={editingJob.status === 'Verified' ? 'success' : 'error'}
                sx={{ mt: 2 }}
              >
                {editingJob.status}
              </Alert>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Button onClick={handleCloseDialog} color="error" variant="outlined">
            {t('Cancel')}
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {t('Save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
};

export default MyJobs;

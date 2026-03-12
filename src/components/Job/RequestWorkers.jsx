// File: frontend/src/components/Job/RequestWorkers.jsx
import { useContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

import 'leaflet/dist/leaflet.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import L from 'leaflet';

import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  InputAdornment,
  FormHelperText,
  CircularProgress,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
} from '@mui/material';
import category from '../../categories.json';
import contract from '../../contract.json';

import stateDistrictTehsil from '../../stateDistrict';
import { Context } from '../../main';
import axios from '../../utils/axiosConfig';
import config from '../../config';
import toast from 'react-hot-toast';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'react-i18next';
import GoogleMapPicker from './googleMapApiPicker';

const today = new Date().toISOString().split('T')[0];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const RequestWorkerForm = ({ typeOfReq, handleRequirementClose, setSubscriptionOpen }) => {
  const { user } = useContext(Context);
  const { t, i18n } = useTranslation();
  const FORM_STORAGE_KEY = 'savedRequirementFormData';
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const categories = typeOfReq === 'Office_Staff' ? contract : category;
  const androidTheme = createTheme({
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'filled',
          size: 'small',
        },
        styleOverrides: {
          root: {
            backgroundColor: '#f5f5f5',
            borderRadius: 6,
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            backgroundColor: '#f5f5f5',
            borderRadius: 6,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
          input: {
            padding: '10px 12px',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          filled: {
            backgroundColor: '#f5f5f5',
            borderRadius: 6,
          },
        },
      },
    },
  });
  const [formData, setFormData] = useState({
    workType: '',
    subCategory: '',
    workerQuantityUnskilled: 0,
    workerQuantitySkilled: '',
    ageGroup: '',
    workLocation: '',
    latitude: null,
    longitude: null,
    workerNeedDate: '',
    inTime: null,
    outTime: null,
    remarks: '',
    state: '',
    district: '',
    tehsil: '',
    minBudgetPerWorker: '',
    maxBudgetPerWorker: '',
    employerId: user._id,
    employerName: user.name,
    employerPhone: user.phone,
    req_type: typeOfReq,
    estimated_days: '',
  });

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      'workType',
      'subCategory',
      'workerQuantitySkilled',
      'workerNeedDate',
      'state',
      'district',
      'minBudgetPerWorker',
      'maxBudgetPerWorker',
      'workLocation',
      'remarks',
    ];

    requiredFields.forEach(field => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleStateChange = e => {
    setFormData({
      ...formData,
      state: e.target.value,
      district: '',
      tehsil: '',
    });
    setErrors(prev => ({ ...prev, state: '', district: '' }));
  };

  const handleDistrictChange = e => {
    setFormData({ ...formData, district: e.target.value, tehsil: '' });
    setErrors(prev => ({ ...prev, district: '' }));
  };

  const handleTehsilChange = e => {
    setFormData({ ...formData, tehsil: e.target.value });
    setErrors(prev => ({ ...prev, tehsil: '' }));
  };

  const handleTimeChange = name => value => {
    if (name === 'inTime') setInTime(value);
    else setOutTime(value);

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleWorkTypeChange = e => {
    setFormData(prev => ({
      ...prev,
      workType: e.target.value,
      subCategory: '',
    }));
    setErrors(prev => ({ ...prev, workType: '', subCategory: '' }));
  };

  const handleSubCategoryChange = e => {
    setFormData(prev => ({ ...prev, subCategory: e.target.value }));
    setErrors(prev => ({ ...prev, subCategory: '' }));
  };

  const handleOpenMap = () => setMapOpen(true);
  const handleCloseMap = () => setMapOpen(false);
  const [locationName, setLocationName] = useState('');

  const handleLocationSelect = async location => {
    setSelectedLocation(location);
    setFormData(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }));
    setErrors(prev => ({ ...prev, workLocation: '' }));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setLocationName(data?.display_name);
        setFormData(prev => ({
          ...prev,
          workLocation: data?.display_name,
        }));
      } else {
        setLocationName('Unknown location');
      }
    } catch (error) {
      console.error('Reverse geocoding failed', error);
      setLocationName('Location unavailable');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (user?.role === 'Employer' && !user?.isSubscribed) {
      // Save form data to localStorage before redirect/popup
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
      setSubscriptionOpen(true);
      return;
    }

    if (loading) return;

    setLoading(true);

    const dataToSubmit = {
      ...formData,
      inTime: inTime ? inTime.toISOString() : null,
      outTime: outTime ? outTime.toISOString() : null,
      latitude: selectedLocation?.lat || null,
      longitude: selectedLocation?.lng || null,
    };

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/v1/application/insert`,
        dataToSubmit,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Requirement posted successfully!');
        setLoading(false);
        localStorage.removeItem(FORM_STORAGE_KEY); // Clear after success
        handleRequirementClose();
      } else {
        setLoading(false);
        toast.error(response.data?.message || 'Failed to post requirement.');
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  useEffect(() => {
    const savedForm = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedForm) {
      setFormData(JSON.parse(savedForm));
    }
  }, []);

  const selectedCategory = categories.find(cat => cat.value === formData.workType);

return (
  <Paper
    sx={{
      width: "100%",
      maxWidth: 980,
      mx: "auto",
      borderRadius: { xs: 0, md: 4 },
      overflow: "hidden",
      background:
        "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)",
      border: { xs: "none", md: "1px solid #e5e7eb" },
      boxShadow: {
        xs: "none",
        md: "0 20px 50px rgba(15, 23, 42, 0.10)",
      },
    }}
  >
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
        color: "#fff",
        px: { xs: 2, sm: 3 },
        py: 1.5,
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "#fff !important",
            lineHeight: 1.2,
            fontSize: { xs: "1rem", sm: "1.15rem" },
          }}
        >
          {t("title")}
        </Typography>
        <Typography
          sx={{
            mt: 0.3,
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Fill in the details below to submit your requirement
        </Typography>
      </Box>

      <Button
        onClick={handleRequirementClose}
        size="small"
        variant="outlined"
        sx={{
          minWidth: "auto",
          px: 2,
          py: 0.8,
          borderRadius: "10px",
          color: "#fff",
          borderColor: "rgba(255,255,255,0.75)",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": {
            borderColor: "#fff",
            backgroundColor: "rgba(255,255,255,0.08)",
          },
        }}
      >
        {t("close")}
      </Button>
    </Box>

    <Box
      sx={{
        overflowY: "auto",
        maxHeight: "calc(90vh - 74px)",
        px: { xs: 1.5, sm: 2.5, md: 3 },
        py: { xs: 2, sm: 2.5 },
        background:
          "radial-gradient(circle at top right, rgba(25,118,210,0.05), transparent 32%)",
      }}
    >
      <Box
        sx={{
          mb: 2.5,
          p: { xs: 1.75, sm: 2 },
          borderRadius: 3,
          bgcolor: "#f8fbff",
          border: "1px solid #dbeafe",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.92rem",
            fontWeight: 700,
            color: "#1976d2",
            mb: 0.5,
          }}
        >
          Requirement Details
        </Typography>
        <Typography
          sx={{
            fontSize: "0.84rem",
            color: "#475467",
            lineHeight: 1.7,
          }}
        >
          Please enter complete job details so workers or suppliers can understand your requirement clearly.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2.2}>
          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              error={!!errors.workType}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "#fff",
                },
              }}
            >
              <InputLabel>{t("workType")}</InputLabel>
              <Select
                MenuProps={{ disablePortal: true }}
                value={formData.workType}
                size="small"
                onChange={handleWorkTypeChange}
                label={t("workType")}
              >
                {categories.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {i18n.language === "hi"
                      ? cat.hindilabel
                      : i18n.language === "mr"
                        ? cat.marathilabel
                        : i18n.language === "gu"
                          ? cat.gujaratilabel
                          : cat.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.workType && <FormHelperText>{errors.workType}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              error={!!errors.subCategory}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "#fff",
                },
              }}
            >
              <InputLabel>{t("subCategory")}</InputLabel>
              <Select
                MenuProps={{ disablePortal: true }}
                value={formData.subCategory}
                onChange={handleSubCategoryChange}
                label={t("subCategory")}
                size="small"
              >
                {selectedCategory?.subcategories?.map(sub => (
                  <MenuItem key={sub.value} value={sub.value}>
                    {i18n.language === "hi"
                      ? sub.hindilabel
                      : i18n.language === "mr"
                        ? sub.marathilabel
                        : sub.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.subCategory && <FormHelperText>{errors.subCategory}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="workerNeedDate"
              label={t("workDate")}
              type="date"
              size="small"
              fullWidth
              value={formData.workerNeedDate}
              onChange={handleChange}
              onFocus={() => setTimeout(() => setIsFocused(true), 0)}
              onBlur={() => setIsFocused(false)}
              InputLabelProps={{
                shrink: isFocused || !!formData.workerNeedDate,
              }}
              inputProps={{ min: today }}
              error={!!errors.workerNeedDate}
              helperText={errors.workerNeedDate}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="workerQuantitySkilled"
              label={t("workerCount")}
              type="number"
              size="small"
              fullWidth
              value={formData.workerQuantitySkilled}
              onChange={handleChange}
              error={!!errors.workerQuantitySkilled}
              helperText={errors.workerQuantitySkilled}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              error={!!errors.state}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "#fff",
                },
              }}
            >
              <InputLabel>{t("state")}</InputLabel>
              <Select
                value={formData.state}
                onChange={handleStateChange}
                label={t("state")}
                size="small"
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">{t("selectState")}</MenuItem>
                {Object.keys(stateDistrictTehsil).map(state => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
              {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              disabled={!formData.state}
              error={!!errors.district}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "#fff",
                },
              }}
            >
              <InputLabel>{t("district")}</InputLabel>
              <Select
                value={formData.district}
                onChange={handleDistrictChange}
                label={t("district")}
                size="small"
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">{t("selectDistrict")}</MenuItem>
                {formData.state &&
                  Object.keys(stateDistrictTehsil[formData.state] || {}).map(districtName => (
                    <MenuItem key={districtName} value={districtName}>
                      {districtName}
                    </MenuItem>
                  ))}
              </Select>
              {errors.district && <FormHelperText>{errors.district}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              disabled={!formData.district}
              error={!!errors.tehsil}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "#fff",
                },
              }}
            >
              <InputLabel>{t("tehsil")}</InputLabel>
              <Select
                value={formData.tehsil}
                onChange={handleTehsilChange}
                label={t("tehsil")}
                size="small"
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">{t("selectTehsil")}</MenuItem>
                {formData.state &&
                  formData.district &&
                  (stateDistrictTehsil[formData.state]?.[formData.district] || []).map(
                    tehsilName => (
                      <MenuItem key={tehsilName} value={tehsilName}>
                        {tehsilName}
                      </MenuItem>
                    )
                  )}
              </Select>
              {errors.tehsil && <FormHelperText>{errors.tehsil}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label={t("estimated_days")}
              variant="outlined"
              type="number"
              size="small"
              fullWidth
              value={formData.estimated_days || ""}
              onChange={e => setFormData({ ...formData, estimated_days: e.target.value })}
              error={!!errors.estimated_days}
              helperText={errors.estimated_days}
              inputProps={{ min: 1 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#ffffff",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#344054",
                  mb: 1.5,
                }}
              >
                {t("locality")}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2, flexDirection: { xs: "column", sm: "row" } }}>
                <TextField
                  name="workLocation"
                  label={t("locality")}
                  fullWidth
                  size="small"
                  value={locationName ? locationName : formData.workLocation}
                  onChange={handleChange}
                  error={!!errors.workLocation}
                  helperText={errors.workLocation}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      backgroundColor: "#fff",
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleOpenMap}
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", sm: 110 },
                    height: 40,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                  startIcon={<LocationOnIcon />}
                >
                  Map
                </Button>
              </Box>

              {locationName && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    mt: 1.2,
                    px: 1.2,
                    py: 0.9,
                    borderRadius: 2,
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  📍 {locationName}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                bgcolor: "#f8fbff",
                border: "1px solid #dbeafe",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#1976d2",
                  mb: 1.6,
                }}
              >
                Budget Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="minBudgetPerWorker"
                    label={
                      typeOfReq === "Daily_Wages" || typeOfReq === "Supply_based"
                        ? t("minBudget")
                        : typeOfReq === "Office_Staff"
                          ? t("minContractPM")
                          : t("minBudgetContract")
                    }
                    type="number"
                    fullWidth
                    size="small"
                    value={formData.minBudgetPerWorker}
                    onChange={handleChange}
                    error={!!errors.minBudgetPerWorker}
                    helperText={errors.minBudgetPerWorker}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        backgroundColor: "#fff",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="maxBudgetPerWorker"
                    label={
                      typeOfReq === "Daily_Wages" || typeOfReq === "Supply_based"
                        ? t("maxBudget")
                        : typeOfReq === "Office_Staff"
                          ? t("maxContractPM")
                          : t("maxBudgetContract")
                    }
                    type="number"
                    size="small"
                    fullWidth
                    value={formData.maxBudgetPerWorker}
                    onChange={handleChange}
                    error={!!errors.maxBudgetPerWorker}
                    helperText={errors.maxBudgetPerWorker}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        backgroundColor: "#fff",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {typeOfReq === "Daily_Wages" && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label={t("inTime")}
                  value={inTime}
                  onChange={handleTimeChange("inTime")}
                  ampm
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      sx: {
                        "& .MuiInputBase-root": {
                          height: 40,
                          borderRadius: "14px",
                          backgroundColor: "#fff",
                        },
                        "& .MuiInputBase-input": {
                          padding: "8px 14px",
                        },
                        "& .MuiPickersOutlinedInput-sectionsContainer": {
                          padding: "0 !important",
                          minHeight: "unset",
                          height: "100%",
                        },
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TimePicker
                  label={t("outTime")}
                  value={outTime}
                  onChange={handleTimeChange("outTime")}
                  ampm
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      sx: {
                        "& .MuiInputBase-root": {
                          height: 40,
                          borderRadius: "14px",
                          backgroundColor: "#fff",
                        },
                        "& .MuiInputBase-input": {
                          padding: "8px 14px",
                        },
                        "& .MuiPickersOutlinedInput-sectionsContainer": {
                          padding: "0 !important",
                          minHeight: "unset",
                          height: "100%",
                        },
                      },
                    },
                  }}
                />
              </Grid>
            </LocalizationProvider>
          )}

          <Grid item xs={12}>
           <TextField
  name="remarks"
  label={typeOfReq === "officeStaff" ? t("jobDescription") : t("description")}
  size="small"
  placeholder={
    typeOfReq === "Daily_Wages" || typeOfReq === "Supply_based"
      ? t("descriptionPlaceholder")
      : t("jobdescription")
  }
  fullWidth
  rows={1}
  multiline
  value={formData.remarks}
  onChange={(e) => {
    const value = e.target.value;
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

    setFormData((prev) => ({
      ...prev,
      remarks: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      remarks: wordCount < 10 ? "Minimum 10 words required" : "",
    }));
  }}
  error={!!formErrors.remarks}
  helperText={
    formErrors.remarks ||
    `${formData.remarks?.trim().split(/\s+/).filter(Boolean).length || 0} / 10 words`
  }
  sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      backgroundColor: "#fff",
      minHeight: "40px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "8px 12px",
    },
  }}
/>
          </Grid>

          {typeOfReq !== "Daily_Wages" && (
            <Grid item xs={12}>
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 3,
                  bgcolor: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              >
                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      fontSize: "1rem",
                      color: "#101828",
                    }}
                  >
                    {t("facilitiesAndBenefits")}
                  </FormLabel>

                  <Grid container spacing={1.5}>
                    {[
                      { key: "accommodationAvailable", label: t("accommodationAvailable") },
                      { key: "foodAvailable", label: t("foodAvailable") },
                      { key: "incentive", label: t("incentive") },
                      { key: "bonus", label: t("bonus") },
                      { key: "transportProvided", label: t("transportProvided") },
                      { key: "weeklyOff", label: t("weeklyOff") },
                      { key: "overtimeAvailable", label: t("overtimeAvailable") },
                      { key: "insuranceAvailable", label: t("insuranceAvailable") },
                      { key: "pfAvailable", label: t("pfAvailable") },
                      { key: "esicAvailable", label: t("esicAvailable") },
                    ].map(item => (
                      <Grid item xs={12} sm={6} key={item.key}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            py: 1.1,
                            px: 1.4,
                            borderRadius: 2.5,
                            border: "1px solid",
                            borderColor: formData[item.key] ? "#bfdbfe" : "#e5e7eb",
                            bgcolor: formData[item.key] ? "#eff6ff" : "#f9fafb",
                            transition: "all 0.25s ease",
                            "&:hover": {
                              borderColor: "#93c5fd",
                              bgcolor: "#f8fbff",
                            },
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, fontSize: "0.92rem", pr: 1 }}>
                            {item.label}
                          </Typography>
                          <Switch
                            checked={formData[item.key] || false}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                [item.key]: e.target.checked,
                              }))
                            }
                            color="primary"
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </FormControl>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                pt: 1,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 25%, rgba(255,255,255,1) 100%)",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                size="large"
                sx={{
                  borderRadius: 3,
                  py: 1.35,
                  fontWeight: 800,
                  fontSize: "0.98rem",
                  textTransform: "none",
                  boxShadow: "0 10px 24px rgba(25,118,210,0.24)",
                }}
              >
                {t("submit")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>

    <GoogleMapPicker
      open={mapOpen}
      onClose={handleCloseMap}
      onLocationSelect={handleLocationSelect}
      initialLocation={formData?.workLocation}
    />
  </Paper>
);
};

export default RequestWorkerForm;

import React, { useContext, useState } from "react";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { Context } from "../../main";
import categories from "../../categories.json";
import config from "../../config";
import { MdCameraAlt } from "react-icons/md";
import stateDistrict from "../../stateDistrict";
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from 'react-router-dom';

import {
  ListItemText,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  FormGroup,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Card,
  CardContent,
  RadioGroup,
  Radio,
} from "@mui/material";

const PostJob = () => {
  const { t, i18n } = useTranslation();
  const [name, setWorkerName] = useState("");
  const [areasOfWork, setAreasOfWork] = useState([]);
  const [workExperience, setWorkExperience] = useState({});
  const [salaryFrom, setSalaryFrom] = useState("");
  const [gender, setGender] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [description, setDescription] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [state, setState] = useState("");
  const [district, setCity] = useState("");
  const [errors, setErrors] = useState({});
  const [tehsil, setTehsil] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(value);
    setAreasOfWork(value);
  };

  const handleTehsilChange = (e) => setTehsil(e.target.value);

  // const filteredCategories = categories.filter(area =>
  //   area.label.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) =>
        prev.filter((category) => category !== value),
      );
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Worker name is required";
    if (!gender) newErrors.gender = "Gender is required";

    if (!dob) newErrors.dob = "Age is required";
    if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!state) newErrors.state = "State is required";
    if (!district) newErrors.district = "City is required";
    // if (!address.trim()) newErrors.address = 'Address is required';
    if (selectedCategories.length === 0)
      newErrors.categories = "Select at least one work type";
    if (salaryType === "Fixed" && !fixedSalary)
      newErrors.fixedSalary = "Enter fixed wage";
    if (salaryType === "Ranged" && (!salaryFrom || !salaryTo)) {
      if (!salaryFrom) newErrors.salaryFrom = "Enter wage from";
      if (!salaryTo) newErrors.salaryTo = "Enter wage to";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const allSubCategories = categories.flatMap((main) =>
    main.subcategories.map((sub) => ({
      ...sub,
      parent: main.label, // optional, if you ever need parent name
    })),
  );
  const filteredCategories = allSubCategories.filter(
    (area) =>
      area.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.hindilabel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.marathilabel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.gujaratilabel?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleJobPost = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true); // Start submitting

    const formData = new FormData();
    formData.append("name", name);
    formData.append("areasOfWork", JSON.stringify(areasOfWork));
    formData.append("workExperience", JSON.stringify(workExperience));
    formData.append("salaryFrom", salaryFrom);
    formData.append("salaryTo", salaryTo);
    formData.append("salaryType", salaryType);
    formData.append("gender", gender);
    formData.append("fixedSalary", fixedSalary);
    formData.append("description", description);
    formData.append("dob", dob);
    formData.append("phone", mobile);
    formData.append("ifscCode", ifscCode);
    formData.append("bankAccount", bankAccount);
    formData.append("state", state);
    formData.append("block", tehsil);
    formData.append("district", district);
    formData.append("address", address);
    formData.append("role", "Worker");
    formData.append("password", mobile);
    formData.append("bankName", bankName);

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/api/v1/job/post`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(res.data.message);

      // Reset form
      setWorkerName("");
      setAreasOfWork([]);
      setWorkExperience({});
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
      setSalaryType("default");
      setDescription("");
      setDob("");
      setMobile("");
      setIfscCode("");
      setBankAccount("");
      setGender("");
      setAddress("");
      setImage(null);
      setImagePreview(null);
      setSelectedCategories([]);
      setSearchQuery("");
      setState("");
      setCity("");
      setTehsil("");
      setBankName("");
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Error posting job.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000); // Disable for 5 seconds
    }
  };

  if (!isAuthorized && !user) return <Navigate to="/login" />;

return (
  <>
    {/* Header */}
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(245,247,251,0.92)",
        backdropFilter: "blur(10px)",
        border: "1px solid #e8edf5",
        borderRadius: 3,
        px: 2,
        py: 1.2,
        mb: 3,
        mx: 1,
        mt: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          onClick={() => navigateTo(-1)}
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "#f8fafc" },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#1f2937" }} />
        </Box>

        <Box>
          <Typography fontSize={17} fontWeight={800} color="#1f2a44">
            {t("WorkerRRegistration")}
          </Typography>

          <Typography fontSize={12} color="#6b7280">
            {t("WorkerRRegistration")}
          </Typography>
        </Box>
      </Box>
    </Box>

    {/* Form Wrapper */}
    <Box
      sx={{
        maxWidth: "820px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        mb: 4,
        px: { xs: 1, sm: 1.5 },
        "&::before": {
          content: '"BookMyWorker"',
          position: "absolute",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: { xs: "2.2rem", md: "4.8rem" },
          fontWeight: 800,
          color: "rgba(37, 99, 235, 0.04)",
          zIndex: 0,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        },
      }}
    >
      <Card
        sx={{
          position: "relative",
          zIndex: 1,
          mb: 3,
          px: { xs: 1, sm: 1.5, md: 2 },
          py: 1.5,
          bgcolor: "#ffffff",
          border: "1px solid #e8edf5",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            mb: 2.2,
            mt: 0.5,
            py: 1.2,
            borderRadius: 3,
            background: "linear-gradient(180deg, #f8fbff 0%, #f2f6fc 100%)",
            border: "1px solid #edf2f7",
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.1rem", md: "1.4rem" },
            }}
          >
            {t("WorkerRRegistration")}
          </Typography>
        </Box>

        <form onSubmit={handleJobPost}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={`${t("WorkerName")} *`}
                fullWidth
                size="small"
                value={name}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(input)) {
                    setWorkerName(input);
                  }
                }}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={`${t("DateOfBirth")} *`}
                type="number"
                fullWidth
                size="small"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                error={!!errors.dob}
                helperText={errors.dob}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={`${t("MobileNumber")} *`}
                fullWidth
                type="tel"
                value={mobile}
                size="small"
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input) && input.length <= 10) {
                    setMobile(input);
                  }
                }}
                onBlur={() => {
                  if (mobile.length !== 10) {
                    setErrors((prev) => ({
                      ...prev,
                      mobile: "Mobile number must be 10 digits",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, mobile: "" }));
                  }
                }}
                error={!!errors.mobile}
                helperText={errors.mobile}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.state}>
                <InputLabel>{t("State")} *</InputLabel>
                <Select
                  size="small"
                  MenuProps={{ disablePortal: true }}
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity("");
                    setTehsil("");
                  }}
                  label={`${t("State")} *`}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  }}
                >
                  {Object.keys(stateDistrict).map((stateName) => (
                    <MenuItem key={stateName} value={stateName}>
                      {stateName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {errors.state}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!state} error={!!errors.district}>
                <InputLabel>{t("City")} *</InputLabel>
                <Select
                  size="small"
                  MenuProps={{ disablePortal: true }}
                  value={district}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setTehsil("");
                  }}
                  label={`${t("City")} *`}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  }}
                >
                  {state &&
                    Object.keys(stateDistrict[state] || {}).map((districtName) => (
                      <MenuItem key={districtName} value={districtName}>
                        {districtName}
                      </MenuItem>
                    ))}
                </Select>
                {errors.district && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {errors.district}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!district} error={!!errors.tehsil}>
                <InputLabel id="tehsil-label">{t("BlockTehsil")} *</InputLabel>
                <Select
                  size="small"
                  labelId="tehsil-label"
                  value={tehsil}
                  onChange={(e) => handleTehsilChange(e)}
                  required
                  label={`${t("BlockTehsil")} *`}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  }}
                >
                  <MenuItem value="">Select Block/Tehsil</MenuItem>
                  {state &&
                    district &&
                    (stateDistrict[state]?.[district] || []).map((tehsilName) => (
                      <MenuItem key={tehsilName} value={tehsilName}>
                        {tehsilName}
                      </MenuItem>
                    ))}
                </Select>
                {errors.tehsil && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {errors.tehsil}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={`${t("address")} *`}
                fullWidth
                size="small"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                helperText={errors.address}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label={`${t("workexperience")} *`}
                fullWidth
                size="small"
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                error={!!errors.workExperience}
                helperText={errors.workExperience}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  },
                }}
              >
                {Array.from({ length: 36 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    {i} {i === 1 ? "Year" : "Years"}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.categories}>
                <InputLabel id="work-type-label">{t("WorkType")} *</InputLabel>
                <Select
                  size="small"
                  labelId="work-type-label"
                  label={`${t("workType")} *`}
                  multiple
                  value={selectedCategories}
                  onChange={handleChange}
                  renderValue={(selected) =>
                    selected.length === 0 ? "Select Areas" : selected.join(", ")
                  }
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  }}
                >
                  <Box sx={{ padding: 1 }}>
                    <TextField
                      label={`${t("InterestOfWork")} *`}
                      fullWidth
                      size="small"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </Box>

                  {filteredCategories.map((area) => (
                    <MenuItem
                      key={area.value}
                      value={area.value}
                      sx={{ paddingY: 0.5 }}
                    >
                      <Checkbox
                        checked={selectedCategories.includes(area.value)}
                        onChange={(e) => handleCheckboxChange(e, area.value)}
                      />

                      <ListItemText
                        primary={
                          i18n.language === "hi"
                            ? area.hindilabel
                            : i18n.language === "mr"
                              ? area.marathilabel
                              : i18n.language === "gu"
                                ? area.gujaratilabel
                                : area.label
                        }
                        secondary={area.parent}
                      />
                    </MenuItem>
                  ))}
                </Select>

                {errors.categories && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {errors.categories}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t("WagesType")} *</InputLabel>
                <Select
                  size="small"
                  MenuProps={{ disablePortal: true }}
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                  label={`${t("WagesType")} *`}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  }}
                >
                  <MenuItem value="Fixed">{t("salaryFixedPerDay")}</MenuItem>
                  <MenuItem value="Ranged">{t("salaryRangedPerday")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl error={!!errors.gender}>
                <RadioGroup
                  row
                  aria-labelledby="gender-label"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setErrors((prev) => ({ ...prev, gender: "" }));
                  }}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio size="small" />}
                    label={t("male")}
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio size="small" />}
                    label={t("female")}
                  />
                  <FormControlLabel
                    value="Other"
                    control={<Radio size="small" />}
                    label={t("other")}
                  />
                </RadioGroup>

                {errors.gender && (
                  <Typography color="error" variant="caption">
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {salaryType === "Fixed" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("salaryFixedPerDay")}
                  type="number"
                  size="small"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                  fullWidth
                  error={!!errors.fixedSalary}
                  helperText={errors.fixedSalary}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#fafbff",
                    },
                  }}
                />
              </Grid>
            )}

            {salaryType === "Ranged" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t("WageFrom")}
                    type="number"
                    size="small"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                    fullWidth
                    error={!!errors.salaryFrom}
                    helperText={errors.salaryFrom}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "#fafbff",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t("WageTo")}
                    type="number"
                    size="small"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                    fullWidth
                    error={!!errors.salaryTo}
                    helperText={errors.salaryTo}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "#fafbff",
                      },
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                label={`${t("AboutWorker")} *`}
                fullWidth
                size="small"
                multiline
                minRows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  },
                }}
              />
            </Grid>

            {/* Bank Details Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 1,
                  mb: 0.5,
                  px: 1.2,
                  py: 1,
                  borderRadius: 3,
                  backgroundColor: "#f8fbff",
                  border: "1px solid #edf2f7",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    color: "#1f2a44",
                  }}
                >
                  {t("BankInformation")}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label={`${t("BankName")}`}
                fullWidth
                size="small"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label={`${t("IFSCCode")}`}
                fullWidth
                size="small"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label={`${t("BankAccountNumber")}`}
                fullWidth
                size="small"
                value={bankAccount}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input) && input.length <= 18) {
                    setBankAccount(input);
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#fafbff",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    minWidth: 180,
                    py: 1.25,
                    px: 3,
                    borderRadius: 3,
                    fontWeight: 800,
                    textTransform: "none",
                    background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
                    boxShadow: "0 10px 22px rgba(37,99,235,0.22)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1d4ed8, #1e40af)",
                      boxShadow: "0 12px 24px rgba(37,99,235,0.28)",
                    },
                    "&:disabled": {
                      background: "#d1d5db",
                      color: "#7b8794",
                    },
                  }}
                >
                  {isSubmitting ? "Submitting..." : t("submit")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  </>
);
};

export default PostJob;

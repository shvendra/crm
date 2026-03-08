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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          mx: "auto",
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
            {t("WorkerRRegistration")}
          </Typography>

          <Typography fontSize={12} color="text.secondary">
            {t("WorkerRRegistration")}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          maxWidth: "700px",
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
          // mt: '15px',
          mb: 4,
          "&::before": {
            content: '"BookMyWorker"',
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: { xs: "2rem", md: "4rem" },
            fontWeight: 600,
            color: "rgba(0, 0, 0, 0.04)",
            zIndex: 0,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          },
        }}
      >
        <Card
          sx={{
            mt: 1,
            mb: 3,
            ml: { xs: 1, sm: 1, md: 1 },
            mr: { xs: 1, sm: 1, md: 1 },
            p: 1,
            bgcolor: "white",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            color="primary"
            sx={{
              fontWeight: 600,
              background: "#f4f5f8",
              marginBottom: "5px",
              marginTop: "-8px",
              padding: "5px",
            }}
          >
            {t("WorkerRRegistration")}
          </Typography>

          <form onSubmit={handleJobPost}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label={`${t("WorkerName")} *`}
                  fullWidth
                  size="small"
                  value={name}
                  onChange={(e) => {
                    const input = e.target.value;

                    // ✅ Allow only letters & spaces (no numbers)
                    if (/^[A-Za-z\s]*$/.test(input)) {
                      setWorkerName(input);
                    }
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={6} sm={6}>
                <TextField
                  label={`${t("DateOfBirth")} *`}
                  type="number"
                  fullWidth
                  size="small"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  error={!!errors.dob}
                  helperText={errors.dob}
                />
              </Grid>

              <Grid item xs={6} sm={6}>
                <TextField
                  label={`${t("MobileNumber")} *`}
                  fullWidth
                  type="tel" // better for mobile keyboards
                  value={mobile}
                  size="small"
                  onChange={(e) => {
                    const input = e.target.value;

                    // ✅ Allow only digits & limit to 10
                    if (/^\d*$/.test(input) && input.length <= 10) {
                      setMobile(input);
                    }
                  }}
                  onBlur={() => {
                    // ✅ Trigger error if not 10 digits on blur
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
                />
              </Grid>

              <Grid item xs={6} sm={6}>
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
                  >
                    {Object.keys(stateDistrict).map((stateName) => (
                      <MenuItem key={stateName} value={stateName}>
                        {stateName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.state && (
                    <Typography color="error" variant="caption">
                      {errors.state}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={6}>
                <FormControl
                  fullWidth
                  disabled={!state}
                  error={!!errors.district}
                >
                  <InputLabel>{t("City")} *</InputLabel>
                  <Select
                    size="small"
                    MenuProps={{ disablePortal: true }}
                    value={district}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setTehsil("");
                    }} // Corrected to set district
                    label={`${t("City")} *`}
                  >
                    {state &&
                      Object.keys(stateDistrict[state] || {}).map(
                        (districtName) => (
                          <MenuItem key={districtName} value={districtName}>
                            {districtName}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                  {errors.district && (
                    <Typography color="error" variant="caption">
                      {errors.district}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={6}>
                <FormControl
                  fullWidth
                  disabled={!district}
                  error={!!errors.tehsil}
                >
                  <InputLabel id="tehsil-label">
                    {t("BlockTehsil")} *
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="tehsil-label"
                    value={tehsil}
                    onChange={(e) => handleTehsilChange(e)}
                    required
                    label={`${t("BlockTehsil")} *`}
                  >
                    <MenuItem value="">Select Block/Tehsil</MenuItem>
                    {state &&
                      district &&
                      (stateDistrict[state]?.[district] || []).map(
                        (tehsilName) => (
                          <MenuItem key={tehsilName} value={tehsilName}>
                            {tehsilName}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                  {errors.tehsil && (
                    <Typography color="error" variant="caption">
                      {errors.tehsil}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={6}>
                <TextField
                  label={`${t("address")} *`}
                  fullWidth
                  size="small"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  // error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  select
                  label={`${t("workexperience")} *`}
                  fullWidth
                  size="small"
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  error={!!errors.workExperience}
                  helperText={errors.workExperience}
                >
                  {Array.from({ length: 36 }, (_, i) => (
                    <MenuItem key={i} value={i}>
                      {i} {i === 1 ? "Year" : "Years"}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Work Type */}
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.categories}>
                  <InputLabel id="work-type-label">
                    {t("WorkType")} *
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="work-type-label"
                    label={`${t("workType")} *`}
                    multiple
                    value={selectedCategories}
                    onChange={handleChange}
                    renderValue={(selected) =>
                      selected.length === 0
                        ? "Select Areas"
                        : selected.join(", ")
                    }
                  >
                    {/* Search Box */}
                    <Box sx={{ padding: 1 }}>
                      <TextField
                        label={`${t("InterestOfWork")} *`}
                        fullWidth
                        size="small"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </Box>

                    {/* Sub Category List */}
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
                          secondary={area.parent} // OPTIONAL: shows Industrial / Construction
                        />
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Error Handling */}
                  {errors.categories && (
                    <Typography color="error" variant="caption">
                      {errors.categories}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Salary Section */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t("WagesType")} *</InputLabel>

                  <Select
                    size="small"
                    MenuProps={{ disablePortal: true }}
                    value={salaryType}
                    onChange={(e) => setSalaryType(e.target.value)}
                    label={`${t("WagesType")} *`}
                  >
                    <MenuItem value="Fixed">{t("salaryFixedPerDay")}</MenuItem>

                    <MenuItem value="Ranged">
                      {t("salaryRangedPerday")}
                    </MenuItem>
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
                      setErrors((prev) => ({ ...prev, gender: "" })); // clear error on change
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

                  {/* Error Handling */}
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
                  />
                </Grid>
              )}

              {salaryType === "Ranged" && (
                <>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label={t("WageFrom")}
                      type="number"
                      size="small"
                      value={salaryFrom}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                      fullWidth
                      error={!!errors.salaryFrom}
                      helperText={errors.salaryFrom}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label={t("WageTo")}
                      type="number"
                      size="small"
                      value={salaryTo}
                      onChange={(e) => setSalaryTo(e.target.value)}
                      fullWidth
                      error={!!errors.salaryTo}
                      helperText={errors.salaryTo}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={6}>
                <TextField
                  label={`${t("AboutWorker")} *`}
                  fullWidth
                  size="small"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              {/* Bank Information Section */}
              {/* <Grid item xs={12}>
  <Typography
    variant="h6"
    sx={{ mt: 2, mb: 1, fontWeight: 600, color: 'primary.main' }}
  >
    {t('BankInformation')}
  </Typography>
</Grid> */}

              <Grid item xs={6} sm={4}>
                <TextField
                  label={`${t("BankName")}`}
                  fullWidth
                  size="small"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label={`${t("IFSCCode")}`}
                  fullWidth
                  size="small"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
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
                    // ✅ Allow only digits, up to 18
                    if (/^\d*$/.test(input) && input.length <= 18) {
                      setBankAccount(input);
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  type="submit"
                  disabled={isSubmitting}
                  sx={{ padding: "5px 15px", mt: 1 }}
                >
                  {isSubmitting ? "Submitting..." : t("submit")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Box>
    </>
  );
};

export default PostJob;

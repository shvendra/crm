import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  Typography,
  Button,
  Avatar,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Rating,
  InputAdornment,
} from "@mui/material";
import categories from "../../categories.json";
import stateDistrict from "../../stateDistrict";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "../../utils/axiosConfig";
import config from "../../config";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const BrowseWorker = () => {
   const { t, i18n } = useTranslation();
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState("");
  const [district, setCity] = useState("");
  const [errors, setErrors] = useState({});
  const [tehsil, setTehsil] = useState("");

  const [openDialog, setOpenDialog] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    workType: "",
    workerQuantitySkilled: "",
    ageGroup: "",
    workLocation: "",
    budgetPerWorker: "",
    workerNeedDate: "",
    inTime: "",
    outTime: "",
    remarks: "",
    selectedCategories: [],
    state: "",
    district: "",
    block: "",
    minBudgetPerWorker: "",
    maxBudgetPerWorker: "",
    employerId: user._id,
    employerName: user.name,
    employerPhone: user.phone,
    ERN_NUMBER: "",
  });

  const [filteredCategories, setFilteredCategories] = useState(categories);
 
  useEffect(() => {
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      setFilteredCategories(
        categories.filter((c) => c.label.toLowerCase().includes(lower))
      );
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery]);
  const fetchAgents = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/api/v1/user/getAllAgents`,
        {
          params: {
            state: state,
            city: district,
          },
          withCredentials: true,
        }
      );
      setAgents(response.data.agents);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     if (user?.role === "Employer" && !user?.isSubscribed) {
navigate("/Dashboard")
  }
    fetchAgents();
  }, []);
  useEffect(() => {
    const handleBlur = () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    };

    const inputs = document.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => input.addEventListener("blur", handleBlur));

    return () => {
      inputs.forEach((input) => input.removeEventListener("blur", handleBlur));
    };
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStateChange = (e) => {
    const stateVal = e.target.value;
    setState(e.target.value);
    setCity("");
    setTehsil("");
    setFormData((prev) => ({
      ...prev,
      state: stateVal,
      district: "", // reset district
      city: "",
    }));
    setFormErrors((prev) => ({ ...prev, state: "", district: "" }));
  };
  const handleTehsilChange = (e) => {
    setTehsil(e.target.value);
    const city = e.target.value;
    setFormData((prev) => ({
      ...prev,
      block: city,
    }));
    setFormErrors((prev) => ({ ...prev, block: "" }));
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      subCategory: value,
    }));
    setFormErrors((prev) => ({ ...prev, subCategory: "" }));
  };
  const handleDistrictChange = (e) => {
    setCity(e.target.value);
    setTehsil("");
    setFormData((prev) => ({ ...prev, district: e.target.value }));
    setFormErrors((prev) => ({ ...prev, district: "" }));
  };

  const handleWorkTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, workType: e.target.value }));
    setFormErrors((prev) => ({ ...prev, workType: "" }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const selectedCategory = categories.find(
    (cat) => cat.value === formData.workType
  );
  const handleSearch = async () => {
    const errors = {};
    const requiredFields = [
      "workerQuantitySkilled",
      "workType",
      "state",
      "district",
      "block",
      "minBudgetPerWorker",
      "maxBudgetPerWorker",
      "subCategory",
      "workerNeedDate",
    ];

    // Check for missing required fields
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
          setIsSearching(true);
    fetchAgents();
    setFormErrors({});
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/v1/application/insert`,
        {
          ...formData,
          employerId: user._id,
          employerName: user.name,
          employerPhone: user.phone,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // toast.success("Requirement posted successfully!");
        setOpenDialog(false);
      }
    } catch (error) {
      console.error(
        "❌ API Error:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
        setIsSearching(false); // optionally reset if needed

  };

  return (
    <>
      {/* Search Dialog */}

      <Dialog
        disablePortal
        open={openDialog}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") return;
        }}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
          },
          padding: "0px !important",
        }}
        // REMOVE: disableScrollLock
        PaperProps={{
          sx: {
            borderRadius: 3,

            boxShadow: 6,
            background: "#f9f9f9",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            textAlign: "center",
            background: "rgb(26 118 210)",
            color: "white !important",
            lineHeight: "2.6",
            padding: "2px",
          }}
        >
          {t("searchWorkers")}
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={2}
            mt={1}
          >
            <Grid container spacing={2}>
              {/* ✅ First Row: State, City (District), Tehsil/Block */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors.state}>
                  <InputLabel id="state-label">{t("State")} *</InputLabel>
                  <Select
                    value={state}
                    onChange={handleStateChange}
                    label="State *"
                  >
                    {Object.keys(stateDistrict).map((stateName) => (
                      <MenuItem key={stateName} value={stateName}>
                        {stateName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.state && (
                    <Typography color="error" variant="caption">
                      {formErrors.state}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  disabled={!state}
                  error={!!errors.district}
                >
                  <InputLabel>{t("City")} *</InputLabel>
                  <Select
                    value={district}
                    onChange={handleDistrictChange}
                    label="City *"
                  >
                    {state &&
                      Object.keys(stateDistrict[state] || {}).map(
                        (districtName) => (
                          <MenuItem key={districtName} value={districtName}>
                            {districtName}
                          </MenuItem>
                        )
                      )}
                  </Select>
                  {formErrors.district && (
                    <Typography color="error" variant="caption">
                      {formErrors.district}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  disabled={!district}
                  error={!!errors.tehsil}
                >
                  <InputLabel id="tehsil-label">
                    {t("BlockTehsil")} *
                  </InputLabel>
                  <Select
                    labelId="tehsil-label"
                    value={tehsil}
                    onChange={handleTehsilChange}
                    required
                    label="Block/Tehsil"
                  >
                    <MenuItem value="">Select Block/Tehsil</MenuItem>
                    {state &&
                      district &&
                      (stateDistrict[state]?.[district] || []).map(
                        (tehsilName) => (
                          <MenuItem key={tehsilName} value={tehsilName}>
                            {tehsilName}
                          </MenuItem>
                        )
                      )}
                  </Select>
                  {formErrors.block && (
                    <Typography color="error" variant="caption">
                      {formErrors.block}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* ✅ Second Row: Worker Need (Skilled), Work Type, Subcategory */}
              <Grid item xs={12} sm={4}>
                <TextField
                  name="workerQuantitySkilled"
                  label={t("requiredWorkers") + "*"}
                  type="number"
                  fullWidth
                  onChange={handleChange}
                  value={formData.workerQuantitySkilled}
                  error={!!formErrors.workerQuantitySkilled}
                  helperText={formErrors.workerQuantitySkilled}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors.workType}>
                  <InputLabel>{t("WorkType")} *</InputLabel>
                  <Select
                    value={formData.workType}
                    onChange={handleWorkTypeChange}
                    label="Work Type *"
                  >
                    {filteredCategories.map((cat) => (
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
                  {formErrors.workType && (
                    <Typography color="error" variant="caption">
                      {formErrors.workType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors.subCategory}>
                  <InputLabel>{t("subCategory")} *</InputLabel>
                  <Select
                    value={formData.subCategory}
                    onChange={handleSubCategoryChange}
                    label="Sub Category *"
                  >
                    {selectedCategory?.subcategories?.map((sub) => (
                      <MenuItem key={sub.value} value={sub.value}>
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
                  {formErrors.subCategory && (
                    <Typography color="error" variant="caption">
                      {formErrors.subCategory}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* ✅ Third Row: Min/Max Budget */}
              <Grid item xs={12} sm={4}>
                <TextField
                  name="minBudgetPerWorker"
                  label={t("minBudget")+"*"}
                  type="number"
                  fullWidth
                  onChange={handleChange}
                  value={formData.minBudgetPerWorker}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  error={!!formErrors.minBudgetPerWorker}
                  helperText={formErrors.minBudgetPerWorker}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  name="maxBudgetPerWorker"
                  label={t("maxBudget")+"*"}
                  type="number"
                  fullWidth
                  onChange={handleChange}
                  value={formData.maxBudgetPerWorker}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  error={!!formErrors.maxBudgetPerWorker}
                  helperText={formErrors.maxBudgetPerWorker}
                />
              </Grid>

              {/* Worker Need Date */}
              <Grid item xs={12} sm={4}>
                <TextField
                  name="workerNeedDate"
                  label={t("dateOfWork")+"*"}
                  type="date"
                  fullWidth
                  onChange={handleChange}
                  value={formData.workerNeedDate}
                  InputLabelProps={{ shrink: true }} // keeps label visible
                  error={!!formErrors.workerNeedDate}
                  helperText={formErrors.workerNeedDate}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0], // disable past dates
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            px={2}
            pb={1}
          >
            <Button
              onClick={() => navigate("/Dashboard")}
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 2, fontWeight: 500 }}
            >
              Back
            </Button>
            <Button
              onClick={handleSearch}
              variant="contained"
              disabled={isSearching} // disable when searching
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                backgroundColor: "#1976d2",
                ":hover": {
                  backgroundColor: "#125ea4",
                },
              }}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Worker Group Cards */}
      <Card sx={{ boxShadow: 1, borderRadius: 2 }}>
        <Box
          sx={{
            maxWidth: "1200px",
            minHeight: "1100px",
            margin: "auto",
            py: 1,
            mt: 1,
            px: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              background: "#1a76d2",
              color: "white",
              padding: "6px",
              textAlign: "center",
              marginBottom: "20px",
              borderRadius: "4px", // optional for better look
            }}
          >
            {t("workerAgentsNearYou")}
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {agents.length === 0 ? (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ mt: 4, mb: 4, color: "text.secondary" }}
                >
                  {t("noAgentsAvailable")}
                </Typography>
              </Grid>
            ) : (
              agents.map((group, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: "center",
                      boxShadow: 3,
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 2,
                      backgroundColor: "#f5f5f5",
                      mb: 2,
                      display: "flex",
                      flexDirection: "column",
                      "&::before": {
                        content: '"BookMyWorker"',
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-30deg)",
                        fontSize: "3rem",
                        fontWeight: 700,
                        color: "rgba(0, 0, 0, 0.04)",
                        zIndex: 0,
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    <Avatar
                      src={config.API_BASE_URL + "/" + group.profilePhoto}
                      sx={{ width: 80, height: 80, margin: "auto", mb: 1 }}
                    />
                    <Typography variant="h6">
                      {group.name} {String.fromCharCode(65 + i)}
                    </Typography>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Rating
                        value={[4, 4.5, 5][Math.floor(Math.random() * 3)]}
                        readOnly
                        precision={0.5}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {group.district}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => toast.success("Invitation sent!")}
                    >
                      Invite
                    </Button>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default BrowseWorker;

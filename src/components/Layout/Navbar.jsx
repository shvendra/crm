import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { SupportAgent } from "@mui/icons-material";
import { MdArticle } from "react-icons/md";
import Article from "@mui/icons-material/Article";
import RoleTabs from "../Dashboard/RoleTabs";

// import { GiHamburgerMenu } from "react-icons/gi";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  IconButton,
  Box,
  Stack,
  BottomNavigation,
  BottomNavigationAction,
  Avatar,
  Select,
  MenuItem,
} from "@mui/material";
import config from "../../config";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";

import {
  Home,
  Work,
  Person,
  Logout,
  People,
  AddCircle,
  Search,
  RequestQuote,
  EmojiEvents,
} from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
const menuButtonStyle = {
  justifyContent: "flex-start",
  color: "#333",
  padding: "8px 16px",
  textTransform: "none",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
};
 const availableRoles = JSON.parse(
    localStorage.getItem("availableRoles") || "[]"
  );
const Navbar = () => {
  // const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const navigateTo = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [value, setValue] = useState(0);
  const [lang, setLang] = useState("en");
  const { i18n, t } = useTranslation();
  useEffect(() => {
    const defaultLang = "en";
    setLang(defaultLang);
    i18n.changeLanguage(defaultLang);
  }, [user, i18n]);

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    setLang(selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  const handleLogout = async () => {
    try {
      // Show loading toast
      toast.loading("Logging out...", { id: "logout" });

      // Call logout API
      const response = await axios.get(
        `${config.API_BASE_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        },
      );

      // Clear user state immediately after successful logout
      setUser(null);
      setIsAuthorized(false);

      // Clear any potential cached data
      localStorage.removeItem("user");
      sessionStorage.clear();

      // Clear axios defaults if any
      if (axios.defaults.headers.common["Authorization"]) {
        delete axios.defaults.headers.common["Authorization"];
      }

      toast.success(response.data.message || "Logged out successfully", {
        id: "logout",
      });

      // Navigate to landing page
      navigateTo("/landing", { replace: true });

      // Force page reload to clear any remaining state (optional but ensures clean state)
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);

      // Even if logout API fails, clear local state
      setUser(null);
      setIsAuthorized(false);
      localStorage.removeItem("user");
      sessionStorage.clear();

      if (error.response?.data?.message) {
        toast.error(error.response.data.message, { id: "logout" });
      } else {
        toast.error("Logged out (connection issue)", { id: "logout" });
      }

      // Navigate anyway
      navigateTo("/landing", { replace: true });
    }
  };
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <>
      {/* Material UI AppBar - Fixed at Top */}
      <AppBar
        sx={{
          zIndex: 1100, // Higher z-index to stay above other components
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
        }}
        className={isAuthorized ? "navbarShow" : "navbarHide"}
        position="fixed"
      >
        <Toolbar sx={{ pl: 0 }}>
          {/* Brand Name */}
          <Typography
  variant="h5"
  sx={{ display: "flex", alignItems: "center", flexGrow: 1, color: "white", marginLeft: 1 }}
>
  {isAuthorized && (
    <Avatar
      src={user?.profilePhoto ? `${config.FILE_BASE_URL}/${user.profilePhoto}`.replace(/([^:]\/)\/+/g, "$1") : ""}
      alt={user?.name || "Profile"}
      sx={{ width: 32, height: 32, mr: 1 }} // mr: 1.5 adds standard 12px spacing
    />
  )}

  <Stack direction="column" spacing={0} sx={{ lineHeight: 1 }}>
    <Box sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
      {(user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1)) || "BookMyWorker"}
    </Box>
    <Box sx={{ fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
      {getGreeting()}
    </Box>
  </Stack>
</Typography>

          {/* Mobile View: Hamburger Menu & Profile */}
          <Box
            sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center" }}
          >
            {isAuthorized && (
              <>
                {/* Language Selector */}
                <Select
                  value={lang}
                  onChange={handleLanguageChange}
                  displayEmpty
                  size="small"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "15px",
                    mr: 2,
                    maxWidth: 72,
                    fontSize: 9,
                    fontWeight: 500,

                    "& .MuiSelect-select": {
                      overflow: "visible !important",
                      whiteSpace: "normal",
                      textOverflow: "unset",
                    },
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">हिंदी</MenuItem>
                  <MenuItem value="mr">मराठी</MenuItem>
                  <MenuItem value="gu">ગુજરાતી</MenuItem>
                </Select>

                {/* Avatar */}
              
              </>
            )}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop View: Menu + Profile */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
            }}
          >
            {isAuthorized ? (
              <>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  color="inherit"
                  component={Link}
                  to={"/Dashboard"}
                >
                  {t("home")}
                </Button>

                {user?.role === "SuperAdmin" && (
                  <>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/job/getall"}
                    >
                      {t("All")}
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/users/unveryfied"}
                    >
                      {t("Users")}
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/users/leads"}
                    >
                      {t("Leads")}
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/blogpost"}
                    >
                      {t("blogPost")}
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/health-monitor"}
                    >
                      {t("Health")}
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/adminPayout"}
                    >
                      {t("Payouts")}
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/admin/agreements"}
                    >
                      {t("Agreements")}
                    </Button>
                  </>
                )}

                {user?.role === "Admin" && (
                  <>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/job/getall"}
                    >
                      {t("All")}
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/users/unveryfied"}
                    >
                      {t("Users")}
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/users/leads"}
                    >
                      {t("Leads")}
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/blogpost"}
                    >
                      {t("blogPost")}
                    </Button>

                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to={"/admin/agreements"}
                    >
                      {t("Agreements")}
                    </Button>
                  </>
                )}

                {/* Only for Agent */}
                {user?.role === "Agent" && (
                  <>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to="/job/post"
                    >
                      {t("AddWorker")}
                    </Button>

                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to="/job/me"
                    >
                      {t("MyWorkers")}
                    </Button>
                  </>
                )}

                {/* For Agent + SelfWorker */}
                {(user?.role === "Agent" || user?.role === "SelfWorker") && (
                  <>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to="/payout"
                    >
                      {t("Payout")}
                    </Button>

                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to="/agent-benefits"
                    >
                      {t("Benefits")}
                    </Button>
                  </>
                )}

                {user?.role === "Employer" && (
                  <>
                    {/* <Button
                      color="inherit"
                      component={Link}
                      to={"/job/findworker"}
                    >
                      {t("FindWorker")}
                    </Button> */}
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="inherit"
                      component={Link}
                      to="/payout"
                    >
                      {t("transaction")}
                    </Button>
                  </>
                )}

                <Button
                  sx={{ textTransform: "capitalize" }}
                  color="inherit"
                  component={Link}
                  to={"/my/profile"}
                >
                  {t("MyProfile")}
                </Button>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  color="inherit"
                  onClick={handleLogout}
                >
                  <a>{t("Logout")}</a>
                </Button>
                {isAuthorized && (
                  <>
                    {/* Language Selector */}
                    <Select
                      value={lang}
                      onChange={handleLanguageChange}
                      displayEmpty
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "15px",
                        mr: 1,
                        maxWidth: 80,
                        fontSize: 14,
                        fontWeight: 500,

                        "& .MuiSelect-select": {
                          overflow: "visible !important",
                          whiteSpace: "normal",
                          textOverflow: "unset",
                        },
                      }}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="hi">हिन्दी</MenuItem>
                      <MenuItem value="mr">मराठी</MenuItem>
                      <MenuItem value="gu">ગુજરાતી</MenuItem>
                    </Select>

                    {/* Avatar */}
                    <Avatar
                      src={
                        user?.profilePhoto
                          ? `${config.FILE_BASE_URL}/${user.profilePhoto}`.replace(
                              /([^:]\/)\/+/g,
                              "$1",
                            )
                          : ""
                      }
                      alt={user?.name || "Profile"}
                      sx={{ width: 32, height: 32 }}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                {/* <Button
                  sx={{ textTransform: "capitalize" }}
                  color="inherit"
                  component={Link}
                  to={"/"}
                >
                  Home
                </Button> */}
                {/* <Button
                  sx={{ textTransform: "capitalize" }}
                  color="inherit"
                  component={Link}
                  to={"/blogs"}
                >
                  Blogs
                </Button> */}
                <Button
                  sx={{ textTransform: "capitalize" }}
                  color="inherit"
                  component={Link}
                  to={"/login"}
                >
                  Login
                </Button>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  color="inherit"
                  component={Link}
                  to={"/register"}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for Sidebar (Responsive Navbar for Small Screens) */}
      <Drawer
        PaperProps={{
          sx: {
            width: 300,
            height: "auto", // 💡 Let it grow based on content
            maxHeight: "100vh", // ✅ Prevent it from going beyond screen
            marginTop: 2, // Optional top margin
            borderRadius: "8px 0 0 8px", // Rounded left edge if needed
          },
        }}
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer}
      >
        <Box
          sx={{
            width: 300, // Increased width for better usability
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f5f5f5", // Light background for a modern look
            padding: "16px",
          }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          {isAuthorized ? (
            <>
              {/* Section for Navigation */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ marginTop: 2, color: "gray" }}
                >
                  {t("Navigation")}
                </Typography>
                <IconButton onClick={toggleDrawer}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Button
                fullWidth
                startIcon={<Home />}
                sx={menuButtonStyle}
                component={Link}
                to="/Dashboard"
              >
                {t("home")}
              </Button>

              {user &&
                (user.role === "Admin" || user.role === "SuperAdmin") && (
                  <>
                    <Button
                      fullWidth
                      startIcon={<People />}
                      color="inherit"
                      sx={menuButtonStyle}
                      component={Link}
                      to={"/job/getall"}
                    >
                      {t("All")}
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<People />}
                      sx={menuButtonStyle}
                      component={Link}
                      to="users/unveryfied"
                    >
                      {t("Users")}
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<People />}
                      sx={menuButtonStyle}
                      component={Link}
                      to="/users/leads"
                    >
                      {t("Leads")}
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<MdArticle />}
                      sx={menuButtonStyle}
                      component={Link}
                      to="/blogpost"
                    >
                      {t("BlogPost")}
                    </Button>
                  </>
                )}

              {user && user.role === "Agent" && (
                <>
                  <Button
                    fullWidth
                    startIcon={<AddCircle />}
                    sx={menuButtonStyle}
                    component={Link}
                    to="/job/post"
                  >
                    {t("AddWorker")}
                  </Button>

                  <Button
                    fullWidth
                    startIcon={<Work />}
                    sx={menuButtonStyle}
                    component={Link}
                    to="/job/me"
                  >
                    {t("MyWorkers")}
                  </Button>
                </>
              )}

              {user &&
                (user.role === "Agent" || user.role === "SelfWorker") && (
                  <>
                    <Button
                      fullWidth
                      startIcon={<RequestQuote />}
                      sx={menuButtonStyle}
                      component={Link}
                      to="/payout"
                    >
                      {t("Payout")}
                    </Button>

                    <Button
                      fullWidth
                      startIcon={<EmojiEvents />}
                      sx={menuButtonStyle}
                      component={Link}
                      to="/agent-benefits"
                    >
                      {t("Benefits")}
                    </Button>
                  </>
                )}

              {user && user.role === "Employer" && (
                <>
                  {/* <Button
                    fullWidth
                    startIcon={<Search />}
                    sx={menuButtonStyle}
                    component={Link}
                    to="/job/findworker"
                  >
                    {t("findWorker")}
                  </Button> */}
                  <Button
                    fullWidth
                    startIcon={<RequestQuote />}
                    sx={menuButtonStyle}
                    component={Link}
                    to="/payout"
                  >
                    {t("transaction")}
                  </Button>
                </>
              )}

              {/* Profile and Logout Section */}
              <Typography
                variant="subtitle2"
                sx={{ marginTop: 2, color: "gray" }}
              >
                {t("Account")}
              </Typography>
              <Button
                fullWidth
                startIcon={<Person />}
                sx={menuButtonStyle}
                component={Link}
                to="/my/profile"
              >
                {t("MyProfile")}
              </Button>
              <Button
                fullWidth
                startIcon={<Logout />}
                sx={menuButtonStyle}
                onClick={handleLogout}
              >
                <a>{t("Logout")}</a>
              </Button>
              <Button
                fullWidth
                startIcon={<SupportAgent />}
                sx={{
                  ...menuButtonStyle,
                  backgroundColor: "#e0f7fa",
                  color: "#00796b",
                  "&:hover": {
                    backgroundColor: "#b2ebf2",
                  },
                }}
                href="tel:7389791873"
              >
                {t("custsupport")}
              </Button>
               <RoleTabs
                                      availableRoles={availableRoles}
                                      currentUser={user}
                                      setUser={setUser}
                                    />
            </>
          ) : (
            <>
              {/* <Button
                fullWidth
                startIcon={<Home />}
                sx={menuButtonStyle}
                component={Link}
                to="/"
              >
                Home
              </Button> */}

              {/* <Button
                fullWidth
                startIcon={<Article />} 
                sx={menuButtonStyle}
                component={Link}
                to="/blogs"
              >
                Blogs
              </Button> */}

              <Button
                fullWidth
                startIcon={<Person />}
                sx={menuButtonStyle}
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                fullWidth
                startIcon={<Person />}
                sx={menuButtonStyle}
                component={Link}
                to="/register"
              >
                Register
              </Button>

              <Button
                fullWidth
                startIcon={<SupportAgent />}
                sx={{
                  ...menuButtonStyle,
                  backgroundColor: "#e0f7fa",
                  color: "#00796b",
                  "&:hover": {
                    backgroundColor: "#b2ebf2",
                  },
                }}
                href="tel:7389791873"
              >
                {t("custsupport")}
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      <Box
        sx={{
          display: { xs: "block", sm: "block" }, // Display only on small screens
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: "red",
        }}
      >
        {isAuthorized ? (
          <Box>
            <BottomNavigation
              value={value}
              onChange={(event, newValue) => setValue(newValue)}
              showLabels // Ensure all labels are displayed
              sx={{
                minWidth: 53,
                backgroundColor: (theme) => theme.palette.primary.main,
              }}
            >
              {/* Home Action */}
              <BottomNavigationAction
                icon={<Home sx={{ color: "white" }} />}
                component={Link}
                to="/Dashboard"
                label={t("home")}
                sx={{
                  minWidth: 53,
                  "& .MuiBottomNavigationAction-label": {
                    color: "white",
                    opacity: 1,
                  },
                  "& .css-o3gopw": {
                    padding: 0,
                  },
                  padding: 0,
                }}
              />
              {/* Admin Role Action */}
              {user && user.role === "Admin" && (
                <BottomNavigationAction
                  icon={<People sx={{ color: "white" }} />}
                  component={Link}
                  to={"/users/unveryfied"}
                  label="Users"
                  sx={{
                    minWidth: 53,
                    "& .MuiBottomNavigationAction-label": {
                      color: "white",
                      opacity: 1,
                    },
                    "& .css-o3gopw": {
                      padding: 0,
                    },
                    padding: 0,
                  }}
                />
              )}
              {/* Agent Role Actions */}
              {user && user.role === "Agent" && (
                <>
                  <BottomNavigationAction
                    icon={<AddCircle sx={{ color: "white" }} />}
                    component={Link}
                    to="/job/post"
                    sx={{
                      minWidth: 53,
                      "& .MuiBottomNavigationAction-label": {
                        color: "white",
                        opacity: 1,
                      },
                      "& .css-o3gopw": {
                        padding: 0,
                      },
                      padding: 0,
                    }}
                    label={t("Add")}
                  />

                  <BottomNavigationAction
                    icon={<Work sx={{ color: "white" }} />}
                    component={Link}
                    to="/job/me"
                    sx={{
                      minWidth: 53,
                      "& .MuiBottomNavigationAction-label": {
                        color: "white",
                        opacity: 1,
                      },
                      "& .css-o3gopw": {
                        padding: 0,
                      },
                      padding: 0,
                    }}
                    label={t("Workers")}
                  />
                </>
              )}

              {/* Employer Role Action */}
              {/* {user && user.role === "Employer" && (
              <BottomNavigationAction
                icon={<Search sx={{ color: "white", padding: 0 }} />}
                component={Link}
                to="/job/findworker"
                label={t("Search")}
                sx={{
                  minWidth: 53,
                  "& .MuiBottomNavigationAction-label": {
                    color: "white",
                    opacity: 1,
                  },
                  "& .css-o3gopw": {
                    padding: 0,
                  },
                  padding: 0,
                }}
              />
            )} */}
              {/* Profile Action */}
              <BottomNavigationAction
                icon={<Person sx={{ color: "white" }} />}
                component={Link}
                to="/my/profile"
                sx={{
                  minWidth: 53,
                  "& .MuiBottomNavigationAction-label": {
                    color: "white",
                    opacity: 1,
                  },
                  "& .css-o3gopw": {
                    padding: 0,
                  },
                  padding: 0,
                }}
                label={t("Profile")}
              />
              {/* Logout Action */}
              <BottomNavigationAction
                icon={<Logout sx={{ color: "white" }} />}
                component={Link}
                onClick={handleLogout}
                sx={{
                  minWidth: 53,
                  "& .MuiBottomNavigationAction-label": {
                    color: "white",
                    opacity: 1,
                  },
                  "& .css-o3gopw": {
                    padding: 0,
                  },
                  padding: 0,
                }}
                label={t("Logout")}
              />
            </BottomNavigation>
          </Box>
        ) : (
          <>
            <Box sx={{ bgcolor: "rgb(0 13 37)" }} mt={0} textAlign="center">
              <Typography variant="body2" sx={{ color: "white" }}>
                © {new Date().getFullYear()} <strong>BookMyWorker</strong>. All
                Rights Reserved
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Navbar;

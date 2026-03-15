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

  const navBtnStyle = {
  textTransform: "capitalize",
  borderRadius: "12px",
  px: 1.4,
  py: 0.8,
  fontWeight: 700,
  color: "#fff",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.10)",
  },
};

const drawerBtnStyle = {
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: "14px",
  px: 1.4,
  py: 1.2,
  mt: 0.6,
  fontWeight: 700,
  color: "#1f2937",
  backgroundColor: "#fff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
  "&:hover": {
    backgroundColor: "#f8fafc",
  },
};

const bottomNavItemStyle = {
  minWidth: 53,
  color: "white",
  "& .MuiBottomNavigationAction-label": {
    color: "white",
    opacity: 1,
    fontWeight: 600,
    fontSize: "0.7rem",
  },
  "& .css-o3gopw": {
    padding: 0,
  },
  padding: 0,
};

  return (
<>
  {/* Material UI AppBar - Fixed at Top */}
  <AppBar
    sx={{
      zIndex: 1100,
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(10px)",
    }}
    className={isAuthorized ? "navbarShow" : "navbarHide"}
    position="fixed"
  >
    <Toolbar
      sx={{
        pl: 0,
        minHeight: { xs: 60, sm: 68 },
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Brand Name */}
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          color: "white",
          marginLeft: 1,
        }}
      >
        {isAuthorized && (
          <Avatar
            src={
              user?.profilePhoto
                ? `${config.FILE_BASE_URL}/${user.profilePhoto}`.replace(
                    /([^:]\/)\/+/g,
                    "$1"
                  )
                : ""
            }
            alt={user?.name || "Profile"}
            sx={{
              width: 36,
              height: 36,
              mr: 1.2,
              border: "2px solid rgba(255,255,255,0.85)",
              boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
            }}
          />
        )}

        <Stack direction="column" spacing={0} sx={{ lineHeight: 1 }}>
          <Box
            sx={{
              fontWeight: 800,
              fontSize: "0.98rem",
              letterSpacing: "-0.01em",
            }}
          >
            Hello,{" "}
            {user?.name
              ? user.name.split(" ")[0].charAt(0).toUpperCase() +
                user.name.split(" ")[0].slice(1)
              : "Guest"}
          </Box>
          <Box
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {getGreeting()}
          </Box>
        </Stack>
      </Typography>

      {/* Mobile View */}
      <Box
        sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: 1 }}
      >
        {isAuthorized && (
          <>
            <Select
              value={lang}
              onChange={handleLanguageChange}
              displayEmpty
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.96)",
                borderRadius: "999px",
                mr: 1,
                maxWidth: 76,
                fontSize: 10,
                fontWeight: 700,
                minHeight: 34,
                boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
                "& .MuiSelect-select": {
                  overflow: "visible !important",
                  whiteSpace: "normal",
                  textOverflow: "unset",
                  py: 0.7,
                },
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिंदी</MenuItem>
              <MenuItem value="mr">मराठी</MenuItem>
              <MenuItem value="gu">ગુજરાતી</MenuItem>
            </Select>
          </>
        )}

        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
          sx={{
            bgcolor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.16)",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Desktop View */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        {isAuthorized ? (
          <>
            <Button
              sx={navBtnStyle}
              color="inherit"
              component={Link}
              to={"/Dashboard"}
            >
              {t("home")}
            </Button>

            {user?.role === "SuperAdmin" && (
              <>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/job/getall"}>
                  {t("All")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/users/unveryfied"}>
                  {t("Users")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/users/leads"}>
                  {t("Leads")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/blogpost"}>
                  {t("blogPost")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/health-monitor"}>
                  {t("Health")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/adminPayout"}>
                  {t("Payouts")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/admin/agreements"}>
                  {t("Agreements")}
                </Button>
              </>
            )}

            {user?.role === "Admin" && (
              <>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/job/getall"}>
                  {t("All")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/users/unveryfied"}>
                  {t("Users")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/users/leads"}>
                  {t("Leads")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/blogpost"}>
                  {t("blogPost")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to={"/admin/agreements"}>
                  {t("Agreements")}
                </Button>
              </>
            )}

            {user?.role === "Agent" && (
              <>
                <Button sx={navBtnStyle} color="inherit" component={Link} to="/job/post">
                  {t("AddWorker")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to="/job/me">
                  {t("MyWorkers")}
                </Button>
              </>
            )}

            {(user?.role === "Agent" || user?.role === "SelfWorker") && (
              <>
                <Button sx={navBtnStyle} color="inherit" component={Link} to="/payout">
                  {t("Payout")}
                </Button>
                <Button sx={navBtnStyle} color="inherit" component={Link} to="/agent-benefits">
                  {t("Benefits")}
                </Button>
              </>
            )}

            {user?.role === "Employer" && (
              <>
                <Button sx={navBtnStyle} color="inherit" component={Link} to="/payout">
                  {t("transaction")}
                </Button>
              </>
            )}

            <Button sx={navBtnStyle} color="inherit" component={Link} to={"/my/profile"}>
              {t("MyProfile")}
            </Button>
            <Button sx={navBtnStyle} color="inherit" onClick={handleLogout}>
              <a>{t("Logout")}</a>
            </Button>

            {isAuthorized && (
              <>
                <Select
                  value={lang}
                  onChange={handleLanguageChange}
                  displayEmpty
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.96)",
                    borderRadius: "999px",
                    mr: 1,
                    maxWidth: 84,
                    fontSize: 14,
                    fontWeight: 700,
                    minHeight: 36,
                    boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
                    "& .MuiSelect-select": {
                      overflow: "visible !important",
                      whiteSpace: "normal",
                      textOverflow: "unset",
                      py: 0.7,
                    },
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">हिन्दी</MenuItem>
                  <MenuItem value="mr">मराठी</MenuItem>
                  <MenuItem value="gu">ગુજરાતી</MenuItem>
                </Select>

                <Avatar
                  src={
                    user?.profilePhoto
                      ? `${config.FILE_BASE_URL}/${user.profilePhoto}`.replace(
                          /([^:]\/)\/+/g,
                          "$1"
                        )
                      : ""
                  }
                  alt={user?.name || "Profile"}
                  sx={{
                    width: 34,
                    height: 34,
                    border: "2px solid rgba(255,255,255,0.85)",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
                  }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Button sx={navBtnStyle} color="inherit" component={Link} to={"/login"}>
              Login
            </Button>
            <Button sx={navBtnStyle} color="inherit" component={Link} to={"/register"}>
              Register
            </Button>
          </>
        )}
      </Box>
    </Toolbar>
  </AppBar>

  {/* Drawer */}
  <Drawer
    PaperProps={{
      sx: {
        width: 320,
        height: "auto",
        maxHeight: "100vh",
        marginTop: 1,
        borderRadius: "18px 0 0 18px",
        borderLeft: "1px solid #e2e8f0",
        boxShadow: "-12px 0 30px rgba(15, 23, 42, 0.12)",
        overflow: "hidden",
      },
    }}
    anchor="right"
    open={openDrawer}
    onClose={toggleDrawer}
  >
    <Box
      sx={{
        width: 320,
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        padding: "16px",
        height: "100%",
      }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      {isAuthorized ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              px: 0.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                marginTop: 1,
                color: "#64748b",
                fontWeight: 700,
                letterSpacing: ".02em",
              }}
            >
              {t("Navigation")}
            </Typography>
            <IconButton
              onClick={toggleDrawer}
              sx={{
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Button fullWidth startIcon={<Home />} sx={drawerBtnStyle} component={Link} to="/Dashboard">
            {t("home")}
          </Button>

          {user && (user.role === "Admin" || user.role === "SuperAdmin") && (
            <>
              <Button fullWidth startIcon={<People />} color="inherit" sx={drawerBtnStyle} component={Link} to={"/job/getall"}>
                {t("All")}
              </Button>
              <Button fullWidth startIcon={<People />} sx={drawerBtnStyle} component={Link} to="users/unveryfied">
                {t("Users")}
              </Button>
              <Button fullWidth startIcon={<People />} sx={drawerBtnStyle} component={Link} to="/users/leads">
                {t("Leads")}
              </Button>
              <Button fullWidth startIcon={<MdArticle />} sx={drawerBtnStyle} component={Link} to="/blogpost">
                {t("BlogPost")}
              </Button>
            </>
          )}

          {user && user.role === "Agent" && (
            <>
              <Button fullWidth startIcon={<AddCircle />} sx={drawerBtnStyle} component={Link} to="/job/post">
                {t("AddWorker")}
              </Button>
              <Button fullWidth startIcon={<Work />} sx={drawerBtnStyle} component={Link} to="/job/me">
                {t("MyWorkers")}
              </Button>
            </>
          )}

          {user && (user.role === "Agent" || user.role === "SelfWorker") && (
            <>
              <Button fullWidth startIcon={<RequestQuote />} sx={drawerBtnStyle} component={Link} to="/payout">
                {t("Payout")}
              </Button>
              <Button fullWidth startIcon={<EmojiEvents />} sx={drawerBtnStyle} component={Link} to="/agent-benefits">
                {t("Benefits")}
              </Button>
            </>
          )}

          {user && user.role === "Employer" && (
            <>
              <Button fullWidth startIcon={<RequestQuote />} sx={drawerBtnStyle} component={Link} to="/payout">
                {t("transaction")}
              </Button>
            </>
          )}

          <Typography
            variant="subtitle2"
            sx={{
              marginTop: 2,
              color: "#64748b",
              fontWeight: 700,
              letterSpacing: ".02em",
              px: 0.5,
            }}
          >
            {t("Account")}
          </Typography>

          <Button fullWidth startIcon={<Person />} sx={drawerBtnStyle} component={Link} to="/my/profile">
            {t("MyProfile")}
          </Button>
          <Button fullWidth startIcon={<Logout />} sx={drawerBtnStyle} onClick={handleLogout}>
            <a>{t("Logout")}</a>
          </Button>
          <Button
            fullWidth
            startIcon={<SupportAgent />}
            sx={{
              ...drawerBtnStyle,
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
          <Button fullWidth startIcon={<Person />} sx={drawerBtnStyle} component={Link} to="/login">
            Login
          </Button>
          <Button fullWidth startIcon={<Person />} sx={drawerBtnStyle} component={Link} to="/register">
            Register
          </Button>

          <Button
            fullWidth
            startIcon={<SupportAgent />}
            sx={{
              ...drawerBtnStyle,
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

  {/* Bottom Navigation */}
  <Box
    sx={{
      display: { xs: "block", sm: "block" },
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: "transparent",
    }}
  >
    {isAuthorized ? (
      <Box
        sx={{
          px: 0.8,
          pb: 0.8,
        }}
      >
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          showLabels
          sx={{
            minWidth: 53,
            borderRadius: "18px",
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
            boxShadow: "0 -8px 30px rgba(15, 23, 42, 0.20)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <BottomNavigationAction
            icon={<Home sx={{ color: "white" }} />}
            component={Link}
            to="/Dashboard"
            label={t("home")}
            sx={bottomNavItemStyle}
          />

          {user && user.role === "Admin" && (
            <BottomNavigationAction
              icon={<People sx={{ color: "white" }} />}
              component={Link}
              to={"/users/unveryfied"}
              label="Users"
              sx={bottomNavItemStyle}
            />
          )}

          {user && user.role === "Agent" && (
            <>
              <BottomNavigationAction
                icon={<AddCircle sx={{ color: "white" }} />}
                component={Link}
                to="/job/post"
                sx={bottomNavItemStyle}
                label={t("Add")}
              />

              <BottomNavigationAction
                icon={<Work sx={{ color: "white" }} />}
                component={Link}
                to="/job/me"
                sx={bottomNavItemStyle}
                label={t("Workers")}
              />
            </>
          )}

          <BottomNavigationAction
            icon={<Person sx={{ color: "white" }} />}
            component={Link}
            to="/my/profile"
            sx={bottomNavItemStyle}
            label={t("Profile")}
          />

          <BottomNavigationAction
            icon={<Logout sx={{ color: "white" }} />}
            component={Link}
            onClick={handleLogout}
            sx={bottomNavItemStyle}
            label={t("Logout")}
          />
        </BottomNavigation>
      </Box>
    ) : (
      <Box
        sx={{
          bgcolor: "rgb(0 13 37)",
          mt: 0,
          textAlign: "center",
          py: 0.8,
        }}
      >
        <Typography variant="body2" sx={{ color: "white" }}>
          © {new Date().getFullYear()} <strong>BookMyWorker</strong>. All Rights
          Reserved
        </Typography>
      </Box>
    )}
  </Box>
</>
  );
};

export default Navbar;

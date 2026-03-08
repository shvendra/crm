import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Select,
  FormControl,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
 
  const menuItems = [
    { name: "Home", link: "#hero" },
    { name: t("aboutUs"), link: "#about" },
    { name: t("services"), link: "#services" },
    { name: t("contactUs"), link: "#contact" },
    { name: t("blogPost"), link: "/blogs" },
  ];

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        zIndex: 1000,
        backgroundColor: "#1a76d2", // ✅ Keep your blue header
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            color: "white",
          }}
        >
          <img
            src="/app/logo.jpg"
            alt="BookMyWorker"
            style={{ height: 54, width: 48 }}
          />

          {/* <Box sx={{ lineHeight: 1 }}>
            <Box sx={{ fontWeight: "bolder" }}>BookMyWorker</Box>
            <Box
              sx={{
                fontSize: 9,
                fontWeight: "bolder",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Trusted workforce solutions in india
            </Box>
          </Box> */}
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {menuItems.map((item) =>
            item.link.startsWith("/") ? (
              <Button
                key={item.name}
                component={Link}
                to={item.link}
                sx={{
                  color: "#fff",
                  textTransform: "capitalize",
                  fontSize: "0.9rem",
                  borderRadius: "20px",
                  px: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                {item.name}
              </Button>
            ) : (
              <Button
                key={item.name}
                component="a"
                href={item.link}
                sx={{
                  color: "#fff",
                  textTransform: "capitalize",
                  fontSize: "0.9rem",
                  borderRadius: "20px",
                  px: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                {item.name}
              </Button>
            ),
          )}
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            href="/login"
            sx={{
              color: "#fff",
              borderColor: "#fff",
              borderRadius: "25px",
              fontSize: "0.85rem",
              px: 2,
              py: 0.5,
              textTransform: "capitalize",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                borderColor: "#fff",
              },
            }}
          >
            {t("login")}
          </Button>

          <Button
            variant="contained"
            href="/landing"
            sx={{
              backgroundColor: "#fff",
              color: "#1a76d2",
              borderRadius: "25px",
              fontSize: "0.85rem",
              px: 2,
              py: 0.5,
              textTransform: "capitalize",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#e6e6e6",
              },
            }}
          >
            {t("getStartedForfree")}
          </Button>

          <FormControl size="small" variant="outlined">
            <Select
              value={i18n.language}
              onChange={handleLanguageChange}
              sx={{
                backgroundColor: "white",
                borderRadius: "20px",
                height: 35,
                fontSize: "0.85rem",
                fontWeight: 500,
                px: 1,
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="hi">हि</MenuItem>
              <MenuItem value="mr">म</MenuItem>
              <MenuItem value="gu">ગુ</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Mobile Menu Icon */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
            <MenuIcon sx={{ color: "#fff", fontSize: 26 }} />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(10px)",
            width: "80vw",
            maxWidth: 320,
            borderRadius: "12px 0 0 12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a76d2" }}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon sx={{ color: "#1a76d2" }} />
          </IconButton>
        </Box>

        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.name}
              onClick={() => setMobileOpen(false)}
              component={item.link.startsWith("/") ? Link : "a"}
              to={item.link.startsWith("/") ? item.link : undefined}
              href={item.link.startsWith("/") ? undefined : item.link}
            >
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  color: "#1a76d2",
                  fontWeight: 500,
                  fontSize: "1rem",
                  textTransform: "capitalize",
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            href="/login"
            sx={{
              borderColor: "#1a76d2",
              color: "#1a76d2",
              borderRadius: "25px",
              mb: 1.5,
              textTransform: "capitalize",
              fontWeight: 600,
            }}
          >
            {t("login")}
          </Button>

          <Button
            fullWidth
            variant="contained"
            href="/landing"
            sx={{
              backgroundColor: "#1a76d2",
              color: "#fff",
              borderRadius: "25px",
              textTransform: "capitalize",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#155fa8",
              },
            }}
          >
            {t("getStartedForfree")}
          </Button>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={i18n.language}
              onChange={handleLanguageChange}
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "20px",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिन्दी</MenuItem>
              <MenuItem value="mr">मराठी</MenuItem>
              <MenuItem value="gu">ગુજરાતી</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;

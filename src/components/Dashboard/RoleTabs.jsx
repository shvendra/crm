import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import config from "../../config";
import { useTranslation } from "react-i18next";
import { Context } from "../../main";

const RoleTabs = ({ availableRoles, currentUser, setUser }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthorized, user } = useContext(Context);

  // Filter only valid roles
  const validRoles = (availableRoles || []).filter((role) =>
    ["Agent", "Employer", "SelfWorker"].includes(role)
  );

  // Hide if no valid roles found or only one role
  if (validRoles.length <= 1) return null;

  const [currentRole, setCurrentRole] = useState(currentUser.role);

  const handleRoleChange = async (e, newRole) => {
    if (!currentUser?.phone) {
      toast.error("User phone is missing.");
      return;
    }

    if (newRole === currentRole) return;

    try {
      const freshRes = await axios.post(
        `${config.API_BASE_URL}/api/v1/user/setrole`,
        { role: newRole, phone: currentUser.phone },
        { withCredentials: true }
      );

      if (freshRes?.data?.user) {
        setUser(freshRes.data.user);
        setCurrentRole(newRole);
        toast.success(`Switched to ${newRole}`);
      } else {
        toast.error("Failed to fetch updated user info.");
      }
    } catch (error) {
      console.error("Error switching role:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while switching role."
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "transparent",
        borderRadius: "20px",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* <Divider sx={{ width: "80%", mb: "4px", mt: "4px", opacity: 0.4 }} /> */}

      {/* Role Switcher */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          bgcolor: "rgba(255,255,255,0.5)",
          borderRadius: "12px",
          p: 0.5,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* {isMobile ? (
          <Select
            value={currentRole}
            onChange={(e) => handleRoleChange(e, e.target.value)}
            size="small"
            sx={{
              maxHeight: 22,
              borderRadius: "20px",
              fontSize: "0.85rem",
              bgcolor: "#f2f2f2",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            {validRoles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Tabs
            value={currentRole}
            onChange={handleRoleChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              minHeight: "34px",
              "& .MuiTabs-flexContainer": { alignItems: "center" },
              "& .MuiTab-root": {
                minWidth: 80,
                px: 1,
                py: 0.2,
                borderRadius: "20px",
                fontWeight: 600,
                textTransform: "capitalize",
                fontSize: "0.8rem",
                lineHeight: 1.2,
                mx: 0.4,
                transition: "all 0.25s ease",
                color: "#777",
                backgroundColor: "#f2f2f2",
                minHeight: "28px",
              },
              "& .Mui-selected": {
                backgroundColor: "#1976d2",
                color: "#fff !important",
                boxShadow: "0 2px 8px rgba(25,118,210,0.25)",
              },
              "& .MuiTab-root:hover": {
                backgroundColor: "rgba(25,118,210,0.12)",
              },
            }}
          >
            {validRoles.map((role) => (
              <Tab
                key={role}
                value={role}
                label={
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {role}
                    </Typography>
                  </motion.div>
                }
              />
            ))}
          </Tabs>
        )} */}
         <Tabs
            value={currentRole}
            onChange={handleRoleChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              minHeight: "34px",
              "& .MuiTabs-flexContainer": { alignItems: "center" },
              "& .MuiTab-root": {
                minWidth: 80,
                px: 1,
                py: 0.2,
                borderRadius: "20px",
                fontWeight: 600,
                textTransform: "capitalize",
                fontSize: "0.8rem",
                lineHeight: 1.2,
                mx: 0.4,
                transition: "all 0.25s ease",
                color: "#777",
                backgroundColor: "#f2f2f2",
                minHeight: "28px",
              },
              "& .Mui-selected": {
                backgroundColor: "#1976d2",
                color: "#fff !important",
                boxShadow: "0 2px 8px rgba(25,118,210,0.25)",
              },
              "& .MuiTab-root:hover": {
                backgroundColor: "rgba(25,118,210,0.12)",
              },
            }}
          >
            {validRoles.map((role) => (
              <Tab
                key={role}
                value={role}
                label={
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {role}
                    </Typography>
                  </motion.div>
                }
              />
            ))}
          </Tabs>
      </Box>
    </Box>
  );
};

export default RoleTabs;

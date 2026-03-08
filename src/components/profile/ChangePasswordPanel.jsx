// components/ChangePasswordPanel.jsx
import React from "react";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const ChangePasswordPanel = ({
  userData,
  setUserData,
  showPassword,
  setShowPassword,
}) => {
  const { t } = useTranslation();

  const toggleShowPassword = () => setShowPassword((show) => !show);

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 4,
        // p: 1,
        background: "#ffffff",
        // boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        mb: 2,
        position: "relative",
        overflow: "hidden",
        // backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <CardContent sx={{ zIndex: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("OldPassword")}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              size="small"
              onChange={(e) =>
                setUserData((prevState) => ({
                  ...prevState,
                  oldPassword: e.target.value,
                }))
              }
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? t("HidePassword") : t("ShowPassword")
                      }
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("NewPassword")}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              size="small"
              value={userData?.newPassword || ""}
              onChange={(e) =>
                setUserData((prevState) => ({
                  ...prevState,
                  newPassword: e.target.value,
                }))
              }
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? t("HidePassword") : t("ShowPassword")
                      }
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("ConfirmNewPassword")}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              size="small"
              value={userData?.confirmPassword || ""}
              onChange={(e) =>
                setUserData((prevState) => ({
                  ...prevState,
                  confirmPassword: e.target.value,
                }))
              }
              autoComplete="new-password"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordPanel;

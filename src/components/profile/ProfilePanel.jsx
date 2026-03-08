import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Card,
  Divider,
  Grid,
  CardContent,
  Box,
  Button,
  Avatar,
  Dialog,
  DialogContent,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { User, Phone, Home, BadgeCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HardHat } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import config from "../../config";

function ProfilePanel({ userData, user, profilePreview, handleFileChange }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); // State to simulate loading
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);

  const handleUploadClick = useCallback(() => {
    if (window.FlutterWebViewChannel) {
      window.FlutterWebViewChannel.postMessage("pickProfilePhoto");
    } else {
      document.getElementById("fileInput")?.click();
    }
  }, []);

  const handleInputChange = useCallback(
    (e) => handleFileChange(e, "profilePhoto"),
    [handleFileChange],
  );
  const handleOpen = () => setOpenVerifyDialog(true);
  const handleClose = () => setOpenVerifyDialog(false);
  const addressText =
    [
      ...(Array.isArray(userData?.addresses) ? userData.addresses : []),
      userData?.district,
      userData?.state,
    ]
      .filter(Boolean)
      .join(", ") || "N/A";
  const avatarSrc =
    profilePreview ||
    (typeof userData?.profilePhoto === "string"
      ? `${config.API_BASE_URL}/${userData.profilePhoto}`
      : null);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const totalAmount = user.role === "Agent" ? 199 : 49; // ✅ fixed amount
      const gstCharges = 0; // ❌ no GST

      const response = await axios.post(
        `${config.API_BASE_URL}/api/v1/payment/add-trans`,
        {
          employerId: user?._id,
          firstName: user?.name || "",
          email: user?.email || "",
          employer_phone: user?.phone || "",
          paymentType: "verifiedbadge", // ✅ updated payment type
          amount: totalAmount,
          gstCharges,
          productName: "Verified Badge",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (response.data?.url) {
        localStorage.setItem("pendingOrderId", response.data.merchantOrderId);

        setTimeout(() => {
          window.open(response.data.url, "_self");
        }, 500);
      } else {
        toast.error("Payment URL not received");
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
      toast.error("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 1,
        position: "relative",
        overflow: "hidden",
        boxShadow: 1,
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        "&::before": {
          content: '"BookMyWorker"',
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "2.5rem",
          fontWeight: 600,
          color: "rgba(0, 0, 0, 0.04)",
          zIndex: 0,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        },
      }}
      aria-label="User Profile Panel"
    >
      <Divider />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            elevation={3}
            sx={{
              borderRadius: "16px",
              background: "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                {/* Left Section */}
                <Grid item xs={9} sm={10}>
                  <Box>
                    {/* Name */}
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <User size={20} aria-hidden="true" />
                      <Typography variant="subtitle2" color="text.secondary">
                        {t("Name")}
                      </Typography>
                    </Box>
                    <Box>
                      {/* Name + Status */}
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                      >
                        <Typography
                          sx={{ color: "text.primary", fontWeight: 600 }}
                        >
                          {userData?.name || "N/A"}
                        </Typography>

                        {/* Status Badge */}
                        {userData?.role !== "Employer" && (
                        <Box
                          component="span"
                          sx={{
                            px: 1,
                            py: "2px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            borderRadius: "999px",
                            letterSpacing: "0.3px",
                            bgcolor: userData?.veryfiedBage
                              ? "success.light"
                              : "error.light",
                            color: userData?.veryfiedBage ? "white" : "white",
                          }}
                        >
                          {userData?.veryfiedBage ? "VERIFIED" : "UNVERIFIED"}
                        </Box>
                        )}
                      </Box>

                      {/* Get Verified CTA */}
                      {userData?.veryfiedBage === false &&
                        userData?.role !== "Employer" && (
                          <Box
                            display="inline-flex"
                            alignItems="center"
                            mt={0.5}
                            gap={0.5}
                            sx={{
                              cursor: "pointer",
                              color: "primary.main",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                color: "primary.dark",
                                transform: "translateX(2px)",
                              },
                            }}
                            onClick={handleOpen}
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption" fontWeight={600}>
                              {t("getVerifiedNow")}
                            </Typography>
                          </Box>
                        )}
                    </Box>

                    {/* Phone */}
                    <Box mt={2} display="flex" alignItems="center" gap={1}>
                      <Phone size={20} aria-hidden="true" />
                      <Typography variant="subtitle2" color="text.secondary">
                        {t("Phone")}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "gray", fontWeight: 600 }}>
                      {userData?.phone || "N/A"}
                    </Typography>

                    {/* Address */}
                    <Box mt={2} display="flex" alignItems="center" gap={1}>
                      <Home size={20} aria-hidden="true" />
                      <Typography variant="subtitle2" color="text.secondary">
                        {t("Address")}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "gray", fontWeight: 600 }}>
                      {addressText}
                    </Typography>

                    {/* Categories */}
                    {user?.role === "Agent" && (
                      <>
                        {/* Worker Categories */}
                        <Box mt={2} display="flex" alignItems="center" gap={1}>
                          <HardHat size={20} aria-hidden="true" />
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            {t("WorkerCategories")}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "gray", fontWeight: 600 }}>
                          {Array.isArray(userData?.categories) &&
                          userData.categories.length > 0
                            ? userData.categories.join(", ")
                            : "NA"}
                        </Typography>

                        {/* Service Areas */}
                        <Box mt={2} display="flex" alignItems="center" gap={1}>
                          <BadgeCheck size={20} aria-hidden="true" />
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            {t("ServiceableArea")}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "gray", fontWeight: 600 }}>
                          {Array.isArray(userData?.serviceArea) &&
                          userData.serviceArea.length > 0
                            ? userData.serviceArea.join(", ")
                            : "NA"}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>

                {/* Right Section */}
                <Grid item xs={3} sm={2}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    {userData?.veryfiedBage ? (
                      /* ===== VERIFIED BADGE DESIGN ===== */
                      <Box
                        sx={{
                          position: "relative",
                          p: 1,
                          borderRadius: "50%",
                          backdropFilter: "blur(12px)",
                          background: "rgba(255,255,255,0.25)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                        }}
                      >
                        <Avatar
                          src={avatarSrc}
                          sx={{
                            width: 80,
                            height: 80,
                            border: userData?.veryfiedBage
                              ? "3px solid #4caf50"
                              : "2px solid #1976d2",
                          }}
                        />

                        {/* Floating VERIFIED tag */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -10,
                            background:
                              "linear-gradient(135deg, #43cea2, #185a9d)",
                            px: 1.2,
                            py: 0.4,
                            borderRadius: 12,
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                            boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                          }}
                        >
                          VERIFIED
                        </Box>

                        {/* Check icon */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            backgroundColor: "#185a9d",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid white",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          ✔
                        </Box>
                      </Box>
                    ) : (
                      /* ===== NORMAL (NOT VERIFIED) AVATAR ===== */

                      <Avatar
                        src={avatarSrc}
                        sx={{
                          width: 80,
                          height: 80,
                          border: userData?.veryfiedBage
                            ? "3px solid #4caf50"
                            : "2px solid #1976d2",
                        }}
                      />
                    )}

                    <Button
                      variant="outlined"
                      onClick={handleUploadClick}
                      aria-label={t("Upload")}
                      size="small"
                    >
                      {t("Upload")}
                    </Button>
                    <input
                      id="fileInput"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={openVerifyDialog}
        onClose={() => setOpenVerifyDialog(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "auto", // removes calc(100% - 64px)
            maxWidth: "1200px", // or any value you want
            m: "7px",
          },
        }}
      >
        {" "}
        <DialogContent sx={{ textAlign: "center", p: 2 }}>
          {/* <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 1
        }}
      >
        <Button
          size="small"
          variant={popupLang === "hi" ? "contained" : "outlined"}
          onClick={() => setPopupLang("hi")}
        >
          हिंदी
        </Button>
      
        <Button
          size="small"
          variant={popupLang === "en" ? "contained" : "outlined"}
          onClick={() => setPopupLang("en")}
        >
          EN
        </Button>
      </Box> */}

          {/* Badge Icon */}

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
            <Box
              sx={{
                position: "relative",
                p: 1,
                borderRadius: "50%",
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.25)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              }}
            >
              <Avatar
                src="/usericon.png"
                sx={{
                  width: 80,
                  height: 80,
                  border: "3px solid #4caf50",
                }}
              />

              {/* Floating Verified Tag */}
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -10,
                  background: "linear-gradient(135deg, #43cea2, #185a9d)",
                  px: 1.2,
                  py: 0.4,
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                }}
              >
                VERIFIED
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  backgroundColor: "#4caf50",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid white",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                ✔
              </Box>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            {t("getVerifiedSubtitle")}
          </Typography>

          <Typography fontWeight={600}>{t("whyGetVerified")}</Typography>

          {/* Benefits */}
          <Box sx={{ textAlign: "left", mt: 2 }}>
           <ul className="no-bullets">
  <li>{t("verifiedBenefits.b1")}</li>
  <li>{t("verifiedBenefits.b2")}</li>
  <li>{t("verifiedBenefits.b3")}</li>
  <li>{t("verifiedBenefits.b4")}</li>
  <li>{t("verifiedBenefits.b5")}</li>
  <li>{t("verifiedBenefits.b6")}</li>
    <li>{t("verifiedBenefits.b7")}</li>
  <li>{t("verifiedBenefits.b8")}</li>

</ul>
          </Box>


{/* Price */}
<Box
  sx={{
    mt: 2,
    p: 1.5,
    borderRadius: 2,
    bgcolor: "#e8f5e9",
    fontWeight: 700,
    color: "success.main",
    display: "flex",
    alignItems: "center",
    gap: 1,
  }}
>
  {t("verifiedFeeBox")}

  {user?.role === "Agent" ? (
    <>
      {/* Old price */}
      <span
        style={{
          textDecoration: "line-through",
          color: "#9e9e9e",
          fontWeight: 500,
        }}
      >
        ₹499
      </span>

      {/* New price */}
      <span
        style={{
          color: "#2e7d32",
          fontWeight: 800,
          fontSize: "1.1rem",
        }}
      >
        ₹199
      </span>
    </>
  ) : (
<>      <span
        style={{
          textDecoration: "line-through",
          color: "#9e9e9e",
          fontWeight: 500,
        }}
      >
        ₹199
      </span>
    <span
      style={{
        color: "#2e7d32",
        fontWeight: 800,
        fontSize: "1.1rem",
      }}
    >
      ₹49
    </span>
    </>
  )}
</Box>


          <Typography
            variant="caption"
            display="block"
            mt={1}
            color="text.secondary"
          >
            {t("verifiedFeeNote")}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={handleClose}>
              {t("maybeLater")}
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handlePayment}
            >
              {t("getVerifiedNow")}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

ProfilePanel.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string,
    status: PropTypes.string,
    serviceArea: PropTypes.arrayOf(PropTypes.string),
    categories: PropTypes.arrayOf(PropTypes.string),
    phone: PropTypes.string,
    addresses: PropTypes.arrayOf(PropTypes.string),
    district: PropTypes.string,
    state: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    profilePhoto: PropTypes.string,
  }),
  // config: PropTypes.shape({
  //   API_BASE_URL: PropTypes.string,
  // }).isRequired,
  profilePreview: PropTypes.string,
  handleFileChange: PropTypes.func.isRequired,
};

ProfilePanel.defaultProps = {
  user: null,
  profilePreview: "",
};

export default React.memo(ProfilePanel);

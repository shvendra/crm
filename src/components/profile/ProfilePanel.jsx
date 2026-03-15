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
      width: "100%",
      maxWidth: "980px",
      m: { xs: 2, md: 3 },
      borderRadius: "28px",
      overflow: "hidden",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
      boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
      border: "1px solid rgba(148, 163, 184, 0.18)",
    },
  }}
>
  <DialogContent sx={{ p: 0 }}>
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(255,255,255,0.10), transparent 30%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            gap: 3,
          }}
        >
          {/* Left: Avatar + badge */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minWidth: { md: 170 },
            }}
          >
            <Box
              sx={{
                position: "relative",
                p: 1.2,
                borderRadius: "50%",
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
              }}
            >
              <Avatar
                src="/usericon.png"
                sx={{
                  width: 96,
                  height: 96,
                  border: "4px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -14,
                  background:
                    "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "999px",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: ".05em",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.28)",
                }}
              >
                VERIFIED
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  border: "3px solid #fff",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.24)",
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                ✔
              </Box>
            </Box>
          </Box>

          {/* Right: Content */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Typography
              sx={{
                fontSize: { xs: "1.65rem", md: "2.1rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                mb: 1,
              }}
            >
              {t("getVerifiedNow")}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: ".95rem", md: "1rem" },
                color: "rgba(255,255,255,0.84)",
                maxWidth: 620,
                mx: { xs: "auto", md: 0 },
              }}
            >
              {t("getVerifiedSubtitle")}
            </Typography>

            <Box
              sx={{
                mt: 2.5,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.9,
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.16)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "#4ade80",
                }}
              />
              <Typography sx={{ fontSize: ".88rem", fontWeight: 600 }}>
                {t("whyGetVerified")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>

    {/* Body */}
    <Box
      sx={{
        px: { xs: 2.5, md: 4 },
        py: { xs: 2.5, md: 3.5 },
        background:
          "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Benefits */}
        <Box
          sx={{
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            background: "#fff",
            p: { xs: 2, md: 2.5 },
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.02rem",
              fontWeight: 700,
              color: "#0f172a",
              mb: 2,
            }}
          >
            {t("whyGetVerified")}
          </Typography>

          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "grid",
              gap: 1.2,
            }}
          >
            {[
              t("verifiedBenefits.b1"),
              t("verifiedBenefits.b2"),
              t("verifiedBenefits.b3"),
              t("verifiedBenefits.b4"),
              t("verifiedBenefits.b5"),
              t("verifiedBenefits.b6"),
              t("verifiedBenefits.b7"),
              t("verifiedBenefits.b8"),
            ].map((item, index) => (
              <Box
                component="li"
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.2,
                  p: 1.2,
                  borderRadius: "14px",
                  background:
                    "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box
                  sx={{
                    minWidth: 24,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 800,
                    mt: "2px",
                    boxShadow: "0 6px 14px rgba(34,197,94,0.25)",
                  }}
                >
                  ✓
                </Box>
                <Typography
                  sx={{
                    color: "#334155",
                    fontSize: ".95rem",
                    lineHeight: 1.55,
                    fontWeight: 500,
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Price card */}
        <Box
          sx={{
            borderRadius: "22px",
            overflow: "hidden",
            border: "1px solid #dbeafe",
            background: "#fff",
            boxShadow: "0 12px 34px rgba(37, 99, 235, 0.08)",
          }}
        >
          <Box
            sx={{
              p: 2.2,
              background:
                "linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)",
              borderBottom: "1px solid #dbeafe",
            }}
          >
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#0f172a",
                mb: 0.5,
              }}
            >
              {t("verifiedFeeBox")}
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: ".92rem",
              }}
            >
              Unlock premium trust and better response from employers.
            </Typography>
          </Box>

          <Box sx={{ p: 2.4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 1.2,
                flexWrap: "wrap",
                mb: 1.2,
              }}
            >
              {user?.role === "Agent" ? (
                <>
                  <Typography
                    component="span"
                    sx={{
                      textDecoration: "line-through",
                      color: "#94a3b8",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                    }}
                  >
                    ₹499
                  </Typography>

                  <Typography
                    component="span"
                    sx={{
                      color: "#15803d",
                      fontWeight: 900,
                      fontSize: { xs: "2rem", md: "2.35rem" },
                      lineHeight: 1,
                    }}
                  >
                    ₹199
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    component="span"
                    sx={{
                      textDecoration: "line-through",
                      color: "#94a3b8",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                    }}
                  >
                    ₹199
                  </Typography>

                  <Typography
                    component="span"
                    sx={{
                      color: "#15803d",
                      fontWeight: 900,
                      fontSize: { xs: "2rem", md: "2.35rem" },
                      lineHeight: 1,
                    }}
                  >
                    ₹49
                  </Typography>
                </>
              )}
            </Box>

            <Typography
              sx={{
                color: "#475569",
                fontSize: ".9rem",
                lineHeight: 1.6,
              }}
            >
              {t("verifiedFeeNote")}
            </Typography>

            <Box
              sx={{
                mt: 2.2,
                p: 1.4,
                borderRadius: "16px",
                background:
                  "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                border: "1px dashed #cbd5e1",
              }}
            >
              <Typography
                sx={{
                  fontSize: ".9rem",
                  color: "#334155",
                  fontWeight: 600,
                  mb: 0.6,
                }}
              >
                What you get:
              </Typography>
              <Typography sx={{ fontSize: ".88rem", color: "#64748b" }}>
                Verified badge, better visibility, more trust, stronger profile
                impression, and higher chances of getting direct connections.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mt: 3,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                sx={{
                  height: 48,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#cbd5e1",
                  color: "#334155",
                }}
              >
                {t("maybeLater")}
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={handlePayment}
                sx={{
                  height: 48,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                  boxShadow: "0 14px 30px rgba(34,197,94,0.26)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
                  },
                }}
              >
                {t("getVerifiedNow")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
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

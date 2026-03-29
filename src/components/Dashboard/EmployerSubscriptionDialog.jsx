import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useNavigate } from "react-router-dom";
import config from "../../config";

export default function EmployerSubscriptionDialog({
  open,
  onClose,
  user,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showBenefits, setShowBenefits] = useState(false);

const [hasActiveSubscription, setHasActiveSubscription] = useState(true);

useEffect(() => {
  // 1. If there's no user yet, we don't need a timer
  if (!user) {
    setHasActiveSubscription(false);
    return;
  }

  // 2. Set a timer for 10 seconds (10,000 ms)
  const timer = setTimeout(() => {
    const isEmployerWithoutSub = user?.isSubscribed === false && user?.role === "Employer";
    
    if (isEmployerWithoutSub) {
      setHasActiveSubscription(false);
    } else {
      setHasActiveSubscription(true);
    }
  }, 10000);

  // 3. Cleanup: clear the timer if the component unmounts or user changes
  return () => clearTimeout(timer);
}, [user]);


  useEffect(() => {
    if (!isMobile) {
      setShowBenefits(true);
    } else {
      setShowBenefits(false);
    }
  }, [isMobile]);

  if (hasActiveSubscription) return null;

  const handleGoToPricing = () => {
    onClose?.();
    navigate("/pricing");
  };

  const benefits = [
    {
      icon: <TrendingUpRoundedIcon sx={{ fontSize: 18 }} />,
      title: "Get more worker responses",
      subtitle:
        "Subscribed employers get better visibility and faster engagement from agents and workers.",
    },
    {
      icon: <VerifiedRoundedIcon sx={{ fontSize: 18 }} />,
      title: "Build stronger trust",
      subtitle:
        "A premium employer profile looks more serious, reliable, and ready to hire.",
    },
    {
      icon: <BoltRoundedIcon sx={{ fontSize: 18 }} />,
      title: "Post requirements with more impact",
      subtitle:
        "Your hiring requirements stand out better, helping you fill urgent needs faster.",
    },
    {
      icon: <Groups2RoundedIcon sx={{ fontSize: 18 }} />,
      title: "Reach better matching workers",
      subtitle:
        "Increase chances of connecting with relevant skilled and unskilled workers.",
    },
    {
      icon: <CampaignRoundedIcon sx={{ fontSize: 18 }} />,
      title: "Priority presence on platform",
      subtitle:
        "Boost your employer brand and improve visibility when workers browse opportunities.",
    },
    // {
    //   icon: <StarRoundedIcon sx={{ fontSize: 18 }} />,
    //   title: "Serious hiring advantage",
    //   subtitle:
    //     "A subscription signals commitment and improves conversion from enquiry to hiring.",
    // },
  ];

  return (
    <Dialog
      open={open && !hasActiveSubscription}
      onClose={onClose}
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
              "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #06b6d4 100%)",
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
              position: "absolute",
              top: -30,
              right: -30,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              filter: "blur(4px)",
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
    src={
              user?.profilePhoto
                ? `${config.FILE_BASE_URL}/${user.profilePhoto}`.replace(
                    /([^:]\/)\/+/g,
                    "$1"
                  )
                : ""
            }                    alt={user?.companyName || user?.name || "Employer"}
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
                      right: -16,
                    }}
                  >
                    <Chip
                      icon={
                        <WorkspacePremiumRoundedIcon
                          sx={{ color: "#fff !important", fontSize: 16 }}
                        />
                      }
                      label="PREMIUM"
                      sx={{
                        height: 30,
                        color: "#fff",
                        fontWeight: 800,
                        letterSpacing: ".04em",
                        background:
                          "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                        boxShadow: "0 8px 18px rgba(0,0,0,0.28)",
                        "& .MuiChip-label": { px: 1.2 },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      border: "3px solid #fff",
                      boxShadow: "0 8px 18px rgba(0,0,0,0.24)",
                    }}
                  >
                    <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.65rem", md: "2.2rem" },
                    fontWeight: 800,
                    lineHeight: 1.15,
                    mb: 1,
                  }}
                >
                  Upgrade Your Hiring Power
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: ".96rem", md: "1rem" },
                    color: "rgba(255,255,255,0.84)",
                    maxWidth: 650,
                    mx: { xs: "auto", md: 0 },
                  }}
                >
                  Get more visibility, stronger trust, and faster hiring results.
                  A subscription helps employers attract better responses and
                  improve conversion from requirement to successful hiring.
                </Typography>

                <Box
                  sx={{
                    mt: 2.2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-start" },
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    label="More visibility"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.18)",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label="Better trust"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.18)",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label="Faster hiring"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.18)",
                      fontWeight: 700,
                    }}
                  />
                </Box>

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
                    cursor: isMobile ? "pointer" : "default",
                  }}
                  onClick={() => isMobile && setShowBenefits(!showBenefits)}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#4ade80",
                    }}
                  />
                  <Typography sx={{ fontSize: ".88rem", fontWeight: 700 }}>
                    Why take subscription?{" "}
                    {isMobile && (showBenefits ? "▲" : "▼")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            px: { xs: 2.5, md: 4 },
            py: { xs: 2.5, md: 3.5 },
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
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
            {isMobile ? (
              <Collapse in={showBenefits} unmountOnExit>
                <Box
                  sx={{
                    borderRadius: "22px",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    p: 2,
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                  }}
                >
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
                    {benefits.map((item, index) => (
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
                            minWidth: 28,
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: "2px",
                            boxShadow: "0 6px 14px rgba(37,99,235,0.25)",
                          }}
                        >
                          {item.icon}
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              color: "#0f172a",
                              fontSize: ".96rem",
                              lineHeight: 1.4,
                              fontWeight: 700,
                              mb: 0.35,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: ".9rem",
                              lineHeight: 1.55,
                              fontWeight: 500,
                            }}
                          >
                            {item.subtitle}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Collapse>
            ) : (
              <Box
                sx={{
                  borderRadius: "22px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  p: { xs: 2, md: 2.5 },
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                }}
              >
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
                  {benefits.map((item, index) => (
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
                          minWidth: 28,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mt: "2px",
                          boxShadow: "0 6px 14px rgba(37,99,235,0.25)",
                        }}
                      >
                        {item.icon}
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            color: "#0f172a",
                            fontSize: ".96rem",
                            lineHeight: 1.4,
                            fontWeight: 700,
                            mb: 0.35,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: ".9rem",
                            lineHeight: 1.55,
                            fontWeight: 500,
                          }}
                        >
                          {item.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

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
                  Subscription gives your profile a hiring advantage
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: ".92rem",
                  }}
                >
                  Unlock premium employer benefits and move serious hiring faster.
                </Typography>
              </Box>

              <Box sx={{ p: 2.4 }}>
              

                <Typography
                  sx={{
                    color: "#475569",
                    fontSize: ".9rem",
                    lineHeight: 1.6,
                  }}
                >
                  Choose the best plan from the pricing page and start getting
                  stronger visibility, more trust, and better hiring performance.
                </Typography>

                <Box
                  sx={{
                    mt: 2.2,
                    p: 1.5,
                    borderRadius: "16px",
                    background:
                      "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                    border: "1px dashed #cbd5e1",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: ".92rem",
                      color: "#334155",
                      fontWeight: 700,
                      mb: 0.8,
                    }}
                  >
                    Why subscribe now?
                  </Typography>

                  <Box sx={{ display: "grid", gap: 0.7 }}>
                    <Typography sx={{ fontSize: ".88rem", color: "#64748b" }}>
                      • Improve profile credibility for agents and workers
                    </Typography>
                    <Typography sx={{ fontSize: ".88rem", color: "#64748b" }}>
                      • Increase chances of faster response on posted requirements
                    </Typography>
                    <Typography sx={{ fontSize: ".88rem", color: "#64748b" }}>
                      • Get a stronger presence compared to non-subscribed employers
                    </Typography>
                  </Box>
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
                    onClick={onClose}
                    sx={{
                      height: 48,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,
                      borderColor: "#cbd5e1",
                      color: "#334155",
                    }}
                  >
                    Maybe later
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleGoToPricing}
                    endIcon={<ArrowForwardRoundedIcon />}
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
                    View Pricing Plans
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
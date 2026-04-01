import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useTranslation } from "react-i18next";
import { Context } from '../main';
import axios from "axios";
import SubscriptionPatti from '../components/Dashboard/SubscriptionPatti';
import PricingBanner from './PricingBanner';
import { toast } from "react-toastify";
import config from "../config"; // adjust path if needed
const EMPLOYER_PRIORITY = ["industry", "agency", "contractor", "individual"];

const EMPLOYER_PRICING = {
  individual: { "1m": 199, "6m": 999, "12m": 1999 },
  contractor: { "1m": 599, "6m": 2900, "12m": 4999 },
  agency: { "1m": 599, "6m": 2900, "12m": 4999 },
  industry: { "1m": 999, "6m": 3999, "12m": 5999 },
};

const EMPLOYER_LABELS = {
  individual: "Individual Pricing Applied",
  contractor: "Contractor Pricing Applied",
  agency: "Agency Pricing Applied",
  industry: "Industry Pricing Applied",
};
const parsePrice = (price) => {
  if (price == null) return 0;

  if (typeof price === "number") return price;

  if (typeof price === "string") {
    return Number(price.replace(/[₹,]/g, ""));
  }

  return 0;
};

// Returns the employer type with the highest 1-month price
const getHighestEmployerType = (employerType) => {
  if (!employerType) return "individual";

  const activeTypes = EMPLOYER_PRIORITY.filter(
    (type) => employerType[type] === true
  );

  if (!activeTypes.length) return "individual";

  return activeTypes.reduce((prev, curr) =>
    parsePrice(EMPLOYER_PRICING[curr]["1m"]) >
    parsePrice(EMPLOYER_PRICING[prev]["1m"])
      ? curr
      : prev
  );
};



// Build plans dynamically based on highest employer type
const buildPlans = (employerType) => {
  const selectedType = getHighestEmployerType(employerType);
  const pricing = EMPLOYER_PRICING[selectedType];

  return [
    {
      id: "1m",
      title: "Starter",
      duration: "1 Month",
      price: `₹${pricing["1m"]}`,
      workers: 100,
      posts: 25,
      benefits: [
        "Filter workers by a specific location",
        "Access limited worker profiles",
        "Post basic job requirements",
        "Standard customer support",
      ],
    },
    {
      id: "6m",
      title: "Growth",
      duration: "6 Months",
      price: `₹${pricing["6m"]}`,
      workers: 800,
      posts: 50,
      popular: true,
      benefits: [
        "Filter workers from anywhere within your state",
        "Higher worker profile visibility",
        "Priority job post listing",
        "Faster support response",
      ],
    },
    {
      id: "12m",
      title: "Premium",
      duration: "12 Months",
      price: `₹${pricing["12m"]}`,
      workers: 1600,
      posts: 75,
      benefits: [
        "Filter workers from any location across India",
        "Maximum worker profile access",
        "Priority leads & faster matching",
        "Dedicated support from the BookMyWorker team",
        "Early access to new features",
      ],
    },
  ];
};

const PricingPage = () => {
  const { isAuthorized, user } = useContext(Context);
const [loading, setLoading] = useState(false);

const GST_RATE = config.GST_CHARGES; // example: 0.18
  const location = useLocation();
  const navigateTo = useNavigate();
  const { agentId } = location.state || {};
  const { t } = useTranslation();

  // Determine highest employer type
  const highestType = getHighestEmployerType(user?.employerType);
  const pricingLabel = EMPLOYER_LABELS[highestType];
const [isLimitExhausted, setIsLimitExhausted] = useState(user?.remainingContacts <= 0);

  // Build dynamic plans
  const plans = buildPlans(user?.employerType);
const handlePayment = async (plan) => {
  try {
    setLoading(true);

    // extract numeric price (₹ removed)
    const baseAmount = parsePrice(plan.price);

    const gstCharges = Number((baseAmount * GST_RATE).toFixed(2));
    const totalAmount = Number((baseAmount + gstCharges).toFixed(2));

    const response = await axios.post(
      `${config.API_BASE_URL}/api/v1/payment/add-trans`,
      {
        employerId: user?._id,
        firstName: user?.name || "",
        email: user?.email || "",
        employerType: getHighestEmployerType(user?.employerType) || "",
        employer_phone: user?.phone || "",
        paymentType: "subscription",
        amount: totalAmount,
        gstCharges,
        productName: `Subscription Plan - ${plan.duration}`,
        planId: plan.id,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (response.data?.url) {
      localStorage.setItem(
        "pendingOrderId",
        response.data.merchantOrderId
      );

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

    useEffect(() => {
      if (!isAuthorized) navigateTo('/landing');
      // if (user?.role === "Employer" && !user?.isSubscribed) {
      //   navigateTo("/Dashboard");
      // }
    }, [isAuthorized, navigateTo]);
    const isExpired = new Date(user?.subscriptionExpiry).getTime() <= Date.now();
return (
 <Box
  sx={{
    mt: "2px",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #f4f7fb 45%, #eef4ff 100%)",
    px: { xs: 1.5, sm: 2, md: 3 },
    py: { xs: 1.5, md: 2.2 },
  }}
>
  {/* Header */}
  <Box
    sx={{
      position: "sticky",
      top: 10,
      zIndex: 100,
      maxWidth: 1180,
      mx: "auto",
      mb: { xs: 2.2, md: 3 },
      px: { xs: 1.5, md: 2 },
      py: 1.4,
      borderRadius: "22px",
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1px solid rgba(226,232,240,0.9)",
      boxShadow: "0 10px 35px rgba(15, 23, 42, 0.06)",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box
        onClick={() => navigateTo(-1)}
        sx={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background:
            "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
          transition: "all 0.25s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            background:
              "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.09)",
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#0f172a" }} />
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: { xs: 16, md: 17 },
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.02em",
          }}
        >
          Pricing Plans
        </Typography>
        <Typography
          sx={{
            fontSize: 12.5,
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          Choose a plan to unlock worker contacts
        </Typography>
      </Box>
    </Box>
  </Box>

  <Box sx={{ maxWidth: 1180, mx: "auto" }}>
    {/* Hero */}
    <Box
      sx={{
        textAlign: "center",
        mb: { xs: 4, md: 5.5 },
        px: { xs: 0.5, md: 1 },
      }}
    >
      <Chip
        label="Flexible Pricing Plans"
        sx={{
          mb: 1.8,
          px: 0.6,
          height: 34,
          background:
            "linear-gradient(135deg, #eef4ff 0%, #f0f9ff 100%)",
          color: "#2563eb",
          fontWeight: 800,
          fontSize: "0.75rem",
          borderRadius: "999px",
          border: "1px solid #dbeafe",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.08)",
        }}
      />

      <Typography
        sx={{
          fontSize: { xs: "2rem", sm: "2.3rem", md: "3rem" },
          lineHeight: { xs: 1.2, md: 1.1 },
          fontWeight: 900,
          color: "#0f172a",
          maxWidth: 820,
          mx: "auto",
          letterSpacing: "-0.04em",
        }}
      >
        Choose the Right BookMyWorker
        <br />
        Plan for Your Hiring Needs
      </Typography>

      <Typography
        sx={{
          mt: 2,
          maxWidth: 760,
          mx: "auto",
          color: "#64748b",
          fontSize: { xs: "0.96rem", md: "1.02rem" },
          lineHeight: 1.8,
          fontWeight: 500,
        }}
      >
        Get access to{" "}
        <Box component="span" sx={{ fontWeight: 800, color: "#0f172a" }}>
          {highestType === "individual"
            ? "5 Lakh+ skilled and unskilled workers"
            : "verified workers across India"}
        </Box>{" "}
        with plans built for employers, contractors, agencies, and industries.
        Discover workforce faster with BookMyWorker support.
      </Typography>

      {user?.isSubscribed && user?.subscriptionExpery && (
        <Box sx={{ mt: 2.2 }}>
          <SubscriptionPatti expiry={user.subscriptionExpery} />
        </Box>
      )}
    </Box>

    {isLimitExhausted && !isExpired && (
      <Box sx={{ mb: 3.2 }}>
        <PricingBanner userRole={user?.userRole} />
      </Box>
    )}

    {/* Plans */}
    <Grid container spacing={{ xs: 2.2, md: 3 }} justifyContent="center">
      {plans.map((plan) => {
        const baseAmount = parsePrice(plan.price);
        const yearlyEquivalent =
          plan.id === "1m"
            ? Math.round(baseAmount * 1.5)
            : plan.id === "6m"
            ? Math.round(baseAmount * 1.6)
            : Math.round(baseAmount * 1.5);

        const discount =
          plan.id === "1m"
            ? "30% OFF"
            : plan.id === "6m"
            ? "38% OFF"
            : "33% OFF";

        const shortDesc =
          plan.id === "1m"
            ? "Ideal for employers, contractors, and businesses looking for quick access to BookMyWorker’s workforce network."
            : plan.id === "6m"
            ? "Best value for growing businesses that need regular manpower support and wider workforce reach."
            : "Perfect for businesses with continuous manpower requirements and long-term workforce planning.";

        return (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card
              sx={{
                height: "100%",
                minHeight: 540,
                borderRadius: "28px",
                position: "relative",
                overflow: "visible",
                background: plan.popular
                  ? "linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)"
                  : "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
                border: plan.popular
                  ? "1.5px solid #93c5fd"
                  : "1px solid #e2e8f0",
                boxShadow: plan.popular
                  ? "0 20px 45px rgba(37, 99, 235, 0.12)"
                  : "0 14px 34px rgba(15, 23, 42, 0.07)",
                transition: "all 0.28s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: plan.popular
                    ? "0 24px 50px rgba(37, 99, 235, 0.16)"
                    : "0 20px 42px rgba(15, 23, 42, 0.10)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 110,
                  borderRadius: "28px 28px 0 0",
                  background: plan.popular
                    ? "linear-gradient(135deg, rgba(219,234,254,0.7) 0%, rgba(236,254,255,0.55) 100%)"
                    : "linear-gradient(135deg, rgba(248,250,252,0.75) 0%, rgba(255,255,255,0.4) 100%)",
                  zIndex: 0,
                },
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  sx={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "0.72rem",
                    borderRadius: "999px",
                    px: 0.6,
                    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.25)",
                    zIndex: 2,
                  }}
                />
              )}

              <CardContent
                sx={{
                  p: 2.7,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    mt: 0.5,
                  }}
                >
                  {plan.id === "1m"
                    ? "Monthly Plan"
                    : plan.id === "6m"
                    ? "Half-Yearly Plan"
                    : "Yearly Plan"}
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "0.84rem",
                    mt: 0.4,
                    mb: 2,
                    fontWeight: 600,
                  }}
                >
                  {plan.duration} Access
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.9,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      textDecoration: "line-through",
                      fontWeight: 700,
                      fontSize: "0.96rem",
                    }}
                  >
                    ₹{yearlyEquivalent}
                  </Typography>

                  <Chip
                    label={discount}
                    size="small"
                    sx={{
                      height: 22,
                      background:
                        "linear-gradient(180deg, #ecfdf3 0%, #dcfce7 100%)",
                      color: "#15803d",
                      fontWeight: 800,
                      fontSize: "0.64rem",
                      borderRadius: "999px",
                      border: "1px solid #bbf7d0",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 0.8,
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "2.2rem",
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "#0f172a",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {plan.price}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      color: "#64748b",
                      mb: 0.38,
                      fontWeight: 700,
                    }}
                  >
                    starting from
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "0.84rem",
                    lineHeight: 1.8,
                    minHeight: 72,
                    mb: 2.2,
                    fontWeight: 500,
                  }}
                >
                  {shortDesc}
                </Typography>

                <Box
                  sx={{
                    p: 1.6,
                    mb: 2.5,
                    borderRadius: "18px",
                    background:
                      "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(241,245,249,0.9) 100%)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.05,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#334155",
                        fontWeight: 700,
                      }}
                    >
                      ✔ Access to {plan.workers}+ skilled & unskilled workers
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#334155",
                        fontWeight: 700,
                      }}
                    >
                      ✔ {plan.posts} requirement posts
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#334155",
                        fontWeight: 700,
                      }}
                    >
                      ✔ Suitable for Employers, Companies & Contractors
                    </Typography>

                    {plan.benefits?.map((benefit, index) => (
                      <Typography
                        key={index}
                        sx={{
                          fontSize: "0.85rem",
                          color: "#334155",
                          fontWeight: 700,
                          lineHeight: 1.65,
                        }}
                      >
                        ✔ {benefit}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mt: "auto" }}>
                  <Button
                    fullWidth
                    size="large"
                    disabled={loading}
                    variant="contained"
                    onClick={() => handlePayment(plan)}
                    sx={{
                      borderRadius: "16px",
                      py: 1.45,
                      fontWeight: 800,
                      textTransform: "none",
                      fontSize: "0.96rem",
                      background: plan.popular
                        ? "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)"
                        : "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                      boxShadow: plan.popular
                        ? "0 14px 28px rgba(37,99,235,0.22)"
                        : "0 14px 28px rgba(15,23,42,0.14)",
                      "&:hover": {
                        background: plan.popular
                          ? "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)"
                          : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                        boxShadow: plan.popular
                          ? "0 16px 30px rgba(37,99,235,0.26)"
                          : "0 16px 30px rgba(15,23,42,0.18)",
                      },
                      "&.Mui-disabled": {
                        background: "#cbd5e1",
                        color: "#ffffff",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {loading ? "Processing..." : "Get Started"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>

    {/* Employer Type Label */}
    <Box sx={{ textAlign: "center", mt: 3.5 }}>
      <Chip
        label={pricingLabel}
        sx={{
          height: 34,
          background:
            "linear-gradient(135deg, #eef2ff 0%, #eff6ff 100%)",
          color: "#2563eb",
          fontWeight: 800,
          borderRadius: "999px",
          border: "1px solid #dbeafe",
          boxShadow: "0 4px 12px rgba(37,99,235,0.08)",
        }}
      />
    </Box>

    {/* Support Contact */}
    <Box
      sx={{
        textAlign: "center",
        mt: 4,
        mb: 8,
        maxWidth: 480,
        mx: "auto",
        p: { xs: 2, md: 2.3 },
        borderRadius: "22px",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(14px)",
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#334155",
          fontSize: "0.95rem",
          fontWeight: 700,
          lineHeight: 1.7,
        }}
      >
        {t("contactsupport")}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          fontSize: "0.86rem",
          mt: 0.8,
          lineHeight: 1.7,
        }}
      >
        Email:{" "}
        <Box component="span" sx={{ color: "#2563eb", fontWeight: 800 }}>
          support@bookmyworkers.com
        </Box>
      </Typography>
    </Box>
  </Box>
</Box>
);
};

export default PricingPage;

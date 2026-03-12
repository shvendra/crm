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
      workers: 50,
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
      workers: 300,
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
      workers: 600,
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
      minHeight: "100vh",
      backgroundColor: "#f5f7fb",
      px: { xs: 1.5, md: 3 },
      py: 2,
    }}
  >
    {/* Header */}
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(245,247,251,0.92)",
        backdropFilter: "blur(10px)",
        border: "1px solid #e8edf5",
        borderRadius: 3,
        px: 2,
        py: 1.2,
        mb: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          onClick={() => navigateTo(-1)}
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "#f8fafc" },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#1f2937" }} />
        </Box>

        <Box>
          <Typography fontSize={17} fontWeight={800} color="#1f2a44">
            Pricing Plans
          </Typography>
          <Typography fontSize={12} color="#6b7280">
            Choose a plan to unlock worker contacts
          </Typography>
        </Box>
      </Box>
    </Box>

    <Box sx={{ maxWidth: 1180, mx: "auto" }}>
      {/* Hero */}
      <Box textAlign="center" mb={4.5}>
        <Chip
          label="Flexible Pricing Plans"
          sx={{
            mb: 1.5,
            backgroundColor: "#eef2ff",
            color: "#2563eb",
            fontWeight: 700,
            fontSize: "0.7rem",
            borderRadius: "999px",
          }}
        />

        <Typography
          sx={{
            fontSize: { xs: "2rem", md: "2.8rem" },
            lineHeight: 1.15,
            fontWeight: 900,
            color: "#26323d",
            maxWidth: 760,
            mx: "auto",
          }}
        >
          Choose the Right BookMyWorker
          <br />
          Plan for Your Hiring Needs
        </Typography>

        <Typography
          sx={{
            mt: 1.8,
            maxWidth: 700,
            mx: "auto",
            color: "#6b7280",
            fontSize: { xs: "0.95rem", md: "1rem" },
            lineHeight: 1.7,
            fontWeight: 500,
          }}
        >
          Get access to{" "}
          <Box component="span" sx={{ fontWeight: 800, color: "#1f2937" }}>
            {highestType === "individual"
              ? "5 Lakh+ skilled and unskilled workers"
              : "verified workers across India"}
          </Box>{" "}
          with plans built for employers, contractors, agencies, and industries.
          Discover workforce faster with BookMyWorker support.
        </Typography>

        {user?.isSubscribed && user?.subscriptionExpery && (
          <Box sx={{ mt: 2 }}>
            <SubscriptionPatti expiry={user.subscriptionExpery} />
          </Box>
        )}
      </Box>

      {isLimitExhausted && !isExpired && (
        <Box sx={{ mb: 3 }}>
          <PricingBanner userRole={user?.userRole} />
        </Box>
      )}

      {/* Plans */}
      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan) => {
          const baseAmount = parsePrice(plan.price);
          const yearlyEquivalent =
            plan.id === "1m"
              ? Math.round(baseAmount * 1.5)
              : plan.id === "6m"
              ? Math.round(baseAmount * 1.6)
              : Math.round(baseAmount * 1.5);

          const discount =
            plan.id === "1m" ? "30% OFF" : plan.id === "6m" ? "38% OFF" : "33% OFF";

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
                  minHeight: 520,
                  borderRadius: "18px",
                  position: "relative",
                  backgroundColor: plan.popular ? "#f7fbff" : "#ffffff",
                  border: plan.popular ? "2px solid #2563eb" : "1px solid #dbe3ef",
                  boxShadow: plan.popular
                    ? "0 10px 28px rgba(37,99,235,0.10)"
                    : "0 8px 24px rgba(15,23,42,0.05)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: plan.popular
                      ? "0 14px 34px rgba(37,99,235,0.14)"
                      : "0 12px 30px rgba(15,23,42,0.08)",
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Most Popular"
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.72rem",
                      borderRadius: "999px",
                      boxShadow: "0 8px 18px rgba(37,99,235,0.25)",
                    }}
                  />
                )}

                <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", height: "100%" }}>
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: "#26323d",
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
                      color: "#7b8794",
                      fontSize: "0.82rem",
                      mt: 0.4,
                      mb: 2,
                    }}
                  >
                    {plan.duration} Access
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.6 }}>
                    <Typography
                      sx={{
                        color: "#98a2b3",
                        textDecoration: "line-through",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                      }}
                    >
                      ₹{yearlyEquivalent}
                    </Typography>

                    <Chip
                      label={discount}
                      size="small"
                      sx={{
                        height: 20,
                        backgroundColor: "#e7f8ee",
                        color: "#16a34a",
                        fontWeight: 800,
                        fontSize: "0.62rem",
                        borderRadius: "999px",
                      }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-end", gap: 0.8, mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: "2rem",
                        fontWeight: 900,
                        lineHeight: 1,
                        color: "#26323d",
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#7b8794",
                        mb: 0.35,
                        fontWeight: 600,
                      }}
                    >
                      starting from
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "#667085",
                      fontSize: "0.82rem",
                      lineHeight: 1.7,
                      minHeight: 68,
                      mb: 2,
                    }}
                  >
                    {shortDesc}
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.05, mb: 2.5 }}>
                    <Typography sx={{ fontSize: "0.84rem", color: "#475467", fontWeight: 600 }}>
                      ✔ Access to {plan.workers}+ skilled & unskilled workers
                    </Typography>

                    <Typography sx={{ fontSize: "0.84rem", color: "#475467", fontWeight: 600 }}>
                      ✔ {plan.posts} requirement posts
                    </Typography>

                    <Typography sx={{ fontSize: "0.84rem", color: "#475467", fontWeight: 600 }}>
                      ✔ Suitable for Employers, Companies & Contractors
                    </Typography>

                    {plan.benefits?.map((benefit, index) => (
                      <Typography
                        key={index}
                        sx={{
                          fontSize: "0.84rem",
                          color: "#475467",
                          fontWeight: 600,
                          lineHeight: 1.6,
                        }}
                      >
                        ✔ {benefit}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Button
                      fullWidth
                      size="large"
                      disabled={loading}
                      variant="contained"
                      onClick={() => handlePayment(plan)}
                      sx={{
                        borderRadius: 2.5,
                        py: 1.35,
                        fontWeight: 800,
                        textTransform: "none",
                        fontSize: "0.95rem",
                        backgroundColor: plan.popular ? "#2563eb" : "#26343f",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: plan.popular ? "#1d4ed8" : "#1f2a33",
                          boxShadow: "none",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "#cbd5e1",
                          color: "#fff",
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
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Chip
          label={pricingLabel}
          sx={{
            backgroundColor: "#eef2ff",
            color: "#2563eb",
            fontWeight: 700,
            borderRadius: "999px",
          }}
        />
      </Box>

      {/* Footer Note */}
     

      {/* Support Contact */}
      <Box sx={{ textAlign: "center", mt: 3, mb: 8, maxWidth: 420, mx: "auto" }}>
        <Typography
          variant="body2"
          sx={{
            color: "#334155",
            fontSize: "0.92rem",
            fontWeight: 600,
            lineHeight: 1.6,
          }}
        >
          {t("contactsupport")}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#667085", fontSize: "0.85rem", mt: 0.7 }}
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

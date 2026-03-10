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
  individual: { "1m": 99, "6m": 499, "12m": 999 },
  contractor: { "1m": 199, "6m": 1099, "12m": 1999 },
  agency: { "1m": 299, "6m": 1499, "12m": 2900 },
  industry: { "1m": 499, "6m": 2499, "12m": 4499 },
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
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #eaeaea",
          px: 2,
          py: 1.2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Back Button */}
          <Box
            onClick={() => navigateTo(-1)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": { backgroundColor: "#f1f1f1" },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          </Box>

          <Box>
            <Typography fontSize={16} fontWeight={800}>
              Pricing Plans
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Choose a plan to unlock worker contacts
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Page Title */}
 <Box textAlign="center" mb={5}>
        <Typography variant="h4" fontWeight={800}>
          Flexible Plans for Worker Hiring
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 650, mx: "auto", mt: 1, fontWeight: "bolder" }}
        >
          Choose a plan that fits your hiring needs — from local district
          workers to pan-India availability with dedicated support.
        </Typography>
          {user?.isSubscribed && user?.subscriptionExpery && (
          <SubscriptionPatti expiry={user.subscriptionExpery} />
        )}   
      </Box>
{isLimitExhausted && !isExpired && (  <div>
    <PricingBanner userRole={user?.userRole} />
  </div>
)}
      {/* Plans */}
      <Grid container spacing={3}>
      
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                position: "relative",
                border: plan.popular
                  ? "2px solid #1976d2"
                  : "1px solid #e0e0e0",
                boxShadow: plan.popular
                  ? "0 10px 30px rgba(25,118,210,0.25)"
                  : "0 6px 20px rgba(0,0,0,0.08)",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-6px)" },
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  color="primary"
                  sx={{ position: "absolute", top: 16, right: 16, fontWeight: 600 }}
                />
              )}

              <CardContent>
                <Typography fontWeight={800} fontSize={18}>
                  {plan.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {plan.duration}
                </Typography>
                <Typography variant="h4" fontWeight={900} color="primary">
                  {plan.price}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{mt: 3}} variant="body2">✔ {plan.workers} Worker Profiles</Typography>
                <Typography variant="body2">✔ {plan.posts} Requirement Posts</Typography>
                <Typography variant="body2">✔ All Worker Categories</Typography>
                <Typography variant="body2">✔ Verified Agents & Workers</Typography>
                {plan.benefits?.map((benefit, index) => (
  <Typography key={index} variant="body2" sx={{ fontWeight: "bolder"}}>
    ✔ {benefit}
  </Typography>
))}

             <Button
  fullWidth
  size="large"
  variant={plan.popular ? "contained" : "outlined"}
  disabled={loading}
  sx={{ mt: 3, borderRadius: 3, fontWeight: 700, py: 1.2 }}
  onClick={() => handlePayment(plan)}
>
  {loading ? "Processing..." : "Buy Now"}
</Button>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer Note */}
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="center"
        mt={4}
      >
        * Plan limits reset on renewal. Taxes may apply.
      </Typography>

      {/* Support Contact */}
      <Box sx={{ textAlign: "center", mb: 3, maxWidth: "320px", mx: "auto" }}>
        <Typography
          variant="body2"
          sx={{ color: "#333", fontSize: "0.85rem", fontWeight: 500, lineHeight: 1.4 }}
        >
          {t("contactsupport")}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem"}}>
          <br />
          Email: <strong style={{ color: "#1976d2" }}>support@bookmyworkers.com</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default PricingPage;

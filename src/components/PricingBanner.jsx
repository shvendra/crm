import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import config from "../config";

const PricingBanner = ({ userRole }) => {
  const { user } = useContext(Context);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const GST_RATE = config.GST_CHARGES || 0.18;

  const basePricing = { 50: 150, 100: 250 };

  const multipliers = {
    individual: 1,
    contractor: 2,
    agency: 3,
    company: 4,
    industry: 4,
  };

  const multiplier = multipliers[userRole?.toLowerCase()] || 1;

  const plans = {
    50: basePricing[50] * multiplier,
    100: basePricing[100] * multiplier,
  };

  const handleTopupPayment = async (contactCount, baseAmount) => {
    try {
      setLoadingPlan(contactCount);

      const gstCharges = Number((baseAmount * GST_RATE).toFixed(2));
      const totalAmount = Number((baseAmount + gstCharges).toFixed(2));

      const response = await axios.post(
        `${config.API_BASE_URL}/api/v1/payment/add-topup-trans`,
        {
          employerId: user?._id,
          firstName: user?.name || "",
          email: user?.email || "",
          employer_phone: user?.phone || "",
          paymentType: "subscription", // schema-compatible
          amount: totalAmount,
          gstCharges,
          contactCount,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data?.url) {
        localStorage.setItem("pendingTopupOrderId", response.data.merchantOrderId);
        window.open(response.data.url, "_self");
      } else {
        toast.error("Payment URL not received");
      }
    } catch (error) {
      console.error("Topup payment initiation failed", error);
      toast.error(error?.response?.data?.error || "Payment initiation failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #001f3f, #003366)",
        color: "#fff",
        padding: "40px",
        borderRadius: "12px",
        textAlign: "center",
        marginBottom: "30px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
      }}
    >
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "15px" }}>
        Your contact limit has been exhausted
      </h2>

      <p
        style={{
          fontSize: "18px",
          marginBottom: "30px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        Unlock more opportunities by purchasing a top-up plan. Choose the plan
        that suits your role and continue connecting seamlessly with verified agents.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#fff",
            color: "#003366",
            padding: "25px",
            borderRadius: "10px",
            width: "220px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
          }}
        >
          <h3 style={{ fontSize: "20px", fontWeight: "600" }}>50 Contacts</h3>
        <p style={{ fontSize: "22px", fontWeight: "700", margin: "15px 0" }}>
  ₹{plans[50]} <span style={{ fontSize: "12px", color: "#777" }}>+ GST</span>
</p>
          <button
            style={{
              background: "linear-gradient(90deg, #0066cc, #004080)",
              color: "#fff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              width: "100%",
            }}
            onClick={() => handleTopupPayment(50, plans[50])}
            disabled={loadingPlan === 50}
          >
            {loadingPlan === 50 ? "Processing..." : "Buy Now"}
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            color: "#003366",
            padding: "25px",
            borderRadius: "10px",
            width: "220px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              background: "#ffcc00",
              color: "#003366",
              padding: "5px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            Best Value
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "600" }}>100 Contacts</h3>
         <p style={{ fontSize: "22px", fontWeight: "700", margin: "15px 0" }}>
  ₹{plans[100]} <span style={{ fontSize: "12px", color: "#777" }}>+ GST</span>
</p>
          <button
            style={{
              background: "linear-gradient(90deg, #0066cc, #004080)",
              color: "#fff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              width: "100%",
            }}
            onClick={() => handleTopupPayment(100, plans[100])}
            disabled={loadingPlan === 100}
          >
            {loadingPlan === 100 ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingBanner;
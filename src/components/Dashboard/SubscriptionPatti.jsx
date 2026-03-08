import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

const SubscriptionPatti = ({ expiry }) => {
  const navigate = useNavigate();

  const getTimeLeft = () => {
    const now = Date.now();
    const end = new Date(expiry).getTime();
    const diff = end - now;

    if (diff <= 0) return { expired: true };

    return {
      expired: false,
      totalMs: diff,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  /* ================= EXPIRED STATE ================= */
  if (timeLeft?.expired) {
    return (
      <Box sx={expiredStyle}>
        <Typography fontWeight={800} fontSize={13}>
          ⚠️ Your subscription has expired. Renew now to continue using premium features.
        </Typography>

        <Button
          size="small"
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#b71c1c",
            fontWeight: 700,
            borderRadius: 2,
          }}
          onClick={() => navigate("/pricing")}
        >
          Renew Now
        </Button>
      </Box>
    );
  }

  /* ================= ACTIVE STATE ================= */
  let bg = "#2e7d32"; // green
  let animate = false;

  if (timeLeft.totalMs < 24 * 60 * 60 * 1000) {
    bg = "#b71c1c"; // red
    animate = true;
  } else if (timeLeft.totalMs < 3 * 24 * 60 * 60 * 1000) {
    bg = "#ef6c00"; // orange
  }

  return (
  <Box
  sx={{
    position: "sticky",
    top: 0,
    zIndex: 999,
    backgroundColor: bg,
    color: "#fff",
    px: 2,
    py: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    animation: animate ? `${blink} 1.2s infinite` : "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
  }}
>
  <Typography fontWeight={800} fontSize={13}>
    ⏳ Subscription expires in:{" "}
    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
  </Typography>

  {/* Show only if 10 days or less */}
  {timeLeft.days <= 10 && (
    <Button
      size="small"
      variant="contained"
      sx={{
        backgroundColor: "#fff",
        color: bg,
        fontWeight: 700,
        borderRadius: 2,
        "&:hover": { backgroundColor: "#f5f5f5" },
      }}
      onClick={() => navigate("/pricing")}
    >
      Renew Now
    </Button>
  )}
</Box>

  );
};

const expiredStyle = {
  position: "sticky",
  top: 0,
  zIndex: 999,
  backgroundColor: "#b71c1c",
  color: "#fff",
  px: 2,
  py: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  fontWeight: 800,
};

export default SubscriptionPatti;

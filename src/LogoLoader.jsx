import React from "react";
import { Box, Typography } from "@mui/material";

const PremiumLoader = () => {
const isAndroid = /Android/i.test(navigator.userAgent);

const getLoaderText = () => {
  if (isAndroid) {
    return {
      title: "Getting work opportunities ready",
      subtitle: "Loading jobs, workers and real-time updates",
    };
  } else {
    return {
      title: "Finding the best workers for you",
      subtitle: "Loading workers, jobs and availability",
    };
  }
};

const { title, subtitle } = getLoaderText();
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef4ff 35%, #f8fbff 100%)",
      }}
    >
      {/* Animated background blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.22), transparent 70%)",
          top: "8%",
          left: "10%",
          filter: "blur(30px)",
          animation: "floatOne 10s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.18), transparent 70%)",
          bottom: "10%",
          right: "12%",
          filter: "blur(36px)",
          animation: "floatTwo 12s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.14), transparent 70%)",
          bottom: "20%",
          left: "28%",
          filter: "blur(32px)",
          animation: "floatThree 14s ease-in-out infinite",
        }}
      />

      {/* subtle grid overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          backgroundImage: `
            linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(circle at center, black 45%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 45%, transparent 95%)",
        }}
      />

      {/* Center premium card */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: { xs: "88%", sm: 420 },
          borderRadius: "28px",
          px: 4,
          py: 4,
          backdropFilter: "blur(18px)",
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 20px 80px rgba(15, 23, 42, 0.10)",
        }}
      >
        {/* top shimmer bar */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            height: 6,
            borderRadius: 999,
            bgcolor: "rgba(148,163,184,0.18)",
            mb: 3,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "-30%",
              width: "30%",
              height: "100%",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, transparent, rgba(37,99,235,0.85), transparent)",
              animation: "slideBar 1.8s ease-in-out infinite",
            }}
          />
        </Box>

        {/* skeleton content blocks */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
          <Box
            sx={{
              height: 16,
              width: "58%",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(226,232,240,0.9) 25%, rgba(241,245,249,1) 50%, rgba(226,232,240,0.9) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.8s linear infinite",
            }}
          />
          <Box
            sx={{
              height: 12,
              width: "92%",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(226,232,240,0.8) 25%, rgba(241,245,249,1) 50%, rgba(226,232,240,0.8) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
            }}
          />
          <Box
            sx={{
              height: 12,
              width: "76%",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(226,232,240,0.8) 25%, rgba(241,245,249,1) 50%, rgba(226,232,240,0.8) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2.2s linear infinite",
            }}
          />
        </Box>

        {/* pulse blocks */}
        <Box
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <Box
              key={item}
              sx={{
                height: 68,
                borderRadius: "18px",
                background: "rgba(255,255,255,0.52)",
                border: "1px solid rgba(226,232,240,0.8)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                animation: `pulseCard ${1.8 + item * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </Box>
<Typography
  sx={{
    mt: 3.2,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
    letterSpacing: "0.2px",
  }}
>
  {title}
</Typography>

<Typography
  sx={{
    mt: 0.8,
    textAlign: "center",
    fontSize: 12,
    color: "#64748b",
  }}
>
  {subtitle}
</Typography>
      </Box>

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }

          @keyframes slideBar {
            0% { left: -30%; }
            100% { left: 100%; }
          }

          @keyframes pulseCard {
            0%, 100% {
              transform: translateY(0px);
              opacity: 0.86;
            }
            50% {
              transform: translateY(-4px);
              opacity: 1;
            }
          }

          @keyframes floatOne {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(30px, 20px) scale(1.08);
            }
          }

          @keyframes floatTwo {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(-24px, -18px) scale(1.1);
            }
          }

          @keyframes floatThree {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(20px, -26px) scale(1.06);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default PremiumLoader;
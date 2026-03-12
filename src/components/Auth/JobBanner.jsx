import { Box, Typography, Stack } from "@mui/material";

export default function JobBanner({ isWebView }) {
  if (isWebView) return null;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        background: "#f2f2f2",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* LEFT SECTION */}
      <Box
        sx={{
          position: "relative",
          flex: 2,
          background: "#1f2c74",
          color: "#fff",
          px: { xs: 3, md: 6 },
          py: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 700, mb: 1, fontSize: { xs: 22, md: 34 } }}
          >
            Post your worker requirements in just 2 minutes!
          </Typography>

          <Stack spacing={1}>
            <Typography sx={{ fontSize: { xs: 14, md: 18 } }}>
              • Get unlimited calls directly from the workers & suppliers.
            </Typography>

            <Typography sx={{ fontSize: { xs: 14, md: 18 } }}>
              • Get access to the database of over 5L workers & suppliers.
            </Typography>
          </Stack>
        </Box>

        {/* ORANGE SLANTED STRIP */}
        {/* <Box
          sx={{
            position: "absolute",
            right: "-40px",
            top: 0,
            height: "100%",
            width: "120px",
            background: "#1976d2",
            transform: "skewX(-30deg)",
            display: { xs: "none", md: "block" },
          }}
        /> */}
      </Box>

      {/* RIGHT SECTION */}
      <Box
        sx={{
          flex: 1,
          background: "#f2f2f2",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
          py: 3,
          textAlign: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
            India’s
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: 36, md: 48 },
              color: "#1f2c74",
            }}
          >
            Top
          </Typography>

          <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
            Worker Hiring Platform
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
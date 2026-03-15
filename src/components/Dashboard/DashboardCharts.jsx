import React, { useState, useRef } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  MenuItem, Select
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import useRegistrationStats from "../../hook/useRegistrationStats";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  zoomPlugin
);

// Common chart options with zoom/pan
const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: { size: 10 },
      },
    },
    zoom: {
      pan: {
        enabled: true,
        mode: "xy",
      },
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: "xy",
      },
    },
  },
  scales: {
    x: {
      ticks: { font: { size: 10 } },
    },
    y: {
      ticks: { font: { size: 10 } },
    },
  },
};

// Chart card component with Reset Zoom button
const ChartCard = ({ title, ChartComponent, data, enableZoom }) => {
  const chartRef = useRef(null);

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

return (
  <Grid item xs={12} md={6}>
    <Card
      sx={{
        borderRadius: "22px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
        transition: "all .25s ease",
        "&:hover": {
          boxShadow: "0 20px 50px rgba(15,23,42,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ height: "100%", p: 2.2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 1,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              color: "#0f172a",
            }}
          >
            {title}
          </Typography>

          {enableZoom && (
            <Button
              onClick={handleResetZoom}
              size="small"
              variant="outlined"
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 700,
                borderRadius: "10px",
                borderColor: "#2563eb",
                color: "#2563eb",
                px: 1.5,
                py: 0.4,
                "&:hover": {
                  borderColor: "#1d4ed8",
                  backgroundColor: "#f1f5ff",
                },
              }}
            >
              Reset Zoom
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            height: "200px",
            width: "100%",
            overflow: "hidden",
            borderRadius: "12px",
            background: "#fff",
            p: 1,
          }}
        >
          <ChartComponent
            ref={chartRef}
            data={data}
            options={
              enableZoom ? chartOptions : { ...chartOptions, plugins: {} }
            }
          />
        </Box>
      </CardContent>
    </Card>
  </Grid>
);
};

const DashboardCharts = () => {
  const [view, setView] = useState("monthly");
    const [year, setYear] = useState("all"); // 👈 NEW
  const { agent, employer, worker, selfWorker, summry } = useRegistrationStats(view, year);

  const handleChange = (_, newView) => {
    if (newView) setView(newView);
  };

return (
  <Box
    sx={{
      mb: 1,
      width: "100%",
      px: { xs: 1, sm: 2, md: 4 },
      boxSizing: "border-box",
    }}
  >
    {/* Controls */}
    <Box
      sx={{
        textAlign: "center",
        mb: 2,
        mt: 1,
        display: "flex",
        gap: 2,
        justifyContent: "center",
        flexWrap: "wrap",
        p: 1.5,
        borderRadius: "18px",
        border: "1px solid #e2e8f0",
        background:
          "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
      }}
    >
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleChange}
        color="primary"
        sx={{
          "& .MuiToggleButton-root": {
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "12px !important",
            px: 2,
            borderColor: "#e2e8f0",
          },
        }}
      >
        <ToggleButton value="daily">Daily</ToggleButton>
        <ToggleButton value="monthly">Monthly</ToggleButton>
      </ToggleButtonGroup>

      {/* YEAR FILTER */}
      <Select
        size="small"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        sx={{
          minWidth: 120,
          borderRadius: "12px",
          background: "#fff",
          boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e2e8f0",
          },
        }}
      >
        <MenuItem value="all">All Years</MenuItem>
        <MenuItem value="2024">2024</MenuItem>
        <MenuItem value="2025">2025</MenuItem>
        <MenuItem value="2026">2026</MenuItem>
      </Select>
    </Box>

    {/* Charts */}
    <Grid container spacing={2}>
      {agent && (
        <ChartCard
          title={`Agent Increments (${view})`}
          ChartComponent={Line}
          data={agent}
          enableZoom={true}
        />
      )}

      {employer && (
        <ChartCard
          title={`Employer Increments (${view})`}
          ChartComponent={Bar}
          data={employer}
          enableZoom={true}
        />
      )}

      {worker && (
        <ChartCard
          title={`Worker Growth (${view})`}
          ChartComponent={Line}
          data={worker}
          enableZoom={true}
        />
      )}

      {selfWorker && (
        <ChartCard
          title={`Self Worker Growth (${view})`}
          ChartComponent={Line}
          data={selfWorker}
          enableZoom={true}
        />
      )}

      {summry && (
        <ChartCard
          title="Total Employers, Agents, selfWorkers & Workers"
          ChartComponent={Doughnut}
          data={summry}
          enableZoom={false}
        />
      )}
    </Grid>
  </Box>
);
};

export default DashboardCharts;

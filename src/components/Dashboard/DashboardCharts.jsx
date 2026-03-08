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
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">{title}</Typography>
            {enableZoom && (
              <Button
                onClick={handleResetZoom}
                size="small"
                variant="outlined"
                sx={{ textTransform: "none", fontSize: "0.75rem" }}
              >
                Reset Zoom
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ height: "200px", width: "100%", overflow: "hidden" }}>
            <ChartComponent
              ref={chartRef}
              data={data}
              options={enableZoom ? chartOptions : { ...chartOptions, plugins: {} }}
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
        px: { xs: 1, sm: 2, md: 4, },
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 1, mt: 1, display: "flex", gap: 2, justifyContent: "center" }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleChange}
          color="primary"
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>

        {/* YEAR FILTER */}
        <Select
          size="small"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <MenuItem value="all">All Years</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2025">2025</MenuItem>
          <MenuItem value="2026">2026</MenuItem>
        </Select>
      </Box>
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
            enableZoom={false} // Zoom not ideal for Doughnut
          />
        )}
      </Grid>
    </Box>
  );
};

export default DashboardCharts;

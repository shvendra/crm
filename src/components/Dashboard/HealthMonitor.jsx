import React, { useEffect, useState } from "react";
import config from "../../config";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@mui/material";
import { RefreshCw, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const API_BASE = `${config.API_BASE_URL}/api/v1/monitoring`;

const HealthDashboard = () => {
  const [health, setHealth] = useState(null);
  const [ready, setReady] = useState(null);
  const [live, setLive] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [memoryHistory, setMemoryHistory] = useState([]);

  // Fetch functions
  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchReady = async () => {
    try {
      const res = await fetch(`${API_BASE}/ready`);
      const data = await res.json();
      setReady(data);
    } catch {
      setReady({ status: "not ready" });
    }
  };
  const fetchLive = async () => {
    try {
      const res = await fetch(`${API_BASE}/live`);
      const data = await res.json();
      setLive(data);
    } catch {
      setLive({ status: "unavailable" });
    }
  };
  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      const data = await res.json();
      setMetrics(data);

      setCpuHistory((prev) => [
        ...prev.slice(-20),
        { time: new Date().toLocaleTimeString(), value: data.cpu.loadAverage[0] },
      ]);
      setMemoryHistory((prev) => [
        ...prev.slice(-20),
        { time: new Date().toLocaleTimeString(), value: data.memory.heapUsed },
      ]);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchCacheStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/cache/stats`);
      const data = await res.json();
      setCacheStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCache = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cache/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern: "*" }),
      });
      const data = await res.json();
      alert(data.message || "Cache cleared");
      fetchCacheStats();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    fetchReady();
    fetchLive();
    fetchMetrics();
    fetchCacheStats();

    let cd = 10;
    const interval = setInterval(() => {
      cd -= 1;
      setCountdown(cd);
      if (cd <= 0) {
        fetchHealth();
        fetchReady();
        fetchLive();
        fetchMetrics();
        fetchCacheStats();
        cd = 10;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f4f6f8", mb: "40px" }}>
      {/* Modern Heading */}
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          mb: 3,
          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
          borderRadius: 2,
          color: "#ffffff",
        }}
      >
        <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: "bold" }}>
          🖥 Enterprise Monitoring Dashboard
        </Typography>
      </Box>

      {/* Refresh */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<RefreshCw />}
          onClick={() => {
            fetchHealth();
            fetchReady();
            fetchLive();
            fetchMetrics();
            fetchCacheStats();
          }}
        >
          Refresh Now
        </Button>
        <Typography sx={{ alignSelf: "center" }}>
          Auto-refresh in <b>{countdown}</b>s
        </Typography>
      </Box>

      {/* Status Cards */}
      <Grid container spacing={2} mb={3}>
        {[
          { title: "Health", data: health?.status, bg: health?.status === "healthy" ? "#e0f7fa" : "#ffebee" },
          { title: "Readiness", data: ready?.status, bg: ready?.status === "ready" ? "#e0f7fa" : "#ffebee" },
          { title: "Liveness", data: live?.status, bg: live?.status === "alive" ? "#e0f7fa" : "#ffebee" },
        ].map((card, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: card.bg }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {card.title}
              </Typography>
              <Typography variant="h5">{card.data || "Loading..."}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Charts */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>
              CPU Load (Real-Time)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cpuHistory}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>
              Memory Usage (Heap Used)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={memoryHistory}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#ff6f00" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* System Details Table */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 2, overflowX: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Full System & Process Details</Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={16} /> : <Trash2 />}
            onClick={clearCache}
          >
            Clear Cache
          </Button>
        </Box>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#e3f2fd" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Metric</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics && (
              <>
                {/* System */}
                <TableRow hover sx={{ "&:hover": { bgcolor: "#f1f8e9" } }}>
                  <TableCell>Platform</TableCell>
                  <TableCell>{metrics.system.platform}</TableCell>
                </TableRow>
                <TableRow hover sx={{ "&:hover": { bgcolor: "#f1f8e9" } }}>
                  <TableCell>Architecture</TableCell>
                  <TableCell>{metrics.system.arch}</TableCell>
                </TableRow>
                <TableRow hover sx={{ "&:hover": { bgcolor: "#f1f8e9" } }}>
                  <TableCell>Node Version</TableCell>
                  <TableCell>{metrics.system.nodeVersion}</TableCell>
                </TableRow>
                <TableRow hover sx={{ "&:hover": { bgcolor: "#f1f8e9" } }}>
                  <TableCell>Total Memory (MB)</TableCell>
                  <TableCell>{metrics.system.totalMemory}</TableCell>
                </TableRow>
                <TableRow hover sx={{ "&:hover": { bgcolor: "#f1f8e9" } }}>
                  <TableCell>Free Memory (MB)</TableCell>
                  <TableCell>{metrics.system.freeMemory}</TableCell>
                </TableRow>

                {/* Process */}
                <TableRow hover>
                  <TableCell>Process PID</TableCell>
                  <TableCell>{metrics.process.pid}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Parent PID</TableCell>
                  <TableCell>{metrics.process.ppid}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Process Title</TableCell>
                  <TableCell>{metrics.process.title}</TableCell>
                </TableRow>

                {/* Memory */}
                <TableRow hover>
                  <TableCell>Heap Total (MB)</TableCell>
                  <TableCell>{metrics.memory.heapTotal}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Heap Used (MB)</TableCell>
                  <TableCell>{metrics.memory.heapUsed}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>RSS (MB)</TableCell>
                  <TableCell>{metrics.memory.rss}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>External (MB)</TableCell>
                  <TableCell>{metrics.memory.external}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Array Buffers (MB)</TableCell>
                  <TableCell>{metrics.memory.arrayBuffers}</TableCell>
                </TableRow>

                {/* CPU */}
                <TableRow hover>
                  <TableCell>CPU User</TableCell>
                  <TableCell>{metrics.cpu.user}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>CPU System</TableCell>
                  <TableCell>{metrics.cpu.system}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>CPU Load Avg</TableCell>
                  <TableCell>{metrics.cpu.loadAverage.join(", ")}</TableCell>
                </TableRow>

                {/* Database */}
                <TableRow hover>
                  <TableCell>DB Host</TableCell>
                  <TableCell>{metrics.database.host}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>DB Port</TableCell>
                  <TableCell>{metrics.database.port}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>DB Name</TableCell>
                  <TableCell>{metrics.database.name}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>DB ReadyState</TableCell>
                  <TableCell>{metrics.database.readyState}</TableCell>
                </TableRow>

                {/* Cache */}
                <TableRow hover>
                  <TableCell>Cache Connected</TableCell>
                  <TableCell>{cacheStats?.connected ? "Yes" : "No"}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Cache Keys</TableCell>
                  <TableCell>{cacheStats?.totalKeys || 0}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default HealthDashboard;

import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Dialog,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  useMediaQuery,
  useTheme,
  IconButton,
  Grid,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Context } from '../../main';
import { useTranslation } from 'react-i18next';
import axios from "../../utils/axiosConfig";
import config from '../../config';
import toast from 'react-hot-toast';

const AgentAssignDialog = ({
  open,
  onClose,
  ern,
  intrestedList = [],
  onAssign,
  onAccept,
  initialDistrict,
}) => {
  const { user } = useContext(Context);
  const { t } = useTranslation();
  const [wageMap, setWageMap] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!user) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      </Dialog>
    );
  }

  const isAdminOrSuperAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';

  // Filters
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [showOnlyInterested, setShowOnlyInterested] = useState(true);

  const [filteredAgents, setFilteredAgents] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  const interestedIds = intrestedList.map(i => i.agentId);

  // Fetch agents
  const fetchAgents = async () => {
    try {
      if (!user) return;
      setFilterLoading(true);

      const params = {};

      if (!isAdminOrSuperAdmin) {
        if (interestedIds.length > 0) params.ids = interestedIds.join(',');
      } else {
        if (stateFilter) params.state = stateFilter;
        if (districtFilter) params.city = districtFilter;
        if (phoneFilter) params.phone = phoneFilter;
      }

      const { data } = await axios.get(`${config.API_BASE_URL}/api/v1/user/getAllAgentsAdmin`, {
        params,
        withCredentials: true,
      });

      if (data.success) {
        setFilteredAgents(data.agents || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to fetch agents');
      setFilteredAgents([]);
    } finally {
      setFilterLoading(false);
    }
  };

  // Initial fetch when dialog opens
  useEffect(() => {
    if (open) {
      setDistrictFilter(initialDistrict || '');
      fetchAgents();
    }
  }, [open, initialDistrict]);

  // Process agents with interest flag
  const processedAgents = filteredAgents.map(agent => {
    const matchedEntry = intrestedList.find(i => i.agentId === agent._id);
    return {
      ...agent,
      isInterested: !!matchedEntry,
      agentRequiredWage: matchedEntry?.agentRequiredWage || '',
    };
  });

  // Apply interested checkbox filter
  const displayedAgents = showOnlyInterested
    ? processedAgents.filter(a => a.isInterested)
    : processedAgents;

  // Clear filters
  const clearFilters = () => {
    setStateFilter('');
    setDistrictFilter('');
    setPhoneFilter('');
    setShowOnlyInterested(false);
    fetchAgents();
  };

  return (
   <Dialog
  open={open}
  onClose={onClose}
  maxWidth="md"
  fullWidth
  fullScreen={isMobile}
  PaperProps={{
    sx: {
      borderRadius: isMobile ? 0 : "28px",
      mt: isMobile ? 0 : "90px",
      overflow: "hidden",
      border: "1px solid rgba(148,163,184,0.18)",
      boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
    },
  }}
>
  {/* Header */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
      color: "white",
      px: { xs: 2, sm: 2.5, md: 3 },
      py: 1.6,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 30%), radial-gradient(circle at bottom left, rgba(255,255,255,0.08), transparent 30%)",
        pointerEvents: "none",
      }}
    />

    <Typography
      variant="h6"
      sx={{
        fontSize: { xs: "1rem", sm: "1.08rem", md: "1.15rem" },
        fontWeight: 800,
        color: "white !important",
        position: "relative",
        zIndex: 1,
      }}
    >
      {isAdminOrSuperAdmin ? t("assignAgent") : t("interestedAgents")}
    </Typography>

    <IconButton
      onClick={onClose}
      sx={{
        color: "white",
        position: "relative",
        zIndex: 1,
        bgcolor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.16)",
        },
      }}
    >
      <CloseIcon />
    </IconButton>
  </Box>

  {/* Filters */}
  {isAdminOrSuperAdmin && (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 2.5 },
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            label={t("state")}
            size="small"
            fullWidth
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                background: "#fff",
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label={t("district")}
            size="small"
            fullWidth
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                background: "#fff",
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label={t("phone")}
            size="small"
            fullWidth
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                background: "#fff",
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={3} sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={fetchAgents}
            disabled={filterLoading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 2,
              boxShadow: "0 10px 20px rgba(37,99,235,0.18)",
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            }}
          >
            {t("Filter")}
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={clearFilters}
            disabled={filterLoading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {t("Clear")}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showOnlyInterested}
                onChange={(e) => setShowOnlyInterested(e.target.checked)}
                color="primary"
              />
            }
            label={`Interested Agents (${processedAgents.filter((a) => a.isInterested).length})`}
          />
        </Grid>
      </Grid>

      {filterLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            alignItems: "center",
            gap: 1,
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            background: "#fff",
            py: 1.2,
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
            Loading agents...
          </Typography>
        </Box>
      )}
    </Box>
  )}

  {/* Table */}
  <Box
    sx={{
      p: { xs: 1, sm: 1.5, md: 2 },
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    }}
  >
<TableContainer
  component={Paper}
  sx={{
    borderRadius: "20px",
    overflowX: "auto",
    border: "1px solid #e2e8f0",
  }}
>
  <Table
    size="small"
    sx={{ minWidth: 650 }}
  >
        <TableHead
          sx={{
            background:
              "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
          }}
        >
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>{t("action")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("name")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("block")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("Contact")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("wage")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("interested")}</TableCell>
            {isAdminOrSuperAdmin && (
              <TableCell sx={{ fontWeight: 800 }}>{t("status")}</TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {displayedAgents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                {filterLoading ? t("loading") : t("noAgentsAvailable")}
              </TableCell>
            </TableRow>
          ) : (
            displayedAgents.map((agent) => (
              <TableRow
                key={agent._id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8fbff",
                  },
                }}
              >
                <TableCell>
                  {isAdminOrSuperAdmin ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        onAssign(
                          agent._id,
                          agent.name,
                          agent.phone,
                          ern,
                          wageMap[agent._id] || agent.agentRequiredWage
                        )
                      }
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 700,
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        boxShadow: "0 8px 18px rgba(37,99,235,0.18)",
                      }}
                    >
                      {t("Assign")}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        onAccept(
                          agent._id,
                          agent.name,
                          agent.phone,
                          ern,
                          agent.agentRequiredWage
                        )
                      }
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      {t("accept")}
                    </Button>
                  )}
                </TableCell>

                <TableCell sx={{ fontWeight: 600 }}>{agent.name}</TableCell>

                <TableCell>{agent.state + ", " + agent.district}</TableCell>

                <TableCell>
                  <a
                    href={`tel:${agent.phone}`}
                    style={{
                      textDecoration: "none",
                      color: "#1976d2",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {agent.phone}
                  </a>
                </TableCell>

                <TableCell>
                  <TextField
                    variant="outlined"
                    type="number"
                    value={wageMap[agent._id] ?? agent.agentRequiredWage}
                    onChange={(e) =>
                      setWageMap((prev) => ({
                        ...prev,
                        [agent._id]: e.target.value,
                      }))
                    }
                    disabled={!isAdminOrSuperAdmin}
                    inputProps={{
                      style: {
                        width: "56px",
                        padding: "2px 4px",
                        fontSize: "0.85rem",
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        background: "#fff",
                      },
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={agent.isInterested ? "Interested" : "Not Interested"}
                    color={agent.isInterested ? "success" : "default"}
                    size="small"
                    variant={agent.isInterested ? "filled" : "outlined"}
                    sx={{
                      fontSize: "0.75rem",
                      opacity: agent.isInterested ? 1 : 0.7,
                      fontWeight: 700,
                      borderRadius: "999px",
                    }}
                  />
                </TableCell>

                {isAdminOrSuperAdmin && (
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        minWidth: "68px",
                        padding: "4px 10px",
                        backgroundColor:
                          agent.status === "Verified" ? "#16a34a" : "#a16207",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        pointerEvents: "none",
                        borderRadius: "10px",
                        textTransform: "none",
                        boxShadow: "none",
                      }}
                    >
                      {agent.status}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
</Dialog>
  );
};

export default AgentAssignDialog;

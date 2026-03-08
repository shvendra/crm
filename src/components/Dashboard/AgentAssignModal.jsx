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
      PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3, mt: '90px' } }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#093d71', color: 'white', px: 2, py: 1 }}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', color: 'white !important' }}>
          {isAdminOrSuperAdmin ? t('assignAgent') : t('interestedAgents')}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Filters */}
      {isAdminOrSuperAdmin && (
        <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label={t('state')}
                size="small"
                fullWidth
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label={t('district')}
                size="small"
                fullWidth
                value={districtFilter}
                onChange={e => setDistrictFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label={t('phone')}
                size="small"
                fullWidth
                value={phoneFilter}
                onChange={e => setPhoneFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3} sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" onClick={fetchAgents} disabled={filterLoading}>
                {t('Filter')}
              </Button>
              <Button variant="outlined" size="small" onClick={clearFilters} disabled={filterLoading}>
                {t('Clear')}
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showOnlyInterested}
                    onChange={e => setShowOnlyInterested(e.target.checked)}
                    color="primary"
                  />
                }
                label={`Interested Agents (${processedAgents.filter(a => a.isInterested).length})`}
              />
            </Grid>
          </Grid>

          {filterLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Loading agents...
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ background: '#f5f5f5' }}>
            <TableRow>
              <TableCell>{t('action')}</TableCell>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('block')}</TableCell>
              {<TableCell>{t('Contact')}</TableCell>}
              {/* {isAdminOrSuperAdmin && <TableCell>{t('EMP-Status')}</TableCell>} */}
              <TableCell>{t('wage')}</TableCell>
              <TableCell>{t('interested')}</TableCell>
              {isAdminOrSuperAdmin && <TableCell>{t('status')}</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedAgents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {filterLoading ? t('loading') : t('noAgentsAvailable')}
                </TableCell>
              </TableRow>
            ) : (
              displayedAgents.map(agent => (
                <TableRow key={agent._id}>
                  <TableCell>
                    {isAdminOrSuperAdmin ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => onAssign(agent._id, agent.name, agent.phone, ern, wageMap[agent._id] || agent.agentRequiredWage)}
                      >
                        {t('Assign')}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => onAccept(agent._id, agent.name, agent.phone, ern, agent.agentRequiredWage)}
                      >
                        {t('accept')}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.state + ', ' +agent.district}</TableCell>
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
                  {/* {isAdminOrSuperAdmin && <TableCell>{agent.phone}</TableCell>} */}

                  <TableCell>
                    <TextField
                      variant="outlined"
                      type="number"
                      value={wageMap[agent._id] ?? agent.agentRequiredWage}
                      onChange={e => setWageMap(prev => ({ ...prev, [agent._id]: e.target.value }))}
                      disabled={!isAdminOrSuperAdmin}
                      inputProps={{ style: { width: '56px', padding: '2px 4px', fontSize: '0.85rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={agent.isInterested ? 'Interested' : 'Not Interested'}
                      color={agent.isInterested ? 'success' : 'default'}
                      size="small"
                      variant={agent.isInterested ? 'filled' : 'outlined'}
                      sx={{ fontSize: '0.75rem', opacity: agent.isInterested ? 1 : 0.6 }}
                    />
                  </TableCell>
                  {isAdminOrSuperAdmin && (
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          minWidth: '60px',
                          padding: '2px 8px',
                          backgroundColor: agent.status === 'Verified' ? 'green' : '#7e7e24',
                          color: 'white',
                          fontSize: '0.75rem',
                          pointerEvents: 'none',
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
    </Dialog>
  );
};

export default AgentAssignDialog;

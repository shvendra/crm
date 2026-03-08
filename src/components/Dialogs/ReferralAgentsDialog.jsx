// 📁 src/components/ReferralAgentsDialog.jsx
import React, { useEffect, useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import config from '../../config';
import { Context } from "../../main";
const ReferralAgentsDialog = ({ open, onClose, referredBy }) => {
  const { t } = useTranslation();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
const { user } = useContext(Context);

  // 🧠 Fetch referred users when dialog opens
  useEffect(() => {
    if (open && referredBy) {
      fetchReferredUsers();
    }
  }, [open, referredBy]);

  const fetchReferredUsers = async () => {
    try {
      setLoading(true);
      const params = { referredBy }; // 👈 query params handled cleanly here

      const res = await axios.get(`${config.API_BASE_URL}/api/v1/user/referred`, {
        withCredentials: true, // optional — if your backend needs cookies/session
        params, // 👈 attaches ?referredBy=value automatically
      });
      if (res.data.success) {
        setAgents(res.data.users || []);
      }
    } catch (error) {
      console.error('Error fetching referred users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { background: '#001e3c', color: '#fff', borderRadius: '16px' },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
       <Typography variant="h6" sx={{ color: "#90caf9" }}>
    {["Agent", "SelfWorker"].includes(user?.role)
      ? t("agentsWithSameReferral")
      : t("Reffered Users")}
  </Typography>
        <IconButton onClick={onClose} sx={{ color: '#90caf9' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Typography align="center" sx={{ color: '#ccc', mt: 2 }}>
            <CircularProgress size={24} sx={{ color: '#90caf9', mr: 1 }} />
            {t('loading')}
          </Typography>
        ) : agents.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#90caf9' }}>{t('name')}</TableCell>
                <TableCell sx={{ color: '#90caf9' }}>{t('Phone')}</TableCell>
                <TableCell sx={{ color: '#90caf9' }}>{t('city')}</TableCell>
                <TableCell sx={{ color: '#90caf9' }}>{t('state')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map(agent => (
                <TableRow key={agent._id}>
                  <TableCell sx={{ color: '#fff' }}>{agent.name}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{agent.phone}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{agent.district}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{agent.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
        <Typography align="center" sx={{ color: "#ccc", mt: 2 }}>
  {["Agent", "SelfWorker"].includes(user?.role)
    ? t("noAgentsFound")
    : t("Users not found")}
</Typography>

        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReferralAgentsDialog;

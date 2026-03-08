import React, { useContext, useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import {
  Card,
  CardContent,
  Box,
  Divider,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import axios from '../../utils/axiosConfig';
import config from '../../config';
import UserCommentDialog from '../UserCommentDialog';
import ConfirmationDialog from '../ConfirmationDialog';
import toast from 'react-hot-toast';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import Chat from '../Chat/chat';
import { Context } from '../../main';
import { useConfirm } from '../../hook/confirmHook';

const TableForWorkRequirements = ({
  currentReq,
  filteredData,
  searchQuery,
  handleSearchChange,
  toggleChat,
  unreadCounts,
  handleAssignOpenModal,
  getPerHeadWages,
  t,
  openChatIds,
  handleUnreadCountChange,
}) => {
  const { user } = useContext(Context);
  const { isOpen, message, requestConfirm, handleDialogConfirm, handleDialogCancel } = useConfirm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedSites, setExpandedSites] = useState({});
  const [data, setData] = useState(filteredData);

  const booleanFields = [
    { key: 'accommodationAvailable', label: t('accommodationAvailable') },
    { key: 'foodAvailable', label: t('foodAvailable') },
    { key: 'incentive', label: t('incentive') },
    { key: 'bonus', label: t('bonus') },
    { key: 'transportProvided', label: t('transportProvided') },
    { key: 'weeklyOff', label: t('weeklyOff') },
    { key: 'overtimeAvailable', label: t('overtimeAvailable') },
    { key: 'insuranceAvailable', label: t('insuranceAvailable') },
    { key: 'pfAvailable', label: t('pfAvailable') },
    { key: 'esicAvailable', label: t('esicAvailable') },
  ];

  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  const handleCloseRequirement = async id => {
    try {
      const confirmed = await requestConfirm('Are you sure you want to perform this action?');
      if (confirmed) {
        await axios.put(
          `${config.API_BASE_URL}/api/v1/application/update-status?id=${id}&status=Closed`,
          {},
          { withCredentials: true }
        );
        toast.success('Status updated successfully');
      }
    } catch (error) {
      console.error('Failed to close requirement', error);
    }
  };

  const handleReqTypeChange = async (id, newValue) => {
    try {
      const confirmed = await requestConfirm('Are you sure you want to perform this action?');
      if (!confirmed) return;

      await axios.put(
        `${config.API_BASE_URL}/api/v1/application/update-reqtype`,
        { id, req_type: newValue },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      setData(prev => prev.map(item => (item._id === id ? { ...item, req_type: newValue } : item)));
      toast.success('Requirement type updated successfully');
    } catch (error) {
      console.error('Error updating req_type:', error);
      toast.error('Failed to update requirement type');
    }
  };

  const handleOpenEditDialog = req => {
    setSelectedReq(req);
    const newEditData = {
      remarks: req?.remarks || '',

      // ✅ NEW FIELDS
      minBudgetPerWorker: req?.minBudgetPerWorker || '',
      maxBudgetPerWorker: req?.maxBudgetPerWorker || '',

      ...booleanFields.reduce((acc, field) => {
        acc[field.key] = req[field.key] ?? false;
        return acc;
      }, {}),
    };

    if (req?.req_type === 'Office_Staff') {
      newEditData.status = req?.status || ''; // use empty string if not approved
      newEditData.finalAgentRequiredWage = req?.finalAgentRequiredWage || '';
    }

    setEditData(newEditData);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const confirmed = await requestConfirm('Are you sure you want to save changes?');
      if (!confirmed) return;

      const res = await axios.put(
        `${config.API_BASE_URL}/api/v1/application/update-stream-moreinfo`,
        {
          id: selectedReq._id,
          remarks: editData.remarks,
          status: editData.status,
          finalAgentRequiredWage: editData.finalAgentRequiredWage,
              // ✅ NEW FIELDS
          minBudgetPerWorker: editData.minBudgetPerWorker,
          maxBudgetPerWorker: editData.maxBudgetPerWorker,
          ...booleanFields.reduce((acc, field) => {
            acc[field.key] = editData[field.key];
            return acc;
          }, {}),
        },
        { withCredentials: true }
      );

      setData(prev =>
        prev.map(item => (item._id === selectedReq._id ? { ...item, ...editData } : item))
      );

      toast.success('Details updated successfully');
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update requirement:', error);
      toast.error('Failed to update requirement');
    }
  };

  const handleChangeSwitch = (key, value) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  const handleChangeRemarks = e => {
    setEditData(prev => ({ ...prev, remarks: e.target.value }));
  };

  const handleCloseDialogComment = () => setDialogOpen(false);
  const handleOpenDialogComment = stream => {
    setSelectedUser(stream);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ mb: 5 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
            mb={2}
          >
            <Typography className="dash-head" variant="h6">
              {'All Work Requirements'}
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Search by ERN, Name or Phone..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: { xs: '100%', sm: '300px' } }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {currentReq.length === 0 ? (
            <Box
              sx={{
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {t('detailsNotAvailable')}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>SN</TableCell>
                    <TableCell>
                      <strong>{t('ernLabel')}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('REQ Type')}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('Employer')}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('Phone')}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('district')}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('site')}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('workType')}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('Workers')}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('Rate')}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('Date')}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>{t('Edit')}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>{t('Chat')}</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data
                    .filter(stream => {
                      const status = String(stream.status || '')
                        .trim()
                        .toLowerCase();
                      return status !== 'assigned' && status !== 'approved';
                    })
                    .map((stream, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            sx={{
                              minWidth: '24px',
                              width: '24px',
                              height: '24px',
                              padding: '2px',
                              borderRadius: '6px',
                              borderColor: '#d32f2f',
                              '&:hover': { backgroundColor: '#fddede', borderColor: '#b71c1c' },
                            }}
                            onClick={() => handleCloseRequirement(stream._id)}
                          >
                            <CloseIcon sx={{ color: '#d32f2f', fontSize: '16px' }} />
                          </Button>
                        </TableCell>

                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: '#1976d2', cursor: 'pointer' }}
                            onClick={() =>
                              handleAssignOpenModal(
                                stream.ern_num,
                                stream.city,
                                stream?.intrestedAgents,
                                stream?.status
                              )
                            }
                          >
                            {stream.ern_num}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Select
                            value={stream.req_type || ''}
                            onChange={e => handleReqTypeChange(stream._id, e.target.value)}
                            size="small"
                            variant="outlined"
                            displayEmpty
                            fullWidth
                          >
                            <MenuItem value="" disabled>
                              Select Type
                            </MenuItem>
                            <MenuItem value="Contract_Based">Contract Based</MenuItem>
                            <MenuItem value="Daily_Wages">Daily Wages</MenuItem>
                            <MenuItem value="Supply_Based">Supply Based</MenuItem>
                            <MenuItem value="Office_Staff">Office Staff</MenuItem>
                          </Select>
                        </TableCell>

                        <TableCell
                          sx={{ cursor: 'pointer', color: '#1976d2' }}
                          onClick={() => handleOpenDialogComment(stream)}
                        >
                          {stream.emp_name}
                        </TableCell>
                        <TableCell>{stream.employerPhone}</TableCell>
                        <TableCell>{stream.district}</TableCell>

                        <TableCell>
                          {stream.site?.length > 50 ? (
                            <>
                              {expandedSites[stream._id]
                                ? stream.site
                                : `${stream.site.slice(0, 20)}... `}
                              <Button
                                size="small"
                                variant="text"
                                sx={{ p: 0, minWidth: 'auto', fontSize: '0.75rem' }}
                                onClick={() =>
                                  setExpandedSites(prev => ({
                                    ...prev,
                                    [stream._id]: !prev[stream._id],
                                  }))
                                }
                              >
                                {expandedSites[stream._id] ? 'Read Less' : 'Read More'}
                              </Button>
                            </>
                          ) : (
                            stream.site
                          )}
                        </TableCell>

                        <TableCell>{stream.workType}</TableCell>
                        <TableCell>{stream.totalWorkers}</TableCell>

                        <TableCell>
                          ₹{getPerHeadWages(stream, stream.min_wages, stream?.assignedAgentId)} - ₹
                          {getPerHeadWages(stream, stream.max_wages, stream?.assignedAgentId)}
                        </TableCell>

                        <TableCell>{stream?.workerNeedDate}</TableCell>

                        <TableCell align="center">
                          <Edit2
                            size={16}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleOpenEditDialog(stream)}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={
                              <Badge badgeContent={unreadCounts[stream._id] || 0} color="error">
                                <ChatIcon />
                              </Badge>
                            }
                            onClick={() => toggleChat(stream?._id)}
                          >
                            Chat
                          </Button>
                          {openChatIds.has(stream?._id) && (
                            <Chat
                              postId={stream?._id}
                              senderId={user?._id}
                              senderRole={user?.role}
                              employerName={stream?.emp_name}
                              onClose={() => toggleChat(stream?._id)}
                              onUnreadCountChange={handleUnreadCountChange}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Requirement Details</DialogTitle>
        <DialogContent dividers>
          {booleanFields.map(field => (
            <FormControlLabel
              key={field.key}
              control={
                <Switch
                  checked={!!editData[field.key]}
                  onChange={e => handleChangeSwitch(field.key, e.target.checked)}
                />
              }
              label={field.label}
            />
          ))}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={editData.remarks}
            onChange={handleChangeRemarks}
            sx={{ mt: 2 }}
          />

          {/* ✅ Show Approve Button and Final Rate input only for Office_Staff */}
           <TextField
                fullWidth
                type="number"
                label="Min Budget Per Worker"
                value={editData.minBudgetPerWorker || ''}
                onChange={e =>
                  setEditData(prev => ({
                    ...prev,
                    minBudgetPerWorker: e.target.value,
                  }))
                }
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Max Budget Per Worker"
                value={editData.maxBudgetPerWorker || ''}
                onChange={e =>
                  setEditData(prev => ({
                    ...prev,
                    maxBudgetPerWorker: e.target.value,
                  }))
                }
                sx={{ mt: 2 }}
              />
          {selectedReq?.req_type === 'Office_Staff' && (
            <>
              {/* Final Rate Input */}
              <TextField
                fullWidth
                label="Final Rate"
                type="number"
                value={editData.finalAgentRequiredWage || ''}
                onChange={e =>
                  setEditData(prev => ({ ...prev, finalAgentRequiredWage: e.target.value }))
                }
                sx={{ mt: 2 }}
              />

             

              {/* Approve Button */}
              <Button
                variant={editData.status === 'Approved' ? 'contained' : 'outlined'}
                color={editData.status === 'Approved' ? 'success' : 'primary'}
                sx={{ mt: 2 }}
                onClick={() =>
                  setEditData(prev => ({
                    ...prev,
                    status: prev.status === 'Approved' ? '' : 'Approved',
                  }))
                }
              >
                {editData.status === 'Approved' ? 'Approved' : 'Approve'}
              </Button>
            </>
          )}
          
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={isOpen}
        message={message}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />

      <UserCommentDialog
        open={dialogOpen}
        onClose={handleCloseDialogComment}
        selectedUser={selectedUser}
        loggedInUser={user}
      />
    </Box>
  );
};

export default TableForWorkRequirements;

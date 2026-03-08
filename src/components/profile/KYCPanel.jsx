import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const KYCPanel = React.memo(
  ({ user, userData, setUserData, handleKYCFileChange, aadharPreview, config }) => {
    const { t } = useTranslation();
    const [hasGST, setHasGST] = useState(userData?.kyc?.gstNumber ? true : null);
    return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                mb: 2,
                p: 0,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: '#fff',
                '&::before': {
                  content: '"BookMyWorker"',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  color: 'rgba(0, 0, 0, 0.04)',
                  zIndex: 0,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <CardContent>
                <Grid container spacing={3}>
                  {(user?.role === 'Agent' || user?.role === 'SelfWorker' || user?.role === 'Worker') && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          label={t('BankAccountNumber')}
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                          value={userData?.bankDetails?.accountNumber || ''}
                          onChange={e =>
                            setUserData(prev => ({
                              ...prev,
                              bankDetails: {
                                ...prev.bankDetails,
                                accountNumber: e.target.value,
                              },
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('IFSCCode')}
                          size="small"
                          value={userData?.bankDetails?.ifscCode || ''}
                          onChange={e =>
                            setUserData(prev => ({
                              ...prev,
                              bankDetails: {
                                ...prev.bankDetails,
                                ifscCode: e.target.value,
                              },
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('BankName')}
                          size="small"
                          value={userData?.bankDetails?.bankName || ''}
                          onChange={e =>
                            setUserData(prev => ({
                              ...prev,
                              bankDetails: {
                                ...prev.bankDetails,
                                bankName: e.target.value,
                              },
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="text"
                          size="small"
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                          label={t('AadharNumber')}
                          value={userData?.kyc?.aadharNumber || ''}
                          disabled={user?.status === 'Verified'}
                          onChange={e =>
                            setUserData(prev => ({
                              ...prev,
                              kyc: {
                                ...prev.kyc,
                                aadharNumber: e.target.value,
                              },
                            }))
                          }
                        />
                      </Grid>
                      {user?.status !== 'Verified' && (
                        <>
                          <Grid item xs={6} sm={6}>
                            <Button
                              component="label"
                              variant="contained"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: '#1565c0',
                                },
                              }}
                              aria-label={t('UploadAadharFront')}
                            >
                              {t('UploadAadharFront')}
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={e => handleKYCFileChange(e, 'aadharFront')}
                              />
                            </Button>
                          </Grid>

                          <Grid item xs={6} sm={6}>
                            <Button
                              component="label"
                              variant="contained"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: '#1565c0',
                                },
                              }}
                              aria-label={t('UploadAadharBack')}
                            >
                              {t('UploadAadharBack')}
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={e => handleKYCFileChange(e, 'aadharBack')}
                              />
                            </Button>
                          </Grid>
                        </>
                      )}
                    </>
                  )}

                  {user?.role === 'Employer' && (
                    <>
                      {/* Aadhaar Upload Buttons */}
                      {user?.status !== 'Verified' && (
                        <>
                          <Grid item xs={6} sm={6}>
                            <Button
                              component="label"
                              variant="contained"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: '#1565c0',
                                },
                              }}
                              aria-label={t('UploadAadharFront')}
                            >
                              {t('UploadAadharFront')}
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={e => handleKYCFileChange(e, 'aadharFront')}
                              />
                            </Button>
                          </Grid>

                          <Grid item xs={6} sm={6}>
                            <Button
                              component="label"
                              variant="contained"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: '#1565c0',
                                },
                              }}
                              aria-label={t('UploadAadharBack')}
                            >
                              {t('UploadAadharBack')}
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={e => handleKYCFileChange(e, 'aadharBack')}
                              />
                            </Button>
                          </Grid>
                        </>
                      )}

                      {/* GST Info Section */}
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="gst-select-label">Do you have GST?</InputLabel>
                          <Select
                            labelId="gst-select-label"
                            value={hasGST ? 'yes' : 'no'}
                            label="Do you have GST?"
                            size="small"
                            onChange={e => setHasGST(e.target.value === 'yes')}
                            disabled={user?.status === 'Verified'}
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {hasGST && (
                        <>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="GST Number"
                              name="gstNumber"
                              size="small"
                              value={userData?.kyc?.gstNumber || ''}
                              onChange={e =>
                                setUserData(prev => ({
                                  ...prev,
                                  kyc: {
                                    ...prev.kyc,
                                    gstNumber: e.target.value,
                                  },
                                }))
                              }
                              disabled={user?.status === 'Verified'}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Firm Name"
                              name="firmName"
                              size="small"
                              value={userData?.kyc?.firmName || ''}
                              onChange={e =>
                                setUserData(prev => ({
                                  ...prev,
                                  kyc: {
                                    ...prev.kyc,
                                    firmName: e.target.value,
                                  },
                                }))
                              }
                              disabled={user?.status === 'Verified'}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Firm Address"
                              name="firmAddress"
                              size="small"
                              value={userData?.kyc?.firmAddress || ''}
                              onChange={e =>
                                setUserData(prev => ({
                                  ...prev,
                                  kyc: {
                                    ...prev.kyc,
                                    firmAddress: e.target.value,
                                  },
                                }))
                              }
                              disabled={user?.status === 'Verified'}
                            />
                          </Grid>
                        </>
                      )}
                    </>
                  )}

                  {(aadharPreview.front || user?.kyc?.aadharFront) && (
                    <Grid item xs={6} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('AadharFrontPreview')}
                      </Typography>
                      <Box
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          p: 1,
                          backgroundColor: '#fafafa',
                        }}
                      >
                        <img
                          src={
                            aadharPreview.front || `${config.API_BASE_URL}/${user.kyc?.aadharFront}`
                          }
                          alt="Aadhar Front"
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: 160,
                          }}
                        />
                      </Box>
                    </Grid>
                  )}

                  {(aadharPreview.back || user?.kyc?.aadharBack) && (
                    <Grid item xs={6} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('AadharBackPreview')}
                      </Typography>
                      <Box
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          p: 1,
                          backgroundColor: '#fafafa',
                        }}
                      >
                        <img
                          src={
                            aadharPreview.back || `${config.API_BASE_URL}/${user.kyc?.aadharBack}`
                          }
                          alt="Aadhar Back"
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: 160,
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default KYCPanel;

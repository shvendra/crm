import React, { useContext, useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import KYCPanel from './KYCPanel';
import ProfilePanel from './ProfilePanel';
import ChangePasswordPanel from './ChangePasswordPanel';
import ServiceableAreaDialog from './ServiceableAreaDialog';
import { useTranslation } from 'react-i18next';
import indianStates from '../../stateDistrict';
import categories from '../../categories.json'; // Import your worker categories array
import { Box, Button, Paper, Typography, Divider, IconButton, Collapse, CircularProgress } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Context } from '../../main'; // Assuming Context provides setUser
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react'; // ✅ Edit icon
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import axios from "../../utils/axiosConfig";
import config from '../../config';
import toast from 'react-hot-toast';

const MyProfile = () => {
  // Destructure setUser from Context
  const { isAuthorized, user, setUser } = useContext(Context);
  const navigateTo = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const { i18n, t } = useTranslation();
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showKYCSection, setShowKYCSection] = useState(false); // Default open or closed
const [isSaving, setIsSaving] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [aadharPreview, setAadharPreview] = useState({
    front: null,
    back: null,
  });
  const [initialData, setInitialData] = useState(null);

  // Initialize userData state from the user context object
  const [userData, setUserData] = useState({
    _id: user?._id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    status: user?.status || '',
    state: user?.state || '',
    district: user?.district || '',
    address: user?.address || '',
    employerType: user?.employerType || {},
    addresses: user?.addresses || [],
    bmwId: user?.bmwId || '',
    bankDetails: {
      accountNumber: user?.bankDetails?.accountNumber || '',
      ifscCode: user?.bankDetails?.ifscCode || '',
      bankName: user?.bankDetails?.bankName || '',
    },
    kyc: {
      aadharNumber: user?.kyc?.aadharNumber || '',
      gstNumber: user?.kyc?.gstNumber || '',
      firmName: user?.kyc?.firmName || '',
      firmAddress: user?.kyc?.firmAddress || '',
      // Note: aadharFront/Back in state are for *new* files to upload.
      // The displayed previews should come from the user context or a separate state
      // initialized from user context if you need to show existing images.
      // For simplicity, we'll update the context and rely on it for display.
      aadharFront: null, // This will hold the *new* file object
      aadharBack: null, // This will hold the *new* file object
    },
    profilePhoto: null, // This will hold the *new* file object
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    serviceArea: user?.serviceArea || [], // <-- ADD THIS
    categories: user?.categories || [],
  });

  // Effect to update local state if user context changes (e.g., on initial load or re-login)
  useEffect(() => {
    if (user) {
      setUserData({
        _id: user._id || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        status: user.status || '',
        state: user.state || '',
        district: user.district || '',
        address: user.address || '',
        bmwId: user.bmwId || '',
        employerType: user.employerType || {},
        addresses: user.addresses || [],
        veryfiedBage: user.veryfiedBage || false,
        isSubscribed: user.isSubscribed || false,
        bankDetails: {
          accountNumber: user.bankDetails?.accountNumber || '',
          ifscCode: user.bankDetails?.ifscCode || '',
          bankName: user.bankDetails?.bankName || '',
        },
        kyc: {
          aadharNumber: user?.kyc?.aadharNumber || '',
          gstNumber: user?.kyc?.gstNumber || '',
          firmName: user?.kyc?.firmName || '',
          firmAddress: user?.kyc?.firmAddress || '',
          aadharFront: null,
          aadharBack: null,
        },
        profilePhoto: null, // Do NOT initialize profilePhoto file object here
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        serviceArea: user?.serviceArea || [],
        categories: user?.categories || [],
      });

      // Also update previews for existing images from user context
      setProfilePreview(
        user.profilePhoto ? `${config.FILE_BASE_URL}/${user.profilePhoto}?t=${Date.now()}` : null
      );
      setAadharPreview({
        front: user.kyc?.aadharFront
          ? `${config.FILE_BASE_URL}/${user.kyc.aadharFront}?t=${Date.now()}`
          : null,
        back: user.kyc?.aadharBack
          ? `${config.FILE_BASE_URL}/${user.kyc.aadharBack}?t=${Date.now()}`
          : null,
      });

      setInitialData({
        _id: user._id || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        status: user.status || '',
        state: user.state || '',
        district: user.district || '',
        address: user.address || '',
        bmwId: user.bmwId || '',
        employerType: user.employerType || {},
        addresses: user.addresses || [],
        veryfiedBage: user.veryfiedBage || '',
        isSubscribed: user.isSubscribed || false,
        bankDetails: {
          accountNumber: user.bankDetails?.accountNumber || '',
          ifscCode: user.bankDetails?.ifscCode || '',
          bankName: user.bankDetails?.bankName || '',
        },
        kyc: {
          aadharNumber: user?.kyc?.aadharNumber || '',
          gstNumber: user?.kyc?.gstNumber || '',
          firmName: user?.kyc?.firmName || '',
          firmAddress: user?.kyc?.firmAddress || '',
          aadharFront: null,
          aadharBack: null,
        },
      });
    }
  }, [user, config.API_BASE_URL]); // Depend on user and config.API_BASE_URL

  // Cleanup effect for object URLs
  useEffect(() => {
    return () => {
      if (aadharPreview.front && aadharPreview.front.startsWith('blob:'))
        URL.revokeObjectURL(aadharPreview.front);
      if (aadharPreview.back && aadharPreview.back.startsWith('blob:'))
        URL.revokeObjectURL(aadharPreview.back);
      if (profilePreview && profilePreview.startsWith('blob:')) URL.revokeObjectURL(profilePreview);
    };
  }, [aadharPreview, profilePreview]);

const handleFileChange = async (e, key = 'profilePhoto') => {
  const file = e.target.files?.[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    toast.error(t('OnlyJPGAllowed'));
    return;
  }

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.08,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });

    // ✅ revoke old preview safely
    setProfilePreview(prev => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return URL.createObjectURL(compressedFile);
    });

    // ✅ store file ONLY for API upload
    setUserData(prev => ({
      ...prev,
      [key]: compressedFile, // profilePhoto / aadharFront / aadharBack
    }));
  } catch (err) {
    console.error('Image compression failed:', err);
    toast.error(t('FailedToCompressImage'));
  }
};



  const handleKYCFileChange = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('OnlyJPGAllowed'));
      return;
    }
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.08,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      // Revoke previous blob URLs if they exist
      if (key === 'aadharFront' && aadharPreview.front && aadharPreview.front.startsWith('blob:'))
        URL.revokeObjectURL(aadharPreview.front);
      if (key === 'aadharBack' && aadharPreview.back && aadharPreview.back.startsWith('blob:'))
        URL.revokeObjectURL(aadharPreview.back);

      setAadharPreview(prev => ({
        ...prev,
        [key === 'aadharFront' ? 'front' : 'back']: URL.createObjectURL(compressedFile),
      }));

      setUserData(prev => ({
        ...prev,
        kyc: { ...prev.kyc, [key]: compressedFile },
      }));
    } catch (err) {
      console.error('Image compression failed:', err);
      toast.error('Failed to compress image.');
    }
  };

  const handleSaveUserData = async overrideData => {
    const dataToSave = overrideData || userData;
    console.log('Saving user data:', dataToSave);

    try {
      setIsSaving(true);
      const formData = new FormData();

      formData.append('userId', dataToSave._id);
      formData.append('name', dataToSave.name);
      formData.append('phone', dataToSave.phone);
      formData.append('address', dataToSave.address);
      formData.append('accountNumber', dataToSave.bankDetails.accountNumber);
      formData.append('ifscCode', dataToSave.bankDetails.ifscCode);
      formData.append('bankName', dataToSave.bankDetails.bankName);
      formData.append('serviceArea', JSON.stringify(dataToSave.serviceArea || []));
      formData.append('categories', JSON.stringify(dataToSave.categories || []));
      formData.append('oldPassword', dataToSave.oldPassword || '');
      formData.append('newPassword', dataToSave.newPassword || '');
      formData.append('confirmPassword', dataToSave.confirmPassword || '');

      if (dataToSave.profilePhoto) formData.append('profilePhoto', dataToSave.profilePhoto);
      if (dataToSave.kyc.aadharFront) formData.append('aadharFront', dataToSave.kyc.aadharFront);
      if (dataToSave.kyc.aadharBack) formData.append('aadharBack', dataToSave.kyc.aadharBack);

      formData.append('aadharNumber', dataToSave.kyc.aadharNumber || '');
      formData.append('gstNumber', dataToSave.kyc.gstNumber || '');
      formData.append('firmName', dataToSave.kyc.firmName || '');
      formData.append('firmAddress', dataToSave.kyc.firmAddress || '');

      const response = await axios.put(`${config.API_BASE_URL}/api/v1/user/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data?.message || t('ProfileUpdatedSuccessfully'));

        if (response.data.user) {
          setUser(response.data.user);

          setUserData(prev => ({
            ...prev,
            ...response.data.user,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            // ✅ Do NOT null these out, use server values
            profilePhoto: response.data.user.profilePhoto,
            kyc: {
              ...prev.kyc,
              ...response.data.user.kyc,
            },
          }));

          // ✅ Always update previews with latest URLs
          setProfilePreview(
            response.data.user.profilePhoto
              ? `${config.FILE_BASE_URL}/${response.data.user.profilePhoto}?t=${Date.now()}`
              : null
          );
          setAadharPreview({
            front: response.data.user.kyc?.aadharFront
              ? `${config.FILE_BASE_URL}/${response.data.user.kyc.aadharFront}?t=${Date.now()}`
              : null,
            back: response.data.user.kyc?.aadharBack
              ? `${config.FILE_BASE_URL}/${response.data.user.kyc.aadharBack}?t=${Date.now()}`
              : null,
          });
        }

        setShowPasswordSection(false);
      } else {
        toast.error(response.data?.message || t('ErrorUpdatingProfile'));
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || t('SomethingWentWrong'));
    } finally {
    setIsSaving(false);
  }
  };

  const isFormChanged = () => {
    if (!initialData) return false;

    const keysToCheck = ['name', 'phone', 'address'];
    for (const key of keysToCheck) {
      if (userData[key] !== initialData[key]) return true;
    }

    const kycFieldsToCompare = ['aadharNumber', 'gstNumber', 'firmName', 'firmAddress'];
    const bankFieldsToCompare = ['accountNumber', 'ifscCode', 'bankName'];

    const hasKYCChanges = kycFieldsToCompare.some(
      key => userData?.kyc?.[key] !== initialData.kyc?.[key]
    );

    const hasBankChanges = bankFieldsToCompare.some(
      key => userData.bankDetails?.[key] !== initialData.bankDetails?.[key]
    );

    if (hasKYCChanges || hasBankChanges) return true;
    // Check if new files or password fields are entered
    if (
      userData.profilePhoto ||
      userData?.kyc?.aadharFront ||
      userData?.kyc?.aadharBack ||
      userData.oldPassword ||
      userData.newPassword ||
      userData.confirmPassword
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (!isAuthorized) navigateTo('/landing');
  }, [isAuthorized, navigateTo]);

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        margin: 'auto',
        mb: 10,
        zIndex: 1,
        position: 'relative',
      }}
    >
           <Box 
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 2,  mx: "auto"
                      }}
                    >
                      <Box
                         onClick={() => navigateTo(-1)}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                          "&:hover": { backgroundColor: "#f1f1f1" },
                        }}
                      >
                        <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                      </Box>
                   <Box>
        <Typography fontSize={16} fontWeight={700}>
          {t('ProfileInfo')}
        </Typography>
      
        <Typography fontSize={12} color="text.secondary">
          {t('ProfileInfo')}/{t('KYC')}/{t('ServiceableAreaAndWorkerCategories')}
        </Typography>
      </Box>
      
                    </Box>
      <Box component="form" onSubmit={e => e.preventDefault()}>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            background: '#fff',
            p: 1,
          }}
        >
          <Box
            className="profilehead"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {t('ProfileInfo')}
            </Typography>
            <Typography
              sx={{
                fontWeight: 'bold',
                marginRight: '7px',
                color: user?.bmwId ? 'green' : '#4a4a4a',
                fontSize: () => '17px',
                background: 'white',
                borderRadius: '7px',
                paddingLeft: '9px',
                paddingRight: '8px',
              }}
            >
              ID : {user?.bmwId || 'Not Assigned'}
            </Typography>
          </Box>
          {/* Pass updated userData and previews to ProfilePanel */}
          <ProfilePanel
            user={user}
            userData={userData}
            setUserData={setUserData}
            profilePreview={profilePreview}
            handleFileChange={handleFileChange}
          />
          {(user?.role === 'Agent' || user?.role === 'SelfWorker' || user?.role === 'Worker') && (
            <Box
              className="profilehead"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              {/* Left Side Label */}
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {t('ServiceableAreaAndWorkerCategories')}
              </Typography>
              {/* Right Side Edit Icon */}
              <IconButton size="small" onClick={() => setOpenDialog(true)} sx={{ color: 'gray' }}>
                <Pencil size={18} />
              </IconButton>
            </Box>
          )}
          <Box
            className="profilehead"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
              mb: showKYCSection ? 0 : 0,
              mt: 2, // Added margin top
            }}
            onClick={() => setShowKYCSection(prev => !prev)}
            aria-expanded={showKYCSection}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setShowKYCSection(prev => !prev);
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {t('KYC')}
            </Typography>
            <IconButton
              size="medium"
              aria-label={showKYCSection ? 'Collapse KYC section' : 'Expand KYC section'}
            >
              {showKYCSection ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showKYCSection} timeout="auto" unmountOnExit>
            {/* Pass updated userData and previews to KYCPanel */}
            <KYCPanel
              user={user} // Still pass original user for initial data if needed
              userData={userData}
              setUserData={setUserData}
              handleKYCFileChange={handleKYCFileChange}
              aadharPreview={aadharPreview}
              config={config}
            />
          </Collapse>

          <Box
            className="profilehead"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
              mb: showPasswordSection ? 2 : 0,
              mt: 2, // Added margin top
            }}
            onClick={() => setShowPasswordSection(prev => !prev)}
            aria-expanded={showPasswordSection}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setShowPasswordSection(prev => !prev);
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {t('ChangePassword')}
            </Typography>
            <IconButton
              size="medium"
              aria-label={
                showPasswordSection
                  ? 'Collapse Change Password section'
                  : 'Expand Change Password section'
              }
            >
              {showPasswordSection ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showPasswordSection} timeout="auto" unmountOnExit>
            {/* Pass updated userData to ChangePasswordPanel */}
            <ChangePasswordPanel
              userData={userData}
              setUserData={setUserData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </Collapse>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!isFormChanged()}
              size="small"
              onClick={() => handleSaveUserData()} // ✅ Call manually instead of relying on native submit
            >
              {t('Submit')}
            </Button>
          </Box>
        </Box>
        {isSaving && (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(255,255,255,0.6)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress size={40} />
  </Box>
)}

      </Box>
      <ServiceableAreaDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        indianStates={indianStates}
        categories={categories}
        selectedUser={user}
        onApply={data => {
          // Build updated object FIRST
          const updatedUserData = {
            ...userData,
            serviceArea: data.districts || [],
            categories: data.categories || [],
          };

          // Update state
          setUserData(updatedUserData);

          // ✅ Pass updated object directly to save function
          handleSaveUserData(updatedUserData);

          setOpenDialog(false);
        }}
        lang={i18n.language}
      />
    </Box>
  );
};

export default MyProfile;

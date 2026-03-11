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
      minHeight: "100vh",
      backgroundColor: "#f5f7fb",
      pb: 8,
      px: { xs: 1, md: 2 },
      pt: 1,
    }}
  >
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "auto",
        zIndex: 1,
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "rgba(245,247,251,0.92)",
          backdropFilter: "blur(10px)",
          border: "1px solid #e8edf5",
          borderRadius: 3,
          px: 2,
          py: 1.2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            onClick={() => navigateTo(-1)}
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "#f8fafc" },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#1f2937" }} />
          </Box>

          <Box>
            <Typography fontSize={17} fontWeight={800} color="#1f2a44">
              {t("ProfileInfo")}
            </Typography>

            <Typography fontSize={12} color="#6b7280">
              {t("ProfileInfo")} / {t("KYC")} / {t("ServiceableAreaAndWorkerCategories")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box component="form" onSubmit={(e) => e.preventDefault()}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
            background: "#fff",
            p: { xs: 1.2, md: 2 },
            border: "1px solid #e8edf5",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '"BookMyWorker"',
              position: "absolute",
              top: "48%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: { xs: "2.2rem", md: "5rem" },
              fontWeight: 800,
              color: "rgba(37,99,235,0.04)",
              zIndex: 0,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            },
          }}
        >
          {/* Profile Header */}
         <Box
  className="profilehead"
  sx={{
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row", // Always row
    flexWrap: "nowrap",   // Prevent wrapping
    gap: 1,
    mb: 2,
    px: 1.5,
    py: 1.3,
    borderRadius: 3,
    background: "linear-gradient(180deg, #f8fbff 0%, #f2f6fc 100%)",
    border: "1px solid #edf2f7",
  }}
>
  {/* Left Title */}
  <Typography
    variant="h6"
    sx={{
      fontWeight: 800,
      color: "#2563eb",
      fontSize: { xs: "0.95rem", sm: "1rem", md: "1.2rem" },
      whiteSpace: "nowrap",
    }}
  >
    {t("ProfileInfo")}
  </Typography>

  {/* Right ID */}
  <Typography
    sx={{
      fontWeight: 800,
      color: user?.bmwId ? "#15803d" : "#475467",
      fontSize: { xs: "0.8rem", sm: "0.9rem" },
      background: "#ffffff",
      borderRadius: "999px",
      px: 1.5,
      py: 0.5,
      border: "1px solid #e5e7eb",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}
  >
    ID : {user?.bmwId || "Not Assigned"}
  </Typography>
</Box>

          {/* Profile Panel */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <ProfilePanel
              user={user}
              userData={userData}
              setUserData={setUserData}
              profilePreview={profilePreview}
              handleFileChange={handleFileChange}
            />
          </Box>

          {/* Serviceable Area */}
          {(user?.role === "Agent" ||
            user?.role === "SelfWorker" ||
            user?.role === "Worker") && (
            <Box
              className="profilehead"
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                userSelect: "none",
                mt: 3,
                px: 1.5,
                py: 1.3,
                borderRadius: 3,
                border: "1px solid #edf2f7",
                backgroundColor: "#fcfdff",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#1f2a44",
                  fontWeight: 700,
                  fontSize: { xs: "0.98rem", md: "1.05rem" },
                }}
              >
                {t("ServiceableAreaAndWorkerCategories")}
              </Typography>

              <IconButton
                size="small"
                onClick={() => setOpenDialog(true)}
                sx={{
                  color: "#64748b",
                  border: "1px solid #dbe3ef",
                  backgroundColor: "#fff",
                  "&:hover": { backgroundColor: "#f8fbff" },
                }}
              >
                <Pencil size={18} />
              </IconButton>
            </Box>
          )}

          {/* KYC */}
          <Box
            className="profilehead"
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              userSelect: "none",
              mt: 3,
              px: 1.5,
              py: 1.2,
              borderRadius: 3,
              border: "1px solid #edf2f7",
              backgroundColor: "#fcfdff",
            }}
            onClick={() => setShowKYCSection((prev) => !prev)}
            aria-expanded={showKYCSection}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setShowKYCSection((prev) => !prev);
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#2563eb",
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              {t("KYC")}
            </Typography>

            <IconButton
              size="medium"
              aria-label={showKYCSection ? "Collapse KYC section" : "Expand KYC section"}
              sx={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
              }}
            >
              {showKYCSection ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showKYCSection} timeout="auto" unmountOnExit>
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                mt: 1.5,
                p: { xs: 1, md: 1.5 },
                borderRadius: 3,
                backgroundColor: "#ffffff",
                border: "1px solid #edf2f7",
              }}
            >
              <KYCPanel
                user={user}
                userData={userData}
                setUserData={setUserData}
                handleKYCFileChange={handleKYCFileChange}
                aadharPreview={aadharPreview}
                config={config}
              />
            </Box>
          </Collapse>

          {/* Change Password */}
          <Box
            className="profilehead"
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              userSelect: "none",
              mt: 3,
              px: 1.5,
              py: 1.2,
              borderRadius: 3,
              border: "1px solid #edf2f7",
              backgroundColor: "#fcfdff",
            }}
            onClick={() => setShowPasswordSection((prev) => !prev)}
            aria-expanded={showPasswordSection}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setShowPasswordSection((prev) => !prev);
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#2563eb",
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              {t("ChangePassword")}
            </Typography>

            <IconButton
              size="medium"
              aria-label={
                showPasswordSection
                  ? "Collapse Change Password section"
                  : "Expand Change Password section"
              }
              sx={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
              }}
            >
              {showPasswordSection ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showPasswordSection} timeout="auto" unmountOnExit>
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                mt: 1.5,
                p: { xs: 1, md: 1.5 },
                borderRadius: 3,
                backgroundColor: "#ffffff",
                border: "1px solid #edf2f7",
              }}
            >
              <ChangePasswordPanel
                userData={userData}
                setUserData={setUserData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            </Box>
          </Collapse>
        </Paper>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!isFormChanged()}
            size="large"
            onClick={() => handleSaveUserData()}
            sx={{
              minWidth: 180,
              py: 1.25,
              px: 3,
              borderRadius: 3,
              fontWeight: 800,
              textTransform: "none",
              background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
              boxShadow: "0 10px 22px rgba(37,99,235,0.22)",
              "&:hover": {
                background: "linear-gradient(90deg, #1d4ed8, #1e40af)",
                boxShadow: "0 12px 24px rgba(37,99,235,0.28)",
              },
              "&:disabled": {
                background: "#d1d5db",
                color: "#7b8794",
              },
            }}
          >
            {t("Submit")}
          </Button>
        </Box>

        {isSaving && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.65)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
        onApply={(data) => {
          const updatedUserData = {
            ...userData,
            serviceArea: data.districts || [],
            categories: data.categories || [],
          };

          setUserData(updatedUserData);
          handleSaveUserData(updatedUserData);
          setOpenDialog(false);
        }}
        lang={i18n.language}
      />
    </Box>
  </Box>
);
};

export default MyProfile;

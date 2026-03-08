import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import config from "../config";

/* ---------------- Upload Card ---------------- */
const UploadBox = ({ label, onChange, preview }) => (
  <Card
    sx={{
      p: 2,
      borderRadius: 3,
      textAlign: "center",
      boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    }}
  >
    <Typography fontWeight={700} mb={1}>
      {label}
    </Typography>

    <Avatar
      src={preview}
      variant="rounded"
      sx={{
        width: "100%",
        height: 160,
        mb: 1,
        bgcolor: "#f5f5f5",
      }}
    />

    <Button
      variant="contained"
      component="label"
      startIcon={<CloudUploadIcon />}
      sx={{ textTransform: "none", borderRadius: 2 }}
      fullWidth
    >
      Upload
      <input hidden type="file" accept="image/*" onChange={onChange} />
    </Button>
  </Card>
);

/* ---------------- Main Page ---------------- */
const KycUploadPage = () => {
  const { jobId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [previews, setPreviews] = useState({
    profilePhoto: "",
    aadharFront: "",
    aadharBack: "",
  });

  /* -------- Image Compression Helper -------- */
  const compressImage = async (file, field) => {
    const isProfile = field === "profilePhoto";

    return await imageCompression(file, {
      maxSizeMB: isProfile ? 0.08 : 0.15, // profile smaller, Aadhaar clearer
      maxWidthOrHeight: isProfile ? 400 : 1200,
      useWebWorker: true,
      fileType: "image/jpeg",
    });
  };

  /* -------- Upload API -------- */
  const uploadFile = async (file, field) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append(field, file);

      await axios.put(
        `${config.API_BASE_URL}/api/v1/user/upload-kyc/${jobId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccess("Saved automatically ✔");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Upload failed. Link may be expired."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------- File Change Handler -------- */
  const handleChange = field => async e => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG or PNG images are allowed");
      return;
    }

    try {
      const compressedFile = await compressImage(file, field);

      // revoke old preview blob
      setPreviews(prev => {
        if (prev[field]?.startsWith("blob:")) {
          URL.revokeObjectURL(prev[field]);
        }
        return {
          ...prev,
          [field]: URL.createObjectURL(compressedFile),
        };
      });

      uploadFile(compressedFile, field);
    } catch (err) {
      console.error("Compression failed:", err);
      setError("Failed to compress image. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          p: 3,
          mt: 3,
          mb: 9,
          boxShadow: "0 15px 50px rgba(0,0,0,0.25)",
        }}
      >
        <Box textAlign="center" mb={2}>
          <Typography fontSize={20} fontWeight={800}>
            Complete Your KYC
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Upload documents — auto saved
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          <UploadBox
            label="अपनी फोटो अपलोड करें (Profile Photo)"
            onChange={handleChange("profilePhoto")}
            preview={previews.profilePhoto}
          />

          <UploadBox
            label="आधार कार्ड (फ्रंट साइड)"
            onChange={handleChange("aadharFront")}
            preview={previews.aadharFront}
          />

          <UploadBox
            label="आधार कार्ड (बैक साइड)"
            onChange={handleChange("aadharBack")}
            preview={previews.aadharBack}
          />
        </Box>

        {loading && (
          <Box textAlign="center" mt={2}>
            <CircularProgress size={24} />
            <Typography fontSize={12} mt={1}>
              Uploading…
            </Typography>
          </Box>
        )}

        <Typography
          mt={3}
          fontSize={11}
          color="text.secondary"
          textAlign="center"
        >
          🔒 This link is secure and valid for 7 days only
        </Typography>
      </Card>
    </Box>
  );
};

export default KycUploadPage;

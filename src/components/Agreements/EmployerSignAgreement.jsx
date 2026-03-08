import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../utils/axiosConfig";

import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import config from '../../config';

export default function EmployerSignAgreement() {
  const { id } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);

  // Fetch agreement
  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const { data } = await axios.get(`${config.API_BASE_URL}/api/v1/admin/agreements/${id}`);
        setAgreement(data?.agreement);
      } catch (err) {
        console.error(err);
        showSnackbar('Agreement not found or deleted');
      } finally {
        setLoading(false);
      }
    };
    fetchAgreement();
  }, [id]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 600;
      canvas.height = 200;
      ctxRef.current = canvas.getContext('2d');
      ctxRef.current.lineWidth = 2;
      ctxRef.current.strokeStyle = 'black';
    }
  }, []);

  const startDrawing = e => {
    if (!ctxRef.current) return; // ✅ prevent error
    drawing.current = true;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = e => {
    if (!drawing.current || !ctxRef.current) return; // ✅ prevent error
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return; // ✅ prevent error
    drawing.current = false;
    ctxRef.current.closePath();
  };

  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return; // ✅ prevent error
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const submitSignature = async () => {
    try {
      setSubmitting(true);
      const signatureData = canvasRef.current.toDataURL('image/png');
      await axios.post(`${config.API_BASE_URL}/api/v1/agreements/${id}/sign`, {
        signature: signatureData,
      });
      showSnackbar('✅ Agreement signed successfully!');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to submit signature');
    } finally {
      setSubmitting(false);
    }
  };

  const showSnackbar = message => setSnackbar({ open: true, message });

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;

  if (!agreement)
    return (
      <Typography color="error" textAlign="center" mt={5}>
        ❌ Agreement not found
      </Typography>
    );

  return (
    <Box
      sx={{
        position: 'relative',
        p: 4,
        maxWidth: 900,
        mx: 'auto',
        my: 5,
        border: '2px solid #333',
        borderRadius: 2,
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Watermark */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(200,200,200,0.05) 0,
            rgba(200,200,200,0.05) 1px,
            transparent 1px,
            transparent 20px
          )`,
        }}
      />

      {/* Header: BookMyWorker */}
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" fontWeight="bold">
          BookMyWorker
        </Typography>
        <Typography variant="body2">
          Address: 123 Corporate Ave, Indore, MP | GST: 23AAAAA0000A1Z5
        </Typography>
        <Divider sx={{ mt: 1, borderColor: '#333' }} />
      </Box>

      {/* Employer Info */}
      <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Employer Details
        </Typography>
        <Typography>Name: {agreement.employer?.name || '-'}</Typography>
        <Typography>Contact: {agreement.employer?.phone || '-'}</Typography>
        {agreement.employer?.company && <Typography>Firm: {agreement.employer.company}</Typography>}
        {agreement.employer?.gst && <Typography>GST: {agreement.employer.gst}</Typography>}
        {agreement.employer?.address && (
          <Typography>Address: {agreement.employer.address}</Typography>
        )}
      </Box>

      {/* Work Details */}
      <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Work Details
        </Typography>
        {agreement.work &&
          Object.entries(agreement.work).map(([key, value]) => (
            <Typography key={key}>
              <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value || '-'}
            </Typography>
          ))}
      </Box>

      {/* Terms */}
      <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Terms & Conditions
        </Typography>
        <ul>
          {agreement.terms?.map((t, i) => (
            <li key={i}>
              <Typography variant="body2">{t}</Typography>
            </li>
          ))}
        </ul>
      </Box>

      {/* Signature */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="subtitle1" mb={1}>
          Sign Below:
        </Typography>
        <canvas
          ref={canvasRef}
          width={600} // actual drawing surface width
          height={200} // actual drawing surface height
          style={{
            border: '1px solid black',
            width: '600px',
            height: '200px',
            cursor: 'crosshair',
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
        />

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" onClick={clearCanvas}>
            Clear
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={submitting}
            onClick={submitSignature}
          >
            {submitting ? <CircularProgress size={20} /> : 'Submit Signature'}
          </Button>
        </Stack>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
}

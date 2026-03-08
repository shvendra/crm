import React, { useState } from "react";
import axios from "../../utils/axiosConfig";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Snackbar,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import config from "../../config";

const defaultTerms = [
  "Employer agrees to pay all wages for workers through BookMyWorker platform.",
  "Employer is solely responsible for worker safety and compliance with labor laws.",
  "Workers must be provided PPE, food, accommodation, and transport as applicable.",
  "BookMyWorker acts as a payment and worker allocation platform and is not responsible for on-site safety or legal compliance.",
  "Payment to workers must be timely, and any disputes regarding wages will be resolved by the employer.",
  "Workers must follow employer's instructions while on duty.",
  "Any misconduct or violation by workers or employer will be reported to BookMyWorker for records.",
  "Employer must ensure work environment meets statutory labor safety and legal standards.",
  "All legal compliance, including statutory benefits, is the responsibility of the employer.",
];

export default function AgreementCreator() {
  const [ern, setErn] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [signedLink, setSignedLink] = useState("");
  const [selectedTerms, setSelectedTerms] = useState(defaultTerms);
  const [newTerm, setNewTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleFetch = async () => {
    if (!ern) return showSnackbar("Please enter ERN number");
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${config.API_BASE_URL}/api/v1/admin/workstreams/${ern}`,
        { withCredentials: true }
      );
      setDetails(data);
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  const toggleTerm = (term) => {
    setSelectedTerms((prev) =>
      prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term]
    );
  };

  const handleAddTerm = () => {
    if (!newTerm.trim()) return;
    setSelectedTerms((prev) => [...prev, newTerm.trim()]);
    setNewTerm("");
  };

  const handleRemoveTerm = (term) => {
    setSelectedTerms((prev) => prev.filter((t) => t !== term));
  };

  const handleCreateAgreement = async () => {
    if (!details) return showSnackbar("Please fetch ERN details first");
    try {
      setCreating(true);
      const payload = {
        ern,
        employer: details.employer,
        work: details.work,
        terms: selectedTerms,
      };
      const { data } = await axios.post(
        `${config.API_BASE_URL}/api/v1/admin/agreements`,
        payload,
        { withCredentials: true }
      );
      
      // ✅ Use API response link directly
      setSignedLink(data.signedLink);
      showSnackbar("Agreement link generated successfully!");
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Failed to generate agreement");
    } finally {
      setCreating(false);
    }
  };

  const showSnackbar = (message) => setSnackbar({ open: true, message });

  return (
    <Box className="p-4 max-w-2xl mx-auto">
      <Card className="shadow-xl rounded-2xl">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Generate Agreement Link
          </Typography>

          {/* ERN Input */}
          <Stack direction="row" spacing={2} className="my-3">
            <TextField
              label="Enter ERN Number"
              variant="outlined"
              fullWidth
              value={ern}
              onChange={(e) => setErn(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleFetch}
            >
              {loading ? <CircularProgress size={20} /> : "Fetch"}
            </Button>
          </Stack>

          {/* Employer + Work Details */}
          {details && (
            <Box className="bg-gray-50 p-3 rounded-lg border my-3">
              <Typography variant="subtitle1">
                <strong>Employer:</strong> {details.employer?.name} ({details.employer?.company})
              </Typography>
              <Typography variant="body2">📍 {details.employer?.address}</Typography>
              <Typography variant="body2">📞 {details.employer?.phone}</Typography>

              <Typography className="mt-3" variant="subtitle1">
                <strong>Work:</strong> {details.work?.title}
              </Typography>
              <Typography variant="body2">{details.work?.description}</Typography>

              {/* Select Terms */}
              <Divider className="my-3" />
              <Typography variant="subtitle1" gutterBottom>
                Select / Add Terms & Conditions:
              </Typography>
              {selectedTerms.map((term) => (
                <FormControlLabel
                  key={term}
                  control={
                    <Checkbox
                      checked={true}
                      onChange={() => toggleTerm(term)}
                    />
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>{term}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveTerm(term)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  }
                />
              ))}

              {/* Add Custom Term */}
              <Stack direction="row" spacing={2} mt={2}>
                <TextField
                  label="Add New Term"
                  variant="outlined"
                  fullWidth
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                />
                <Button onClick={handleAddTerm} variant="outlined">
                  Add
                </Button>
              </Stack>

              {/* Create Agreement Button */}
              <Stack spacing={2} className="mt-4">
                <Button
                  variant="contained"
                  color="success"
                  disabled={creating}
                  onClick={handleCreateAgreement}
                >
                  {creating ? <CircularProgress size={20} /> : "Generate Link"}
                </Button>
              </Stack>
            </Box>
          )}

          {/* Generated Link */}
          {signedLink && (
            <Box className="mt-4 bg-green-100 p-3 rounded-lg">
              <Typography variant="body1" color="green">
                ✅ Agreement Link Generated
              </Typography>
              <Typography variant="body2">
                <a href={signedLink} target="_blank" rel="noopener noreferrer">
                  {signedLink}
                </a>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </Box>
  );
}

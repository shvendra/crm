import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const i18nLabels = {
  dialogTitle: {
    en: 'Preferred Location & Preferred Work',
    hi: 'सेवा योग्य क्षेत्र और वर्क प्रकार',
    mr: 'सेवेचे क्षेत्र व कामगार प्रकार',
    gu: 'સેવામાં આવતા વિસ્તાર અને કામ પ્રકાર',
  },
  dialogSubtitle: {
    en: 'Please tell us which areas you can work in and what types of workers are available.',
    hi: 'कृपया बताएं कि आप किन-किन क्षेत्रों में काम कर सकते हैं और किस प्रकार के वर्कर्स उपलब्ध हैं।',
    mr: 'कृपया सांगा की आपण कोणत्या भागात काम करू शकता आणि कोणत्या प्रकारचे कामगार उपलब्ध आहेत.',
    gu: 'કૃપા કરીને જણાવો કે તમે કયા વિસ્તારોમાં કામ કરી શકો છો અને કયા પ્રકારના કામદાર ઉપલબ્ધ છે.',
  },
  category: {
    en: 'Work Categories',
    hi: 'वर्क केटेगरी',
    mr: 'कामगार श्रेणी',
    gu: 'કામ શ્રેણીઓ',
  },
  selectCategories: {
    en: 'Select Categories',
    hi: 'केटेगरी चुनें',
    mr: 'श्रेणी निवडा',
    gu: 'શ્રેણીઓ પસંદ કરો',
  },
  state: {
    en: 'State',
    hi: 'राज्य',
    mr: 'राज्य',
    gu: 'રાજ્ય',
  },
  districts: {
    en: 'Select Districts',
    hi: 'जिले चुनें',
    mr: 'जिल्हे निवडा',
    gu: 'જિલ્લાઓ પસંદ કરો',
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    mr: 'रद्द करा',
    gu: 'રદ્દ કરો',
  },
  save: {
    en: 'Save',
    hi: 'सेव करें',
    mr: 'जतन करा',
    gu: 'સેવ કરો',
  },
};

const ServiceableAreaDialog = ({
  open,
  onClose,
  indianStates,
  categories,
  selectedUser,
  onApply,
  lang = 'en',
}) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { t, i18n } = useTranslation();
const allSubCategories = categories.flatMap(main =>
  main.subcategories.map(sub => ({
    ...sub,
    parent: main.label
  }))
);
  // ✅ Pre-fill values whenever dialog opens
  useEffect(() => {
    if (open && selectedUser) {
      setSelectedState(selectedUser.state || '');
      setSelectedAreas(selectedUser.serviceArea || []);
      setSelectedCategories(selectedUser.categories || []);
    }
  }, [open, selectedUser]);

  const handleDistrictChange = event => {
    const {
      target: { value },
    } = event;
    setSelectedAreas(typeof value === 'string' ? value.split(',') : value);
  };

  const handleCategoryChange = event => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = () => {
    onApply({
      state: selectedState,
      districts: selectedAreas,
      categories: selectedCategories,
    });
    onClose();
  };

return (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 4,
        p: 0.5,
        border: "1px solid #e8edf5",
        boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
        overflow: "hidden",
      },
    }}
  >
    <DialogTitle
      sx={{
        pb: 1,
        px: 2,
        pt: 2,
        background: "linear-gradient(180deg, #f8fbff 0%, #f2f6fc 100%)",
        borderBottom: "1px solid #edf2f7",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          fontSize: "1.08rem",
          color: "#1f2a44",
        }}
      >
        {i18nLabels.dialogTitle[lang]}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#6b7280",
          mt: 0.5,
          fontSize: "0.84rem",
          lineHeight: 1.6,
        }}
      >
        {i18nLabels.dialogSubtitle[lang]}
      </Typography>
    </DialogTitle>

    <DialogContent
      dividers
      sx={{
        pt: 2,
        px: 2,
        backgroundColor: "#ffffff",
      }}
    >
      {/* Category Selection */}
      <FormControl size="small" sx={{ width: "100%", mb: 2 }}>
        <InputLabel id="category-label">{i18nLabels.category[lang]}</InputLabel>
        <Select
          labelId="category-label"
          multiple
          value={selectedCategories}
          onChange={handleCategoryChange}
          input={<OutlinedInput label={i18nLabels.category[lang]} />}
          renderValue={(selected) =>
            selected.length === 0
              ? i18nLabels.selectCategories[lang]
              : selected
                  .map((val) => {
                    const sub = allSubCategories.find((s) => s.value === val);
                    if (!sub) return val;

                    return i18n.language === "hi"
                      ? sub.hindilabel
                      : i18n.language === "mr"
                        ? sub.marathilabel
                        : i18n.language === "gu"
                          ? sub.gujaratilabel
                          : sub.label;
                  })
                  .join(", ")
          }
          sx={{
            borderRadius: 3,
            backgroundColor: "#fafbff",
            "& .MuiSelect-select": {
              minHeight: "22px",
            },
          }}
        >
          {allSubCategories.map((sub) => (
            <MenuItem key={sub.value} value={sub.value}>
              <Checkbox
                sx={{ p: 0.5, mr: 1 }}
                checked={selectedCategories.includes(sub.value)}
              />
              {i18n.language === "hi"
                ? sub.hindilabel
                : i18n.language === "mr"
                  ? sub.marathilabel
                  : i18n.language === "gu"
                    ? sub.gujaratilabel
                    : sub.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* State Dropdown */}
      <FormControl size="small" sx={{ width: "100%", mb: 2 }} variant="outlined">
        <InputLabel id="state-label">{i18nLabels.state[lang]}</InputLabel>
        <Select
          labelId="state-label"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          label={i18nLabels.state[lang]}
          sx={{
            borderRadius: 3,
            backgroundColor: "#fafbff",
          }}
        >
          {Object.keys(indianStates).map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* District Multi-Select */}
      {selectedState && (
        <FormControl size="small" sx={{ width: "100%", mb: 1 }}>
          <Select
            multiple
            value={selectedAreas}
            onChange={handleDistrictChange}
            input={<OutlinedInput placeholder={i18nLabels.districts[lang]} />}
            renderValue={(selected) =>
              selected.length === 0
                ? i18nLabels.districts[lang]
                : selected.join(", ")
            }
            sx={{
              borderRadius: 3,
              backgroundColor: "#fafbff",
              "& .MuiSelect-select": {
                minHeight: "22px",
              },
            }}
          >
            {Object.keys(indianStates[selectedState] || {}).map((district) => (
              <MenuItem key={district} value={district}>
                <Checkbox
                  sx={{ p: 0.5, mr: 1 }}
                  checked={selectedAreas.includes(district)}
                />
                <ListItemText primary={district} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </DialogContent>

    <DialogActions
      sx={{
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        borderTop: "1px solid #edf2f7",
        backgroundColor: "#fcfdff",
      }}
    >
      <Button
        onClick={onClose}
        size="small"
        variant="outlined"
        sx={{
          borderRadius: 2.5,
          textTransform: "none",
          fontWeight: 700,
          px: 2.2,
        }}
      >
        {i18nLabels.cancel[lang]}
      </Button>

      <Button
        onClick={handleSubmit}
        variant="contained"
        size="small"
        sx={{
          borderRadius: 2.5,
          textTransform: "none",
          fontWeight: 700,
          px: 2.5,
          background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
          boxShadow: "0 10px 20px rgba(37,99,235,0.16)",
          "&:hover": {
            background: "linear-gradient(90deg, #1d4ed8, #1e40af)",
          },
        }}
      >
        {i18nLabels.save[lang]}
      </Button>
    </DialogActions>
  </Dialog>
);
};

export default ServiceableAreaDialog;

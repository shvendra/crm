import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';
import { translateFromJson } from './Transform';
import { useTranslation } from 'react-i18next';

const getCustomTimeLabel = isoString => {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? 'Morning' : 'Evening';

  const formattedHour = hours % 12 || 12; // 0 → 12
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHour}:${formattedMinutes} ${period}`;
};
const AboutWorkSection = ({ stream, t }) => {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {stream.remarks && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: '#394839',
            padding: '0px 4px',
            borderRadius: '8px',
          }}
        >
          <WorkIcon
            onClick={handleOpen}
            style={{ fontSize: '17px', fontWeight: 600 }}
            fontSize="small"
            color="primary"
          />
          <Typography
            variant="body2"
            onClick={handleOpen}
            sx={{
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <strong>{t('workType')}:</strong> {translateFromJson(stream?.workType, i18n.language)}
            {' - '}
            {translateFromJson(stream?.subCategory, i18n.language)}{' '}
            <span
              style={{
                marginLeft: '6px',
                color: '#187eb9',
                fontWeight: 700,
                animation: 'pulse 1.5s infinite',
              }}
            >
              {t('ReadMore')}
            </span>
            <style>
              {`
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.4; }
        100% { opacity: 1; }
      }
    `}
            </style>
          </Typography>

          {/* Modal Dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                borderRadius: 3,
                p: 1,
              },
            }}
          >
            <DialogTitle
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#187eb9',
                pb: 0,
              }}
            >
              🧰 {t('aboutwork')}
            </DialogTitle>

            <DialogContent
              dividers
              sx={{
                fontSize: '0.95rem',
                color: '#333',
                whiteSpace: 'pre-line',
                lineHeight: 1.6,
                mt: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  <strong>{t('dateOfWork')}:</strong>{' '}
                  {stream.inTime && stream.outTime
                    ? `${getCustomTimeLabel(stream.inTime)} - ${getCustomTimeLabel(stream.outTime)}`
                    : t('generalTime')}
                </Typography>
              </Box>
              <strong>{translateFromJson(stream?.subCategory, i18n.language)} </strong> <br />
              {stream.remarks}
            </DialogContent>

            <DialogActions>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={{
                  backgroundColor: '#187eb9',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                {t('close')}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default AboutWorkSection;

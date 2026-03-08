import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';

const AboutWork = ({ stream, t }) => {
  const [expanded, setExpanded] = useState(false);

  // Split the remarks text into words
  const words = stream?.remarks?.split(' ') || [];
  const shortText = words.slice(0, 25).join(' '); // ✅ show up to 25 words
  const hasMore = words.length > 25;

  return (
    <Box>
      <Typography
        variant="body1"
        sx={{ display: 'inline', fontWeight: 400 }} // slightly lighter overall
      >
        <strong style={{ fontWeight: 600 }}>{t('aboutwork')}:</strong>{' '}
        <span style={{ fontSize: '14px', color: "white" }}>
          {expanded ? stream.remarks : shortText}
          {!expanded && hasMore ? '...' : ''}
        </span>
      </Typography>

      {hasMore && (
        <Button
          onClick={() => setExpanded(!expanded)}
          sx={{
            ml: 1,
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: '#1976d2',
            p: 0,
            minWidth: 'auto',
          }}
        >
          {expanded ? t('ReadLess') : t('ReadMore')}
        </Button>
      )}
    </Box>
  );
};

export default AboutWork;

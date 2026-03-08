import React, { useContext } from 'react';
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";
import { Box, Typography, IconButton, Grid } from '@mui/material';

function Footer() {
  const { isAuthorized } = useContext(Context);

  return (
    <Box 
      component="footer" 
      sx={{
        display: isAuthorized ? 'block' : 'none',
        padding: 2,
        backgroundColor: '#b3b2b1',
        color: 'white',
        textAlign: 'center',
        marginTop: '15px',
      }}
    >
      {/* <Typography variant="body2" color="inherit" gutterBottom>
        &copy; All Rights Reserved by Shivendra.
      </Typography> */}

    </Box>
  );
}

export default Footer;

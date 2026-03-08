import React, { useContext } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../../main';

const AuthDebug = () => {
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Authentication Debug Page
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary">
            Authentication Status
          </Typography>
          <Typography>
            <strong>isAuthorized:</strong> {String(isAuthorized)}
          </Typography>
          <Typography>
            <strong>Current Path:</strong> {location.pathname}
          </Typography>
          <Typography>
            <strong>User Exists:</strong> {user ? 'Yes' : 'No'}
          </Typography>
          {user && (
            <>
              <Typography>
                <strong>User Name:</strong> {user.name}
              </Typography>
              <Typography>
                <strong>User Role:</strong> {user.role}
              </Typography>
              <Typography>
                <strong>User ID:</strong> {user._id}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/dashboard')}
        >
          Go to Home
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </Box>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary">
            Debug Info
          </Typography>
          <Typography variant="body2">
            This page helps debug authentication issues.
            If you're seeing this page after login, the routing is working.
          </Typography>
          <pre style={{ fontSize: '12px', marginTop: '10px' }}>
            {JSON.stringify({ isAuthorized, userExists: !!user, path: location.pathname }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthDebug;
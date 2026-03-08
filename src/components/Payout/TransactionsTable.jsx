import React, { useEffect, useState } from 'react';
import { TableBody, TableRow, TableCell, Box, CircularProgress, Typography } from '@mui/material';

function TransactionsTable({ transactions = [], user, handleRowClick }) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Hide loader after 3 seconds (adjust time as needed)
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TableBody>
      {showLoader && transactions.length === 0 ? (
        <TableRow>
          <TableCell colSpan={9999} sx={{ p: 4 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="100%"
            >
              <CircularProgress size={32} />
            </Box>
          </TableCell>
        </TableRow>
      ) : transactions.length === 0 ? (
        <TableRow>
          <TableCell colSpan={9999} sx={{ p: 4 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="100%"
            >
              <Typography variant="body2" color="textSecondary">
                No transactions found
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      ) : (
        transactions.map((txn, idx) => (
          <TableRow
            key={txn._id || idx}
            hover={user?.role === 'Employer'}
            onClick={user?.role === 'Employer' ? () => handleRowClick(txn) : undefined}
            sx={{
              cursor: user?.role === 'Employer' ? 'pointer' : 'default',
            }}
          >
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
  {(() => {
    const status =
      user?.role === 'Agent' || user?.role === 'SelfWorker'
        ? txn.creditTransactionId
          ? 'Completed'
          : txn.paymentStatus
        : txn.creditTransactionId
          ? 'Paid'
          : txn.paymentStatus;

    // Make first letter uppercase, rest lowercase
    return status
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : '';
  })()}
</TableCell>

            <TableCell align="right">
              ₹{''}
              {user?.role === 'Employer'
                ? (txn.amount + (txn.platformCharges || 0)).toFixed(2)
                : txn.amount.toFixed(2)}
              {user?.role === 'Employer' && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: 'block', fontSize: '0.75rem' }}
                >
                  GST (18%): ₹{(txn.gstCharges || 0).toFixed(2)}
                </Typography>
              )}
            </TableCell>
            {user?.role === 'Agent' ||
              (user?.role === 'SelfWorker' && (
                <TableCell align="right">₹{txn?.incentiveCharges}</TableCell>
              ))}
          </TableRow>
        ))
      )}
    </TableBody>
  );
}

export default TransactionsTable;

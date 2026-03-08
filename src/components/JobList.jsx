// JobList.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  TablePagination,
} from "@mui/material";

const JobList = ({
  jobs = [],
  userId,
  t = (text) => text, // optional translation function
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  filteredJobs = [],
}) => {
    const [expandedRowId, setExpandedRowId] = useState(null);
    const handleToggleExpand = (jobId) => {
    setExpandedRowId((prev) => (prev === jobId ? null : jobId)); // Toggle row expand/collapse
  };
  
  return (
    <Box sx={{ overflowX: "auto", position: "relative", zIndex: 1 }}>
      <TableContainer component={Paper} sx={{ minWidth: 400 }}>
        <Table size="small" sx={{ minWidth: 400, backgroundColor: "#f0f0f0" }}>
          <TableHead>
            <TableRow>
              {[t("Name"), t("Phone"), t("DOB"), t("Category"), t("Description"), t("Date"), t("Status")].map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job) => {
                const parsedArray =
                      Array.isArray(job.areasOfWork) &&
                      typeof job.areasOfWork[0] === "string"
                        ? JSON.parse(job.areasOfWork[0])
                        : [];
                    const result = parsedArray.join(", ");
                return (
                  <TableRow key={job._id}>
                    <TableCell>{job.name}</TableCell>
                    <TableCell>{job.phone}</TableCell>
                    <TableCell>{new Date(job.dob).toLocaleDateString()}</TableCell>
                       <TableCell>
                                                  {expandedRowId === job._id ? (
                                                    <>
                                                      {result}
                                                      <Typography
                                                        onClick={() => handleToggleExpand(job._id)}
                                                        variant="body2"
                                                        color="primary"
                                                        component="span"
                                                        sx={{
                                                          ml: 1,
                                                          cursor: "pointer",
                                                          textDecoration: "underline",
                                                        }}
                                                      >
                                                        Read Less
                                                      </Typography>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {result.slice(0, 20)}
                                                      {result.length > 20 && (
                                                        <Typography
                                                          onClick={() =>
                                                            handleToggleExpand(job._id)
                                                          }
                                                          variant="body2"
                                                          color="primary"
                                                          component="span"
                                                          sx={{
                                                            ml: 1,
                                                            cursor: "pointer",
                                                            textDecoration: "underline",
                                                          }}
                                                        >
                                                          Read More
                                                        </Typography>
                                                      )}
                                                    </>
                                                  )}
                                                </TableCell>
                      <TableCell>{job?.description}</TableCell>

                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Alert
                        severity={job.status === "Verified" ? "success" : "error"}
                        sx={{ padding: "0px 11px" }}
                      >
                        {job.status}
                      </Alert>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="left" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    {t("No Workers found for this Agent.")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={jobs.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>
    </Box>
  );
};

export default JobList;

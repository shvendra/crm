import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
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
  TextField,
  Pagination,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import config from "../../config";
import { useTranslation } from "react-i18next";

const WorkTable = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [workData, setWorkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  const [page, setPage] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChangePage = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    axios
      .get(`${config.API_BASE_URL}/api/v1/application/getworkhistory`, {
        withCredentials: true,
      })
      .then((response) => {
        setWorkData(response.data.requirements || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching work data:", error);
        setLoading(false);
      });
  }, []);

  const filteredData = (workData || []).filter((item) =>
    item.assignedAgentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box p={2} sx={{mt: "15px" }}>
        <Typography
        variant="h5"
        textAlign="center"
        color="primary"
        sx={{
          fontWeight: 600,
          background: "#f4f5f8",
          marginBottom: "5px",
          marginTop: "-8px",
          padding: "5px",
          fontSize: "1.25rem !important"
        }}
        mb={2}
      >
        {t("workHistory")}
      </Typography>

      <TextField
        label={t("searchByAgentName")}
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {isMobile ? (
        <>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <Card
                key={item._id}
                variant="outlined"
                sx={{ mb: 2, boxShadow: 2 }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    gutterBottom
                    color="primary"
                  >
                    {item.assignedAgentName || t("noAgentAssigned")}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {t("ernNumber")}
                    </Typography>
                    <Typography variant="body2">
                      {item.ERN_NUMBER || "--"}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {t("wage")}
                    </Typography>
                    <Typography variant="body2">
                      ₹{item.finalAgentRequiredWage || "0"}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {t("date")}
                    </Typography>
                    <Typography variant="body2">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "--"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="200px"
              textAlign="center"
              color="text.secondary"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No Data"
                width={80}
                height={80}
                style={{ opacity: 0.6, marginBottom: 16 }}
              />
              <Typography variant="subtitle1" gutterBottom>
                {t("noDataFound")}
              </Typography>
             
            </Box>
          )}
        </>
      ) : (
       <TableContainer component={Paper}>
  <Table>
    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
      <TableRow>
        <TableCell>
          <b>{t("assignedAgent")}</b>
        </TableCell>
        <TableCell>
          <b>{t("ernNumber")}</b>
        </TableCell>
        <TableCell>
          <b>{t("wage")}</b>
        </TableCell>
        <TableCell>
          <b>{t("date")}</b>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {paginatedData.length > 0 ? (
        paginatedData.map((item) => (
          <TableRow key={item._id}>
            <TableCell>{item.assignedAgentName}</TableCell>
            <TableCell>{item.ERN_NUMBER}</TableCell>
            <TableCell>₹{item.finalAgentRequiredWage}</TableCell>
            <TableCell>
              {new Date(item.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="200px"
              textAlign="center"
              color="text.secondary"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No Data"
                width={80}
                height={80}
                style={{ opacity: 0.6, marginBottom: 16 }}
              />
              <Typography variant="subtitle1" gutterBottom>
                {t("noDataFound")}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

      )}

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default WorkTable;

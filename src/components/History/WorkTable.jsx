import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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
  IconButton
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
 <Box
  p={{ xs: 1.5, sm: 2 }}
  sx={{
    mt: "15px",
    borderRadius: "28px",
    border: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
  }}
>
<Box
  sx={{
    mb: 2,
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    background: "#f3f4f6",
    px: 2,
    py: 1.2,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  }}
>
  <IconButton
    onClick={() => window.history.back()} // or navigate(-1)
    sx={{
      width: 34,
      height: 34,
      background: "#fff",
      border: "1px solid #d1d5db",
      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
      "&:hover": {
        background: "#f9fafb",
      },
    }}
  >
    <ArrowBackIosNewIcon sx={{ fontSize: 16, color: "#374151" }} />
  </IconButton>

  <Box sx={{ lineHeight: 1.2 }}>
    <Typography
      sx={{
        fontSize: "15px",
        fontWeight: 700,
        color: "#1f2937",
        mb: 0.2,
      }}
    >
      {t("workHistory")}
    </Typography>

    <Typography
      sx={{
        fontSize: "11px",
        color: "#6b7280",
        fontWeight: 500,
      }}
    >
       {t("workHistory")}
    </Typography>
  </Box>
</Box>

  <TextField
    label={t("searchByAgentName")}
    variant="outlined"
    size="small"
    fullWidth
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{
      mb: 2.2,
      "& .MuiOutlinedInput-root": {
        borderRadius: "14px",
        background: "#fff",
      },
    }}
  />

  {isMobile ? (
    <>
      {paginatedData.length > 0 ? (
        paginatedData.map((item) => (
          <Card
            key={item._id}
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
              background:
                "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 16px 32px rgba(37, 99, 235, 0.12)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={800}
                gutterBottom
                sx={{
                  color: "#1d4ed8",
                  fontSize: "1rem",
                  mb: 1.4,
                }}
              >
                {item.assignedAgentName || t("noAgentAssigned")}
              </Typography>

              <Box
                display="flex"
                justifyContent="space-between"
                mb={1}
                sx={{
                  p: 1,
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {t("ernNumber")}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {item.ERN_NUMBER || "--"}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                mb={1}
                sx={{
                  p: 1,
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {t("wage")}
                </Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color: "#166534" }}>
                  ₹{item.finalAgentRequiredWage || "0"}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                sx={{
                  p: 1,
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {t("date")}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
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
          height="220px"
          textAlign="center"
          color="text.secondary"
          sx={{
            borderRadius: "20px",
            border: "1px dashed #cbd5e1",
            background:
              "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No Data"
            width={80}
            height={80}
            style={{ opacity: 0.6, marginBottom: 16 }}
          />
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>
            {t("noDataFound")}
          </Typography>
        </Box>
      )}
    </>
  ) : (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "20px",
        overflowX: "auto",
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Table sx={{ minWidth: 620 }}>
        <TableHead
          sx={{
            background:
              "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
          }}
        >
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>
              <b>{t("assignedAgent")}</b>
            </TableCell>
            <TableCell sx={{ fontWeight: 800 }}>
              <b>{t("ernNumber")}</b>
            </TableCell>
            <TableCell sx={{ fontWeight: 800 }}>
              <b>{t("wage")}</b>
            </TableCell>
            <TableCell sx={{ fontWeight: 800 }}>
              <b>{t("date")}</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <TableRow
                key={item._id}
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: "#fafcff",
                  },
                  "&:hover": {
                    backgroundColor: "#f8fbff",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>
                  {item.assignedAgentName}
                </TableCell>
                <TableCell>{item.ERN_NUMBER}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#166534" }}>
                  ₹{item.finalAgentRequiredWage}
                </TableCell>
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
                  height="220px"
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
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: 700 }}
                  >
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

  <Box display="flex" justifyContent="center" mt={2.5}>
    <Pagination
      count={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
      page={page}
      onChange={handleChangePage}
      color="primary"
      sx={{
        "& .MuiPaginationItem-root": {
          borderRadius: "10px",
          fontWeight: 600,
        },
      }}
    />
  </Box>
</Box>
  );
};

export default WorkTable;

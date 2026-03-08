import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Box,
  Input,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useState, useContext } from "react";
import axios from "../../utils/axiosConfig";
import { Context } from "../../main";
import AgentDetailDialog from "./AgentDetailDialog";

import config from "../../config";
const PayoutTable = ({
  loading,
  agents,
  editableRows,
  handleInputChange,
  handleApprove,
  handleReject,
  tabValue,
  t,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const openDetail = async (agent) => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/api/v1/user/agent/${agent?.agentId}`,
        { withCredentials: true }
      );
      setSelectedRow(res.data);
      setOpenDetailDialog(true);
    } catch (error) {
      console.error("❌ Failed to fetch agent details:", error);
      toast.error(t("FailedToLoadData"));
    }
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress size={40} color="primary" />
        </Box>
      ) : (
          <Box sx={{ overflowX: "auto" }}>
  <Table sx={{ minWidth: "800px" }}>

          <TableHead sx={{ bgcolor: "#f4f5f8" }}>
            <TableRow>
              <TableCell>{t("SN")}</TableCell>
              <TableCell>
                {tabValue === 3 ? t("EmployerName") : t("AgentName")}
              </TableCell>
              {tabValue === 3 && <TableCell>{t("ERN")}</TableCell>}
              <TableCell>
                {tabValue === 3 ? t("PaymentDate") : t("Amount")}
              </TableCell>
              {tabValue === 3 && <TableCell>{t("AmountReceived")}</TableCell>}
              {tabValue === 3 && <TableCell>{t("PaymentMode")}</TableCell>}
              {tabValue === 3 && <TableCell>{t("TransactionId")}</TableCell>}
              {tabValue === 3 && <TableCell>{t("PlatformCharges")}</TableCell>}
              {tabValue === 3 && <TableCell>{t("GSTAmount")}</TableCell>}
              {tabValue === 3 && <TableCell>{t("GSTNumber")}</TableCell>}
              {tabValue === 3 && (
                <TableCell>{t("NetAmountReceived")}</TableCell>
              )}
              {tabValue === 3 && <TableCell>{t("Remarks")}</TableCell>}

              {tabValue !== 3 && (
                <TableCell>{t("TotalIncentiveWithdrawal")}</TableCell>
              )}
              {tabValue !== 3 && <TableCell>{t("TransactionId")}</TableCell>}
              {tabValue !== 3 && <TableCell>{t("Payout Comments")}</TableCell>}
              <TableCell align="center">{t("Actions")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  {t("Details not available")}
                </TableCell>
              </TableRow>
            ) : (
              agents.map((agent, idx) => (
                <TableRow key={agent._id || idx}>
                  <TableCell>{idx + 1}</TableCell>

                  {/* ✅ Employer or Agent Name */}
                  <TableCell>
                    {tabValue === 3 ? agent.employerName : agent.agentName}
                  </TableCell>

                  {/* ✅ TAB 3 VIEW ONLY (plain text fields) */}
                  {tabValue === 3 ? (
                    <>
                      <TableCell>{agent.ernNumber || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(agent.paymentDateTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>₹{Math.round(agent.amount)}</TableCell>
                      <TableCell>
                        {agent.creditPaymentMethod || "N/A"}
                      </TableCell>
                      <TableCell>
                        {agent.creditTransactionId || "N/A"}
                      </TableCell>
                      <TableCell>₹{agent.platformCharges}</TableCell>
                      <TableCell>₹{agent.gstCharges}</TableCell>
                      <TableCell>{agent?.gstNumber || "N/A"}</TableCell>

                      <TableCell>
                        ₹
                        {(
                          agent.amount -
                          agent.platformCharges -
                          agent.gstCharges
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>{agent.payoutComment || "N/A"}</TableCell>
                    </>
                  ) : (
                    <>
                      {/* ✅ Editable fields for other tabs */}
                      <TableCell>
                        <Input
                          type="number"
                          size="small"
                          value={
                            editableRows[agent._id]?.amount !== undefined
                              ? Math.round(editableRows[agent._id].amount)
                              : agent.amount !== undefined
                              ? Math.round(agent.amount)
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              agent._id,
                              "amount",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          size="small"
                          value={
                            editableRows[agent._id]?.incentiveCharges ??
                            agent.incentiveCharges ??
                            ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              agent._id,
                              "incentiveCharges",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          type="text"
                          size="small"
                          placeholder="Enter Transaction ID"
                          value={
                            editableRows[agent._id]?.creditTransactionId ??
                            agent.creditTransactionId ??
                            ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              agent._id,
                              "creditTransactionId",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          type="text"
                          size="small"
                          value={
                            editableRows[agent._id]?.payoutComment ??
                            agent.payoutComment ??
                            ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              agent._id,
                              "payoutComment",
                              e.target.value
                            )
                          }
                          placeholder="Add comment"
                        />
                      </TableCell>
                    </>
                  )}

                  {/* ✅ Actions always visible */}
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    {tabValue != 0 && (
                      <IconButton
                        color="primary"
                        onClick={() => openDetail(agent)}
                        title={t("ViewDetails")}
                      >
                        <Visibility />
                      </IconButton>
                    )}
                    {tabValue === 0 && (
                      <IconButton
                        color="primary"
                        onClick={() => openDetail(agent)}
                        title={t("ViewDetails")}
                      >
                        <Visibility />
                      </IconButton>
                    )}

                    {tabValue === 0 && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mx: 0.5 }}
                          onClick={() => handleApprove(agent._id)}
                        >
                          {t("Approve")}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleReject(agent._id)}
                        >
                          {t("Reject")}
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </Box>
      )}
      <AgentDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        selectedAgent={selectedRow}
        t={t}
      />
    </>
  );
};

export default PayoutTable;

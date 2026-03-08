import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ReferralAgentsDialog from "../Dialogs/ReferralAgentsDialog"; // ✅ import the dialog
const AgentBenefits = ({ referralCount = 0 }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [agentsWithSameReferral, setAgentsWithSameReferral] = useState([]);

  // ✅ Simulated Data for Agents with Same Referral Number
  // Replace this with API call if you have one
  const allAgents = [
    { name: "Ravi Kumar", phone: "9876543210", city: "Indore", referralCode: "REF123" },
    { name: "Suresh Patel", phone: "8765432109", city: "Bhopal", referralCode: "REF123" },
    { name: "Amit Singh", phone: "7654321098", city: "Gwalior", referralCode: "REF123" },
  ];

  // ✅ Force Desktop viewport for consistent UI
  useEffect(() => {
    const meta = document.querySelector("meta[name=viewport]");
    if (meta) {
      meta.setAttribute("content", "width=device-width, initial-scale=1");
    }
  }, []);

  const handleOpenDialog = () => {
    // Fetch or filter data of agents with same referral number
    setAgentsWithSameReferral(allAgents);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const commissionData = [
    { workers: 10, wage: 500, perDay: 5000, days: 26, monthly: 130000, commission: 5, total: 6500 },
    { workers: 20, wage: 500, perDay: 10000, days: 26, monthly: 260000, commission: 5, total: 13000 },
    { workers: 30, wage: 500, perDay: 15000, days: 26, monthly: 390000, commission: 5, total: 19500 },
    { workers: 50, wage: 500, perDay: 25000, days: 26, monthly: 650000, commission: 5, total: 32500 },
  ];

  const milestoneData = [
    { workers: 10, days: 26, gift: "₹1,000", items: t("tshirtCombo") },
    { workers: 20, days: 26, gift: "₹2,000", items: t("backpackCombo") },
    { workers: 30, days: 26, gift: "₹3,000", items: t("earphoneCombo") },
    { workers: 50, days: 26, gift: "₹5,000", items: t("travelCombo") },
  ];

  const referralData = [
    { type: t("newAgentSignup"), referrer: "₹500", referred: "₹250", note: t("referralNote1") },
    { type: t("milestoneReferral"), referrer: "₹1,000", referred: "₹500", note: t("referralNote2") },
  ];

  const renderTable = (data, headers, keys) => (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#0d47a1" }}>
            {headers.map((header, i) => (
              <TableCell key={i} sx={{ color: "#fff", fontWeight: 600, fontSize: isMobile ? "0.75rem" : "0.9rem" }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i} sx={{ backgroundColor: i % 2 ? "#001e3c" : "#002b5c" }}>
              {keys.map((key, j) => (
                <TableCell key={j} sx={{ color: "#e3f2fd", fontSize: isMobile ? "0.75rem" : "0.9rem" }}>
                  {row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );

  return (
    <Box sx={{ background: "linear-gradient(to bottom, #00172d, #000814)", minHeight: "100vh", p: isMobile ? 2 : 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ color: "#90caf9", mb: 1, fontWeight: "bold" }}
        >
          {t("agentBenefitsTitle")}
        </Typography>

        {/* Referral Count with Clickable Dialog */}
        <Typography
          align="center"
          sx={{
            color: "#fff",
            mb: 2,
            fontSize: isMobile ? "0.85rem" : "1rem",
            cursor: "pointer",
            "&:hover": { color: "#90caf9", textDecoration: "underline" },
          }}
          onClick={handleOpenDialog}
        >
          {t("referralCount")}: <strong>{referralCount}</strong>
        </Typography>

        {/* Commission Table */}
        <Card sx={{ background: "#001e3c", mb: 4, borderRadius: "16px" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#90caf9", mb: 1 }}>
              {t("commissionScheme")}
            </Typography>
            {renderTable(
              commissionData,
              [
                t("workersDay"),
                t("perDayWage"),
                t("totalPerDay"),
                t("daysWorked"),
                t("monthlyWage"),
                t("commissionPercent"),
                t("totalCommission"),
              ],
              ["workers", "wage", "perDay", "days", "monthly", "commission", "total"]
            )}
          </CardContent>
        </Card>

        {/* Milestone Table */}
        <Card sx={{ background: "#001e3c", mb: 4, borderRadius: "16px" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#90caf9", mb: 1 }}>
              {t("milestoneRewards")}
            </Typography>
            {renderTable(
              milestoneData,
              [t("workersDay"), t("daysWorked"), t("giftWorth"), t("giftItems")],
              ["workers", "days", "gift", "items"]
            )}
          </CardContent>
        </Card>

        {/* Referral Table */}
        <Card sx={{ background: "#001e3c", mb: 4, borderRadius: "16px" }}>
          <CardContent sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#90caf9", mb: 1 }}>
              {t("referralBonusPlan")}
            </Typography>
            {renderTable(
              referralData,
              [t("referralType"), t("rewardReferrer"), t("rewardReferred"), t("conditions")],
              ["type", "referrer", "referred", "note"]
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ✅ Dialog for Agents with Same Referral */}
      <ReferralAgentsDialog
        open={openDialog}
        onClose={handleCloseDialog}
        agents={agentsWithSameReferral}
      />
    </Box>
  );
};

export default AgentBenefits;

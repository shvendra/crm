import { useState } from "react";
import RequirementsTable from "./RequirementsTable";
import { useRequirements } from "../../hook/useRequirements";

const RequirementsPage = ({
  unreadCounts,
  toggleChat,
  openChatIds,
  handleAssignOpenModal,
  handleUnreadCountChange,
  t,
}) => {
  /* ------------------ Local States ------------------ */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // ✅ add local activeTab state

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [editData, setEditData] = useState({});

  /* ------------------ Static Config ------------------ */
  const booleanFields = [
    { key: "accommodationAvailable" },
    { key: "foodAvailable" },
    { key: "incentive" },
    { key: "bonus" },
    { key: "transportProvided" },
    { key: "weeklyOff" },
    { key: "overtimeAvailable" },
    { key: "insuranceAvailable" },
    { key: "pfAvailable" },
    { key: "esicAvailable" },
  ];

  /* ------------------ API Hook ------------------ */
const { rows, total, loading, pagination } = useRequirements({
  tab: activeTab,
  page,
  limit: 30,
  search,
});

  /* ------------------ Edit Logic ------------------ */
  const handleOpenEditDialog = (req) => {
    setSelectedReq(req);

    const newEditData = {
      remarks: req?.remarks || "",
      minBudgetPerWorker: req?.minBudgetPerWorker || "",
      maxBudgetPerWorker: req?.maxBudgetPerWorker || "",
      ...booleanFields.reduce((acc, field) => {
        acc[field.key] = req[field.key] ?? false;
        return acc;
      }, {}),
    };

    if (req?.req_type === "Office_Staff") {
      newEditData.status = req?.status || "";
      newEditData.finalAgentRequiredWage = req?.finalAgentRequiredWage || "";
    }

    setEditData(newEditData);
    setEditDialogOpen(true);
  };

  /* ------------------ Tab Change Handler ------------------ */
const handleTabChange = (event, newTab) => {
  console.log("Tab changed to:", newTab); // ✅ debug
  setActiveTab(newTab);
  setPage(1);
};

  /* ------------------ Render ------------------ */
  return (
    <>
      <RequirementsTable
        tab={activeTab}
        onTabChange={handleTabChange} // ✅ pass handler
        rows={rows}
        loading={loading}
        search={search}
        onSearch={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        unreadCounts={unreadCounts}
        toggleChat={toggleChat}
        openChatIds={openChatIds}
           page={pagination.currentPage}       // ✅ use currentPage
  totalPages={pagination.totalPages} // ✅ use totalPages
        onAssign={handleAssignOpenModal}
        onEdit={handleOpenEditDialog}
        onUnreadCountChange={handleUnreadCountChange}
        total={total}
        onPageChange={(_, newPage) => setPage(newPage)}
        t={t}
      />
    </>
  );
};

export default RequirementsPage;

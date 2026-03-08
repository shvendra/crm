import React, { createContext, useState, useContext } from "react";
import ReferralAgentsDialog from "../Dialogs/ReferralAgentsDialog";

const ReferralDialogContext = createContext(null);

export const ReferralDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [referredBy, setReferredBy] = useState("");

  const showReferralDialog = (phone) => {
    setReferredBy(phone);
    setOpen(true);
  };

  const hideReferralDialog = () => setOpen(false);

  return (
    <ReferralDialogContext.Provider value={{ showReferralDialog }}>
      {children}
      <ReferralAgentsDialog
        open={open}
        onClose={hideReferralDialog}
        referredBy={referredBy}
      />
    </ReferralDialogContext.Provider>
  );
};

export const useReferralDialog = () => {
  const context = useContext(ReferralDialogContext);
  if (!context) {
    throw new Error("useReferralDialog must be used within a ReferralDialogProvider");
  }
  return context;
};

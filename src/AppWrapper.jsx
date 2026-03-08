import React, { useState, useMemo } from "react";
import { Context } from "./main.jsx";
import App from "./App.jsx";
import PerformanceMonitor from "./components/PerformanceMonitor.jsx";
import { ReferralDialogProvider } from "./components/Context/ReferralDialogContext.jsx";

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  const contextValue = useMemo(
    () => ({
      isAuthorized,
      setIsAuthorized,
      user,
      setUser,
    }),
    [isAuthorized, user]
  );

  return (
    <Context.Provider value={contextValue}>
      <ReferralDialogProvider>
        <PerformanceMonitor />
        <App />
      </ReferralDialogProvider>
    </Context.Provider>
  );
};

export default AppWrapper;

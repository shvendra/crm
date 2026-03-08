import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import './i18n'; // Initialize i18n
import { registerSW } from './utils/swRegistration';

export const Context = createContext({
  isAuthorized: false,
});

// Import AppWrapper from separate file
import AppWrapper from './AppWrapper.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

// Register service worker for production
registerSW();

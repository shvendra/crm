import React, { useState } from "react";

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [resolve, setResolve] = useState(null);

  const requestConfirm = (message) => {
    setMessage(message); // Set the custom confirmation message
    setIsOpen(true); // Open the confirmation box

    return new Promise((res) => {
      setResolve(() => res); // Store resolve function to return true/false
    });
  };

  const handleDialogConfirm = () => {
    setIsOpen(false); // Close the confirmation box
    if (resolve) resolve(true); // Resolve the promise with true
  };

  const handleDialogCancel = () => {
    setIsOpen(false); // Close the confirmation box
    if (resolve) resolve(false); // Resolve the promise with false
  };

  return { isOpen, message, requestConfirm, handleDialogConfirm, handleDialogCancel };
};

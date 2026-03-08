import axios from "axios";
import toast from 'react-hot-toast';
import config from "../config";

export const insertRequirement = async (formData) => {
  try {
    console.log("reached in insert again");
    const response = await axios.post(
      `${config.API_BASE_URL}/api/v1/application/insert`,
      formData,
      { withCredentials: true }
    );
    console.log(response);

    if (response.data.success) {
      localStorage.removeItem("pendingRequirement");
      toast.success("Requirement posted successfully!");
      return true;
    } else {
      toast.error(response.data?.message || "Failed to post requirement.");
      return false;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong!");
    return false;
  }
};

import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material"; // Importing Material UI components
import { Toaster } from "react-hot-toast";
import axios from "./utils/axiosConfig";
import Navbar from "./components/Layout/Navbar";  // Your existing Navbar component
import Footer from "./components/Layout/Footer";  // Your existing Footer component
import Home from "./components/Home/Home";  // Your existing Home component
import Jobs from "./components/Job/Jobs";  // Your existing Jobs component
import JobDetails from "./components/Job/JobDetails";  // Your existing JobDetails component
import Application from "./components/Application/Application";  // Your existing Application component
import MyApplications from "./components/Application/MyApplications";  // Your existing MyApplications component
import PostJob from "./components/Job/PostJob";  // Your existing PostJob component
import BrowseWorker from "./components/Job/BrowseWorker";  // Your existing PostJob component
import RequestWorkerForm from "./components/Job/RequestWorkers";  // Your existing PostJob component
import MyProfile from "./components/profile/MyProfile";  // Your existing PostJob component
import NotFound from "./components/NotFound/NotFound";  // Your existing NotFound component
import MyJobs from "./components/Job/MyJobs";  // Your existing MyJobs component
import ActiveWorkers from "./components/Job/ActiveWorkers";  // Your existing PostJob component

import Login from "./components/Auth/Login";  // Your existing Login component
import Register from "./components/Auth/Register";  // Your existing Register component
import config from "../src/config"; // Import the config file

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/api/v1/user/getuser`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  // PrivateRoute Component to protect routes that require authorization
  const PrivateRoute = ({ element, ...rest }) => {
    return (
      <Route
        {...rest}
        element={isAuthorized ? element : <Navigate to="/login" />}
      />
    );
  };

  return (
    <>
      <CssBaseline /> {/* Global CSS Reset */}
      <BrowserRouter>
        {/* Material UI AppBar as Navbar */}
        <Navbar />

        {/* Main Content Container */}
        <Container maxWidth="lg" sx={{ marginTop: 4 }}> {/* Wrap content in a Container */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} /> {/* Your existing Login component */}
            <Route path="/register" element={<Register />} /> {/* Your existing Register component */}
            <PrivateRoute path="/job/getall" element={<Jobs />} />
            <PrivateRoute path="/job/findworker" element={<BrowseWorker />} />
            <PrivateRoute path="/job/:id" element={<JobDetails />} />
            <PrivateRoute path="/application/:id" element={<Application />} />
            <PrivateRoute path="/applications/me" element={<MyApplications />} />
            <PrivateRoute path="/job/post" element={<PostJob />} />
            <PrivateRoute path="/job/requestworkers" element={<RequestWorkerForm />} />
            <PrivateRoute path="/job/bookings" element={<ActiveWorkers />} />
            <PrivateRoute path="/job/me" element={<MyJobs />} />

            {/* Protected Routes */}
            <PrivateRoute path="/my/profile" element={<MyProfile />} />
            <PrivateRoute path="/job/me" element={<MyJobs />} />

            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>

        {/* Footer */}
        <Footer />

        {/* Toast notifications */}
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: '',
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [showJobSeekerLogin, setShowJobSeekerLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/users/login', { email, password });
      if (data.success) {
        setUserData(data.user);
        setUserToken(data.token);
        localStorage.setItem('userToken', data.token);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  // Function to fetch jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/jobs");
      if (data.success) {
        setJobs(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/company", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

 // Function to fetch user data
const fetchUserData = async () => {
  try {
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
          headers: { 
              token: userToken 
              // OR if using Bearer token:
              // Authorization: `Bearer ${userToken}`
          }
      });

      if (data.success) {
          setUserData(data.user);
      } else {
          if (data.message.includes('token') || data.message.includes('authorized')) {
              userLogout();
              toast.error('Session expired. Please login again.');
          }
      }
  } catch (error) {
      console.error("Fetch user error:", error);
      if (error.response?.status === 401) {
          userLogout();
          toast.error('Session expired. Please login again.');
      }
  }
};

// Function to fetch user applications
const fetchUserApplications = async () => {
  try {
      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
          headers: { 
              token: userToken 
              // OR if using Bearer token:
              // Authorization: `Bearer ${userToken}`
          }
      });

      if (data.success) {
          setUserApplications(data.applications);
      }
  } catch (error) {
      console.error("Fetch applications error:", error);
      if (error.response?.status === 401) {
          userLogout();
          toast.error('Session expired. Please login again.');
      }
  }
};

  // Logout functions
  const userLogout = () => {
    setUserToken(null);
    setUserData(null);
    localStorage.removeItem('userToken');
  };

  useEffect(() => {
    const storedUserToken = localStorage.getItem('userToken');
    if (storedUserToken) {
      setUserToken(storedUserToken);
    }
  }, []);

  const companyLogout = () => {
    setCompanyToken(null);
    setCompanyData(null);
    localStorage.removeItem('companyToken');
  };

  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }

    const storedUserToken = localStorage.getItem("userToken");
    if (storedUserToken) {
      setUserToken(storedUserToken);
    }
  }, []);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    if (userToken) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [userToken]);

  const value = {
    setSearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    showJobSeekerLogin,
    setShowJobSeekerLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    userToken,
    setUserToken,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
    userLogout,
    loginUser,
    companyLogout,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
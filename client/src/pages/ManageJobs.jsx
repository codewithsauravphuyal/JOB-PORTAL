import React, { useContext, useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const ManageJobs = () => {
  const navigate = useNavigate();
  const { backendUrl, companyToken } = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(); // Reference to detect clicks outside the dropdown

  const fetchCompanyJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { token: companyToken },
      });
      setLoading(false);
      if (data.success) {
        setJobs(data.jobsData.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to load jobs");
    }
  };

  // Function to handle Job Deletion
  const deleteJob = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/company/delete-job/${id}`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        toast.success(data.message);
        // Remove the job from the state to update the UI
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success(data.message);
        // Update the visibility in the local state
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === id ? { ...job, visible: !job.visible } : job
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(null); // Close the dropdown if clicked outside
    }
  };

  const handleEditJob = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  useEffect(() => {
    if (!companyToken) {
      navigate('/login');
    } else {
      fetchCompanyJobs();
    }
  }, [companyToken, navigate]);

  useEffect(() => {
    // Listen for clicks outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return jobs.length === 0 ? (
    <div className='flex items-center justify-center h-[70vh]'>
      <p className='text-xl sm:text-2xl'>No Jobs Available or Posted</p>
    </div>
  ) : (
    <div className='container'>
      <table className='w-full max-w-4xl bg-white border-gray-200 max-sm:text-sm shadow-md'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='py-1 px-3 text-left max-sm:hidden'>#</th>
            <th className='py-1 px-3 text-left'>Job Title</th>
            <th className='py-1 px-3 text-left max-sm:hidden'>Date</th>
            <th className='py-1 px-3 text-left max-sm:hidden'>Location</th>
            <th className='py-1 px-3 text-left'>Applications</th>
            <th className='py-1 px-3 text-left'>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr
              key={index}
              className={`hover:bg-blue-100 transition-all ${job.visible ? 'bg-green-100' : 'bg-red-100'}`}
            >
              <td className='py-1 px-3 text-center max-sm:hidden'>{index + 1}</td>
              <td className='py-1 px-3'>{job.title}</td>
              <td className='py-1 px-3 max-sm:hidden'>{moment(job.date).format('ll')}</td>
              <td className='py-1 px-3 max-sm:hidden'>{job.location}</td>
              <td className='py-1 px-3'>{job.applicants}</td>
              <td className='py-4 px-6 relative'>
                <div className='relative inline-block text-left'>
                  <button
                    className='text-gray-500 action-button'
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === index ? null : index);
                    }}
                  >
                    ...
                  </button>
                  {dropdownOpen === index && (
                    <div
                      ref={dropdownRef}
                      className='z-10 absolute right-0 mt-2 w-25 bg-white border border-gray-200 shadow rounded-md'
                    >
                      <button
                        onClick={() => changeJobVisibility(job._id)}
                        className='block w-full text-lef1 px-3 py-2 hover:bg-gray-200 text-blue-500'
                      >
                        {job.visible ? 'Hide' : 'Show'}
                      </button>
                      {/* <button
                        onClick={() => navigate(`/dashboard/edit-job/${job._id}`)}
                        className="block w-full text-lef1 px-3 py-2 hover:bg-gray-200 text-green-500"
                      >
                        Edit
                      </button> */}

                      <button
                        onClick={() => deleteJob(job._id)}
                        className='block w-full text-lef1 px-3 py-2 hover:bg-gray-200 text-red-500'
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageJobs;

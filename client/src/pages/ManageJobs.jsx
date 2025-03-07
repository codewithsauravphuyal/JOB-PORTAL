import React, { useContext, useEffect, useState } from 'react';
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

  // Function to fetch company job application data
  const fetchCompanyJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + '/api/company/list-jobs', {
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
      toast.error(error.message);
    }
  };

  // Function to change Job Visibility
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/change-visibility',
        { id },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Use effect to fetch data when the component is mounted
  useEffect(() => {
    if (!companyToken) {
      navigate('/login');
    } else {
      fetchCompanyJobs();
    }
  }, [companyToken, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    jobs.length === 0 ? (
      <div className='flex items-center justify-center h-[70vh]'>
        <p className='text-xl sm:text-2xl'>No Jobs Available or posted</p>
      </div>
    ) : (
      <div className="container mx-auto p-4">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold max-sm:hidden">#</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold">Job Title</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold max-sm:hidden">Date</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold">Applications</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold">Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index} className="even:bg-gray-50 hover:bg-red-100 transition-all">
                <td className="py-2 px-4 text-center max-sm:hidden">{index + 1}</td>
                <td className="py-2 px-4">{job.title}</td>
                <td className="py-2 px-4 max-sm:hidden">{moment(job.date).format('ll')}</td>
                <td className="py-2 px-4 max-sm:hidden">{job.location}</td>
                <td className="py-2 px-4">{job.applicants}</td>
                <td className="py-2 px-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onClick={() => changeJobVisibility(job._id)}
                      type="checkbox"
                      className="sr-only peer"
                      checked={job.visible}
                    />
                    <div className="w-11 h-6 bg-red-500 rounded-full peer-checked:bg-green-500 peer transition-colors duration-300"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <button onClick={() => navigate('/dashboard/add-job')} className="w-28 py-4 bg-red-600 text-white rounded">
            Add new job
          </button>
        </div>
      </div>
    )
  );
};

export default ManageJobs;

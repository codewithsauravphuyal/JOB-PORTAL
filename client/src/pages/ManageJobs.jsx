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
      <div className="container p-4 max-w-5xl">
        <table className="w-full max-w-4xl bg-white border-gray-200 max-sm:text-sm shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-center text-gray-700 font-semibold max-sm:hidden">#</th>
              <th className="py-2 px-4 text-center text-gray-700 font-semibold">Job Title</th>
              <th className="py-2 px-4 text-center text-gray-700 font-semibold max-sm:hidden">Date</th>
              <th className="py-2 px-4 text-center text-gray-700 font-semibold max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-center text-gray-700 font-semibold">Applications</th>
              <th className="py-2 px-4 text-center text-gray-700 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr 
                key={index} 
                className={`transition-all ${job.visible ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'}`}
              >
                <td className="py-2 px-4 text-center max-sm:hidden">{index + 1}</td>
                <td className="py-2 px-4">{job.title}</td>
                <td className="py-2 px-4 text-center max-sm:hidden">{moment(job.date).format('ll')}</td>
                <td className="py-2 px-4 text-center max-sm:hidden">{job.location}</td>
                <td className="py-2 px-4 text-center">{job.applicants}</td>
                <td className="py-4 px-6 relative">
                  <div className="relative inline-block text-left group">
                    <button className="text-gray-500 action-button">...</button>
                    <div className="z-10 hidden absolute left-full top-0 mt-2 w-25 bg-white border border-gray-200 shadow group-hover:block">
                      {/* Action to show/hide */}
                      <button
                        onClick={() => changeJobVisibility(job._id)}
                        className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-red-200">
                        {job.visible ? 'Hide' : 'Show'}
                      </button>

                      {/* Edit Action */}
                      <button
                        onClick={() => editJob(job._id)}
                        className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-red-200">
                        Edit
                      </button>

                      {/* Delete Action */}
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-red-200">
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};

export default ManageJobs;

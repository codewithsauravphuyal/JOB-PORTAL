import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken }
      });
      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        fetchCompanyJobApplications();
        setOpenDropdown(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCompanyJobApplications();
  }, [companyToken]);

  if (loading) {
    return <Loading />;
  }

  return (
    applicants.length === 0 ? (
      <div className='flex items-center justify-center h-[70vh]'>
        <p className='text-xl sm:text-1xl'>No Applications Available</p>
      </div>
    ) : (
      <div className="container">
          <table className="w-full max-w-4xl bg-white border-gray-100 max-sm:text-sm shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-1 px-3 text-left max-sm:hidden">#</th>
                <th className="py-1 px-3 text-left">Username</th>
                <th className="py-1 px-3 text-left max-sm:hidden">Job Title</th>
                <th className="py-1 px-3 text-left max-sm:hidden">Location</th>
                <th className="py-1 px-3 text-left">Resume</th>
                <th className="py-1 px-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.length > 0 ? (
                applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
                  <tr key={index} className="even:bg-gray-50 hover:bg-red-100 transition-all">
                    <td className="py-1 px-3 text-center max-sm:hidden">{index + 1}</td>
                    <td className="py-1 px-3 flex items-center gap-3">
                      <img className="w-8 h-8 rounded-full" src={applicant.userId.image} alt={applicant.userId.name} />
                      <span>{applicant.userId.name}</span>
                    </td>
                    <td className="py-1 px-3 max-sm:hidden">{applicant.jobId.title}</td>
                    <td className="py-1 px-3 max-sm:hidden">{applicant.jobId.location}</td>
                    <td className="py-1 px-3">
                      <a
                        href={applicant.userId.resume}
                        target='_blank'
                        className="bg-blue-100 text-blue-500 px-5 py-1 rounded inline-flex gap-1 items-center hover:bg-blue-100"
                      >
                        <img src={assets.resume_download_icon} alt="Resume Icon" className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-4 px-6 relative">
                      {applicant.status === "Pending" ? (
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                            className="text-gray-500 action-button"
                          >
                            ...
                          </button>
                          {openDropdown === index && (
                            <div className=" absolute right-0 w-20 bg-white border border-gray-100 shadow rounded-md sm:right-full">
                              <button onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')} className="block w-full text-left px-3 py-1 text-blue-500 hover:bg-blue-100">Accept</button>
                              <button onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')} className="block w-full text-left px-3 py-1 text-red-500 hover:bg-red-100">Reject</button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>{applicant.status}</div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No applications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    )
  );
};

export default ViewApplications;

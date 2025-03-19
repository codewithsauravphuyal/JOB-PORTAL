import React, { useContext, useEffect, useState } from 'react'; // Added useState import
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify'; // Added toast import for error notifications
import Loading from '../components/Loading';

const ViewApplications = () => {

  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState([]); // Fixed typo from usestate to useState and initialized with an empty array
  const [loading, setLoading] = useState(true); // Loading state to track fetching

  // Function to fetch company job applications data
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken }
      });
      if (data.success) {
        setApplicants(data.applications.reverse()); // Setting the applicants data
      } else {
        toast.error(data.message); // Show error toast if there is an issue
      }
    } catch (error) {
      toast.error(error.message); // Show error toast if an error occurs
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  //Function to Update job Applications Status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/company/change-status',
        { id, status },
        { headers: { token: companyToken } }
      )
      if (data.success) {
        fetchCompanyJobApplications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCompanyJobApplications();
  }, [companyToken]); // Re-run this effect whenever the companyToken changes

  if (loading) {
    return <Loading />;
  }

  return (
    applicants.length === 0 ? (
      <div className='flex items-center justify-center h-[70vh]'>
        <p className='text-xl sm:text-2xl'>No Applications Available</p>
      </div>
    ) : (
      <div className="container mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl bg-white border-gray-200 max-sm:text-sm shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">User Name</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                <th className="py-2 px-4 text-left">Resume</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.length > 0 ? (
                applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
                  <tr key={index} className="even:bg-gray-50 hover:bg-red-100 transition-all">
                    <td className="py-2 px-4 text-center">{index + 1}</td>
                    <td className="py-2 px-4 flex items-center gap-3">
                      <img className="w-8 h-8 rounded-full" src={applicant.userId.image} alt={applicant.userId.name} />
                      <span>{applicant.userId.name}</span>
                    </td>
                    <td className="py-2 px-4 max-sm:hidden">{applicant.jobId.title}</td>
                    <td className="py-2 px-4 max-sm:hidden">{applicant.jobId.location}</td>
                    <td className="py-2 px-4">
                      <a
                        href={applicant.userId.resume}
                        target='_blank'
                        className="bg-blue-100 text-blue-500 px-5 py-2 rounded inline-flex gap-2 items-center hover:bg-blue-200"
                      >
                        <img src={assets.resume_download_icon} alt="Resume Icon" className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-4 px-6 relative">
                      {applicant.status === "Pending"
                        ?
                        <div className="relative inline-block text-left group">
                          <button className="text-gray-500 action-button">...</button>
                          <div className="z-10 hidden absolute left-full top-0 mt-2 w-32 bg-white border border-gray-200 shadow group-hover:block">
                            <button onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')} className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-blue-100">Accept</button>
                            <button onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100">Reject</button>
                          </div>
                        </div>
                        : <div>{applicant.status}</div>
                      }
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
      </div>
    )
  );
};

export default ViewApplications;

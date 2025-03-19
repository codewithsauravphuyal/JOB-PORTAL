import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assets } from '../assets/assets';
import moment from 'moment';
import { AppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Applications() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');  // To store validation error message

  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext);

  const updateResume = async () => {
    // Validate if a resume is selected
    if (!resume) {
      setResumeError('Please upload a resume before saving.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume', resume);

      const token = await getToken();

      const { data } = await axios.post(backendUrl + '/api/users/update-resume',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setIsEdit(false);
    setResume(null);
    setResumeError('');  // Reset error message
  };

  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {
            isEdit || (userData?.resume === "")
              ? <>
                  <label className='flex items-center' htmlFor="resumeUpload">
                    <p className='bg-red-100 text-red-600 px-4 py-2 rounded-lg mr-2 cursor-pointer'>
                      {resume ? resume.name : "Select Resume"}
                    </p>
                    <input
                      id='resumeUpload'
                      type='file'
                      accept="application/pdf"
                      hidden
                      onChange={(e) => setResume(e.target.files[0])}
                    />
                    <img src={assets.profile_upload_icon} className='cursor-pointer' alt="" />
                  </label>
                  <button onClick={updateResume} className='bg-green-100 text-green-400 rounded-lg px-4 py-2 cursor-pointer'>Save</button>
                  {resumeError && <p className="text-red-600 text-sm mt-2">{resumeError}</p>} {/* Error message display */}
                </>
              : userData?.resume ? (
                  <div className='flex gap-2'>
                    <a target='_blank' href={userData.resume} className='bg-red-100 text-red-600 px-4 py-2 rounded-lg' >Resume</a>
                    <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2' >Edit</button>
                  </div>
                ) : (
                  <p className='text-red-600 text-sm'>No resume uploaded</p> // Display a message if the resume is missing
                )
          }
        </div>
        <div className="container mx-auto overflow-x-auto">  {/* Wrapper for horizontal scrolling */}
          <table className="min-w-full bg-white rounded-lg shadow-md border-collapse">
            <thead className="bg-gray-100 rounded-t-lg">
              <tr>
                <th className="py-3 px-6 text-left text-gray-700 font-semibold">Company</th>
                <th className="py-3 px-6 text-left text-gray-700 font-semibold">Job Title</th>
                <th className="py-3 px-6 text-left text-gray-700 font-semibold  max-sm:hidden">Location</th>
                <th className="py-3 px-6 text-left text-gray-700 font-semibold  max-sm:hidden">Date</th>
                <th className="py-3 px-6 text-left text-gray-700 font-semibold ">Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.map((job, index) => (
                <tr key={index} className="even:bg-gray-50 hover:bg-gray-100 transition-all">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img className="w-8 h-8 rounded-full max-sm:hidden" src={job.companyId.image} alt="" />
                    {job.companyId.name}
                  </td>
                  <td className="py-4 px-6">{job.jobId.title}</td>
                  <td className="py-4 px-6 max-sm:hidden">{job.jobId.location}</td>
                  <td className="py-4 px-6 max-sm:hidden">{moment(job.date).format('ll')}</td>
                  <td className="py-4 px-6">
                    <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Applications;

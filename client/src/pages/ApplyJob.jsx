import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import Footer from '../components/Footer';
import JobCard from './JobCard';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const { 
    jobs, 
    backendUrl, 
    userData, 
    userToken,
    userApplications, 
    fetchUserApplications,
    setShowJobSeekerLogin
  } = useContext(AppContext);

  // Fetch job details
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message || 'Failed to fetch job data');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load job details');
    }
  };

  // Check if user has already applied to this job
  const checkAlreadyApplied = () => {
    if (!userApplications || !jobData) return false;
    
    return userApplications.some(application => {
      // Handle both cases where jobId might be a string or populated object
      const appliedJobId = typeof application.jobId === 'object' 
        ? application.jobId._id 
        : application.jobId;
      return appliedJobId === jobData._id;
    });
  };

  // Handle job application
  const applyHandler = async () => {
    if (isApplying || isAlreadyApplied) return;

    try {
      setIsApplying(true);

      // Check if user is logged in
      if (!userToken) {
        setShowJobSeekerLogin(true);
        toast.error('Please login to apply for this job');
        return;
      }

      // Check if user has a resume
      if (!userData?.resume) {
        navigate('/applications');
        toast.error('Please upload your resume before applying');
        return;
      }

      // Final check for existing application (in case state wasn't updated)
      if (checkAlreadyApplied()) {
        setIsAlreadyApplied(true);
        toast.error('You have already applied to this job');
        return;
      }

      // Submit application
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobData._id },
        { headers: { token: userToken } }
      );

      if (data.success) {
        toast.success('Application submitted successfully!');
        setIsAlreadyApplied(true);
        await fetchUserApplications(); // Refresh applications list
      } else {
        toast.error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application error:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for job');
    } finally {
      setIsApplying(false);
    }
  };

  // Fetch job data on component mount
  useEffect(() => {
    fetchJob();
  }, [id]);

  // Check application status when job data or applications change
  useEffect(() => {
    if (jobData && userApplications) {
      setIsAlreadyApplied(checkAlreadyApplied());
    }
  }, [jobData, userApplications]);

  // Render the apply button with appropriate state
  const renderApplyButton = () => {
    if (isAlreadyApplied) {
      return (
        <button 
          className="bg-red-500 text-white px-6 py-2 rounded-lg cursor-not-allowed"
          disabled
        >
          Already Applied
        </button>
      );
    }

    return (
      <button
        onClick={applyHandler}
        disabled={isApplying}
        className={`bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition ${
          isApplying ? 'opacity-75 cursor-wait' : 'cursor-pointer'
        }`}
      >
        {isApplying ? 'Applying...' : 'Apply Now'}
      </button>
    );
  };

  if (!jobData) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Job Header */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start gap-4">
                <img
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-white rounded-lg p-2 "
                  src={jobData.companyId?.image || assets.default_image}
                  alt={jobData.companyId?.name}
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {jobData.title}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-gray-600">
                    <span className="flex items-center gap-1">
                      <img src={assets.suitcase_icon} alt="Company" className="w-4 h-4" />
                      {jobData.companyId?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <img src={assets.location_icon} alt="Location" className="w-4 h-4" />
                      {jobData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <img src={assets.person_icon} alt="Level" className="w-4 h-4" />
                      {jobData.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <img src={assets.money_icon} alt="Salary" className="w-4 h-4" />
                      {kconvert.convertTo(jobData.salary)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {renderApplyButton()}
                <p className="text-sm text-gray-500">
                  Posted {moment(jobData.date).fromNow()}
                </p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Job Content */}
            <div className="lg:w-2/3">
              <div className="bg-white shadow rounded-lg overflow-hidden p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Job Description</h2>
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: jobData.description || 'No description provided' }} 
                />
              </div>
              
              <div className="text-center lg:text-left">
                {renderApplyButton()}
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="lg:w-1/3">
              <div className="bg-white shadow rounded-lg overflow-hidden p-6">
                <h2 className="text-xl font-bold mb-4">
                  More Jobs at {jobData.companyId?.name}
                </h2>
                <div className="space-y-4">
                  {jobs
                    .filter(job => 
                      job._id !== jobData._id && 
                      job.companyId._id === jobData.companyId._id
                    )
                    .filter(job => {
                      // Check if user hasn't applied to this job
                      return !userApplications?.some(app => 
                        app.jobId === job._id || 
                        (app.jobId?._id === job._id)
                      );
                    })
                    .slice(0, 3)
                    .map(job => (
                      <JobCard key={job._id} job={job} compact />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ApplyJob;
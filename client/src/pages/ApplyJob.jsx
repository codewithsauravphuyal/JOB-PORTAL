import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import Footer from '../components/Footer'
import JobCard from '../pages/JobCard'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import kconvert from 'k-convert'
import moment from 'moment'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/clerk-react'

const ApplyJob = () => {
  const { id } = useParams()

  const { getToken } = useAuth()

  const navigate = useNavigate()

  const [JobData, setJobData] = useState(null)

  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)

  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } = useContext(AppContext)

  // Function to fetch the job data by ID
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`)
      if (data.success) {
        setJobData(data.job)
      } else {
        toast.error(data.message || 'Failed to fetch job data')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'An error occurred while fetching job data')
    }
  }

  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error('Login to apply for jobs');
      }
      if (!userData.resume) {
        navigate('/applications');
        return toast.error('Upload Resume to apply');
      }

      const token = await getToken();

      // Add userId to the request payload
      const { data } = await axios.post(
        backendUrl + '/api/users/apply',
        { jobId: JobData._id},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message);
        fetchUserApplications()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(item => item.jobId === JobData._id )
    setIsAlreadyApplied(hasApplied)
  }
  useEffect(() => {
    fetchJob()
  }, [id])

  useEffect(()=>{
if (userApplications.length> 0 && JobData) {
  checkAlreadyApplied()
}
  },[JobData, userApplications, id])

  return JobData ? (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex flex-col md:flex-row justify-between items-center bg-red-50 border border-red-400 rounded-xl p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img
                className="h-24 w-24 bg-white rounded-lg p-4"
                src={JobData?.companyId?.image || assets.default_image}
                alt={JobData?.companyId?.name || 'Company'}
              />
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800">
                  {JobData?.title || 'Job Title'}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="Company Icon" />
                    {JobData?.companyId?.name || 'Company Name'}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="Location Icon" />
                    {JobData?.location || 'Location'}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="Level Icon" />
                    {JobData?.level || 'Level'}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="Salary Icon" />
                    Salary: {kconvert.convertTo(JobData?.salary || 0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <button onClick={applyHandler} className="bg-red-600 p-2.5 px-10 text-white rounded cursor-pointer">{isAlreadyApplied? 'Already Applied': 'Apply Now' }</button>
              <p className="mt-1 text-gray-500 text-sm">
                Posted {moment(JobData?.date).fromNow() || 'just now'}
              </p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: JobData?.description || 'No description available' }} />
              <button onClick={applyHandler} className="bg-red-600 p-2.5 px-10 text-white rounded mt-10 cursor-pointer">{isAlreadyApplied? 'Already Applied': 'Apply Now' }</button>
            </div>
            {/* Right Section More Jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More Jobs From {JobData?.companyId?.name || 'Company'}</h2>
              {jobs
                .filter((job) => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                .filter(job =>{
                  //set of applied jobIds
                  const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))
                  //return true if the user  has not applied for this job
                  return !appliedJobsIds.has(job._id)
                })
                .slice(0, 4)
                .map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  )
}

export default ApplyJob

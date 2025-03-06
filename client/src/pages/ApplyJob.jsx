import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import Footer from '../components/Footer'
import JobCard from '../pages/JobCard'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import kconvert from 'k-convert'
import moment from 'moment'

const ApplyJob = () => {

  const { id } = useParams()

  const [JobData, setJobData] = useState(null)

  const { jobs } = useContext(AppContext)

  const fetchJob = async () => {
    const data = jobs.filter(job => job._id === id)
    if (data.length !== 0) {
      setJobData(data[0])
      console.log(data[0])
    }
  }

  useEffect(() => {
    if (jobs.length > 0) {
      fetchJob()
    }
  }, [id, jobs])


  return JobData ? (
    <>
      <Navbar />

      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          <div className="flex flex-col md:flex-row justify-between items-center bg-red-50 border border-red-400 rounded-xl p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img
                className="h-24 w-24 bg-white rounded-lg p-4"
                src={JobData.companyId.image}
                alt={JobData.companyId.name}
              />
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800">
                  {JobData.title}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="Company Icon" />
                    {JobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="Location Icon" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="Level Icon" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="Salary Icon" />
                    Salary: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
            <button className='bg-red-600 p-2.5 px-10 text-white rounded'>Apply Now</button>
              <p className="mt-1 text-gray-500 text-sm">
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>
          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div className='rich-text' dangerouslySetInnerHTML={{ __html: JobData.description }} />
              <button className='bg-red-600 p-2.5 px-10 text-white rounded mt-10'>Apply Now</button>
            </div>
            {/* Right Section More Jobs */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <h2>More Jobs From {JobData.companyId.name}</h2>
              {jobs
                .filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                .slice(0, 4)
                .map(job => <JobCard key={job._id} job={job} />)}
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

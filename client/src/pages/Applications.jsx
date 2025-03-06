import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';

function Applications() {

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null)

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {
            isEdit
              ? <>
                <label className='flex items-center' htmlFor="resumeUpload">
                  <p className='bg-red-100 text-red-600 px-4 py-2 rounded-lg mr-2'>
                    Select Resume
                  </p>
                  <input id='resumeUpload' onClick={e => setResume(e.target.files[0])} accept="application/pdf" type='file' hidden />
                  <img src={assets.profile_upload_icon} alt="" />
                </label>
                <button onClick={e => setIsEdit(false)} className='bg-green-100 text-green-400 rounded-lg px-4 py-2'>Save</button>
              </>
              : <div className='flex gap-2'>
                <a className='bg-red-100 text-red-600 px-4 py-2 rounded-lg' href="">Resume</a>
                <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2' >Edit</button>
              </div>
          }
        </div>
        <div className="overflow-x-auto">
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
              {jobsApplied.map((job, index) => (
                <tr key={index} className="even:bg-gray-50 hover:bg-gray-100 transition-all">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img className="w-8 h-8 rounded-full" src={job.logo} alt="" />
                    {job.company}
                  </td>
                  <td className="py-4 px-6">{job.title}</td>
                  <td className="py-4 px-6 max-sm:hidden">{job.location}</td>
                  <td className="py-4 px-6 max-sm:hidden">{moment(job.date).format('ll')}</td>
                  <td className="py-4 px-6">
                    <span className= {`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>
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

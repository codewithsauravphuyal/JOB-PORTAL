import React from 'react';
import { manageJobsData } from '../assets/assets';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ManageJobs = () => {
  const navigate = useNavigate()
  return (
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
          {manageJobsData.map((job, index) => (
            <tr key={index} className="even:bg-gray-50 hover:bg-red-100 transition-all">
              <td className="py-2 px-4 text-center max-sm:hidden">{index + 1}</td>
              <td className="py-2 px-4">{job.title}</td>
              <td className="py-2 px-4 max-sm:hidden">{moment(job.date).format('ll')}</td>
              <td className="py-2 px-4 max-sm:hidden">{job.location}</td>
              <td className="py-2 px-4">{job.applicants}</td>
              <td className="py-2 px-4 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-red-500 rounded-full peer-checked:bg-green-500 peer transition-colors duration-300"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                </label>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      <div className='mt-4 flex justify-end'>
        <button onClick={() => navigate('/dashboard/add-job')} className='w-28 py-4 bg-red-600 text-white rounded'>Add new job</button>
      </div>
    </div>
  );
};

export default ManageJobs;

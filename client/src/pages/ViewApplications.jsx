import React from 'react';
import { assets, viewApplicationsPageData } from '../assets/assets';

const ViewApplications = () => {
  return (
    
      <div className="container mx-auto p-4">
        <table className="w-full max-w-4xl bg-white border-gray-200 max-sm:text-sm shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">User Name</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
              <th className="py-2 px-4 text-left  max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left ">Resume</th>
              <th className="py-2 px-4 text-left ">Action</th>
            </tr>
          </thead>
          <tbody>
            {viewApplicationsPageData.map((applicant, index) => (
              
              <tr key={index} className="even:bg-gray-50 hover:bg-red-100 transition-all">
                <td className="py-2 px-4 text-center">{index + 1}</td>
                <td className="py-2 px-4 flex items-center gap-3">
                  <img className="w-8 h-8 rounded-full" src={applicant.imgSrc} alt={applicant.name} />
                  <span>{applicant.name}</span>
                </td>
                <td className="py-2 px-4 max-sm:hidden">{applicant.jobTitle}</td>
                <td className="py-2 px-4 max-sm:hidden">{applicant.location}</td>
                <td className="py-2 px-4">
                  <a
                    href="#"
                    target='_blank'
                    className="bg-blue-100 text-blue-500 px-5 py-2 rounded inline-flex gap-2 items-center hover:bg-blue-200"
                  >
                    Resume <img src={assets.resume_download_icon} alt="Resume Icon" className="w-3 h-3" />
                  </a>
                </td>
                <td className="py-4 px-6 relative">
                  <div className="relative inline-block text-left group">
                    <button className="text-gray-500 action-button">...</button>
                    <div className="z-10 hidden absolute left-full top-0 mt-2 w-32 bg-white border border-gray-200 shadow group-hover:block">
                      <button className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-blue-100">Accept</button>
                      <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100">Reject</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default ViewApplications;

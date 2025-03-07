import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    return (
        <div className="border border-gray-200 p-6 shadow-lg rounded-lg bg-white hover:shadow-xl transition">
            {/* Company Info */}
            <div className="flex items-center gap-3">
                <img className="h-10 w-10 object-contain" src={job.companyId.image} alt="Company Logo" />
            </div>

            {/* Job Title */}
            <h4 className="font-semibold text-xl text-gray-900 mt-3">{job.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{job.companyId.name}</p>

            {/* Job Details */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full">
                    📍 {job.location}
                </span>
                <span className="bg-red-100 text-red-700 font-medium px-3 py-1 rounded-full">
                    🔥 {job.level}
                </span>
            </div>

            {/* Job Description */}
            <p
                className="text-gray-600 text-sm mt-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description.length > 150 ? job.description.slice(0, 150) + "..." : job.description }}
            ></p>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4 text-sm">
                <button
                    onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0); }}
                    className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer">
                    Apply Now
                </button>
                <button
                    onClick={() => { navigate(`/job-details/${job._id}`); scrollTo(0, 0); }}
                    className="text-gray-500 border border-gray-500 rounded px-4 py-2 cursor-pointer">
                    Learn More
                </button>
            </div>
        </div>
    );
}

export default JobCard;

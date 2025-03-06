import React from 'react';
import { assets } from '../assets/assets';

function ResumeAi() {
    return (
        <div className="container px-4 2xl:px-20 mx-auto my-20">
            <div className="relative bg-gradient-to-r from-red-50 to-purple-50 p-12 sm:p-24 lg:p-32 rounded-l">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-bold mb-6 max-w-lg leading-tight">
                        Build Your Professional Resume with AI in Just 5 Minutes!
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base max-w-md mb-6">
                        Our AI-powered resume builder helps you craft a job-winning resume effortlessly. Get personalized suggestions, industry-approved templates, and export in multiple formats.
                    </p>

                    {/* Resume Creation Button */}
                    <a href="/create-resume" className="bg-gradient-to-r from-red-800 to-red-950 text-white px-6 py-3 rounded-lg text-lg font-medium shadow hover:bg-red-700 transition">
                        Create Your Resume Now
                    </a>
                </div>

                {/* AI Illustration */}
                <img
                    className="absolute max-w-lg w-80 right-0 bottom-0 mr-32 max-lg:hidden"
                    src={assets.app_main_img}
                    alt="AI Resume Builder"
                />


            </div>
        </div>
    );
}

export default ResumeAi;

import React from 'react';
import { assets } from '../assets/assets';

function Footer() {
    return (
        <div className="bg-gray-50 border-t border-gray-300 py-10">
            <div className="container px-4 2xl:px-20 mx-auto flex flex-wrap justify-between gap-8">

                {/* About Hired Nepal */}
                <div className="max-w-sm">
                    <img width={180} src={assets.logo} alt="Hired Nepal Logo" />
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                        Hired Nepal is a premier job portal dedicated to bridging the gap between employers and job seekers. With a focus on transparency and efficiency, we make job searching and hiring seamless across Nepal.
                    </p>
                </div>

                {/* For Employers */}
                <div>
                    <h4 className="font-semibold text-lg text-gray-700">For Employers</h4>
                    <ul className="text-sm text-gray-600 mt-3 space-y-2">
                        <li><a href="#">Vacancy Announcements</a></li>
                        <li><a href="#">Outsourcing Services</a></li>
                        <li><a href="#">Recruitment Services</a></li>
                        <li><a href="#">HR Consulting</a></li>
                    </ul>
                </div>

                {/* For Job Seekers */}
                <div>
                    <h4 className="font-semibold text-lg text-gray-700">For Job Seekers</h4>
                    <ul className="text-sm text-gray-600 mt-3 space-y-2">
                        <li><a href="#">Search Jobs</a></li>
                        <li><a href="#">Browse by Categories</a></li>
                        <li><a href="#">Career Tips</a></li>
                        <li><a href="#">Jobseeker Account</a></li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-semibold text-lg text-gray-700">Quick Links</h4>
                    <ul className="text-sm text-gray-600 mt-3 space-y-2">
                        <li><a href="#">Trainings</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Report a Problem</a></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h4 className="font-semibold text-lg text-gray-700">Resources</h4>
                    <ul className="text-sm text-gray-600 mt-3 space-y-2">
                        <li><a href="#">Blogs</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Sitemap</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="container px-4 2xl:px-20 mx-auto mt-10 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 border-t border-gray-300 pt-6">

                {/* Copyright */}
                <p className="text-center sm:text-left">
                    &copy; {new Date().getFullYear()} Hired Nepal Pvt. Ltd. | All Rights Reserved
                </p>

                {/* Social Icons */}
                <div className="flex gap-3">
                    <a href="#"><img width={32} src={assets.facebook_icon} alt="Facebook" /></a>
                    <a href="#"><img width={32} src={assets.twitter_icon} alt="Twitter" /></a>
                    <a href="#"><img width={32} src={assets.instagram_icon} alt="Instagram" /></a>
                </div>
            </div>
        </div>
    );
}

export default Footer;

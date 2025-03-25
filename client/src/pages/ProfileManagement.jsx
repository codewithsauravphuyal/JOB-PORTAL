import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProfileManagement = () => {
    const { userData, userToken, backendUrl, fetchUserData, userLogout } = useContext(AppContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        phone: userData?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await userLogout();
            navigate('/');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            if (formData.name !== userData.name) {
                formDataToSend.append('name', formData.name);
            }

            if (formData.phone !== userData.phone) {
                formDataToSend.append('phone', formData.phone);
            }

            if (image) {
                formDataToSend.append('image', image);
            }

            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error("Passwords don't match");
                }
                formDataToSend.append('currentPassword', formData.currentPassword);
                formDataToSend.append('newPassword', formData.newPassword);
            }

            const { data } = await axios.put(
                `${backendUrl}/api/users/profile`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        token: userToken
                    }
                }
            );

            if (data.success) {
                toast.success('Profile updated successfully');
                fetchUserData();
                setEditMode(false);
                setFormData({
                    ...formData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderProfileTab = () => (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0 sm:space-x-8">
                <div className="relative">
                    <img
                        className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-red-300 shadow-md"
                        src={
                            image
                                ? URL.createObjectURL(image)
                                : userData?.image || assets.default_profile
                        }
                        alt="Profile"
                    />
                    {editMode && (
                        <label className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 shadow-lg">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </label>
                    )}
                </div>

                {editMode && (
                    <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="px-4 py-2 text-red-600 bg-white rounded-lg border border-red-200 hover:bg-red-50 font-medium"
                    >
                        Remove Picture
                    </button>
                )}
            </div>

            {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={userData?.email || ''}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                            disabled
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium disabled:opacity-75"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                            <p className="text-base font-medium">{userData?.name || 'Not provided'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                            <p className="text-base font-medium">{userData?.phone || 'Not provided'}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <p className="text-base font-medium">{userData?.email || 'Not provided'}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Security</h3>
                        <p className="text-sm text-gray-500">Last updated: {new Date(userData?.date).toLocaleDateString()}</p>
                    </div>
                </div>
            )}
        </div>
    );

    const renderResumeTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Your Resume</h3>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                {userData?.resume ? (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                                <h4 className="text-lg font-medium">Current Resume</h4>
                                <p className="text-sm text-gray-500">Uploaded on {new Date(userData.resumeUpdatedAt || userData.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <a
                                href={userData.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                            >
                                View Resume
                            </a>
                            <button
                                onClick={() => {
                                    document.getElementById('resumeUpload').click();
                                }}
                                className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 font-medium"
                            >
                                Update Resume
                            </button>

                            <input
                                type="file"
                                id="resumeUpload"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 className="text-lg font-medium mt-4">No Resume Uploaded</h4>
                        <p className="text-gray-500 mt-2">Upload your resume to apply for jobs</p>
                        <button
                            onClick={() => {
                                document.getElementById('resumeUpload').click();
                            }}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                            Upload Resume
                        </button>
                        <input
                            type="file"
                            id="resumeUpload"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-lg font-medium text-blue-800">Resume Tips</h4>
                <ul className="mt-2 space-y-2 text-sm text-blue-700">
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Keep it to 1-2 pages maximum
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Use a professional format (PDF recommended)
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Highlight your most relevant skills and experiences
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-gray-800 min-h-screen">
                <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-gray-200 top-12">
                        <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex items-center px-3 py-2.5 font-medium rounded-lg text-left cursor-pointer ${activeTab === 'profile' ? 'bg-red-50 text-red-600 border border-red-200' : 'hover:bg-gray-50'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Public Profile
                        </button>

                        <button
                            onClick={() => setActiveTab('resume')}
                            className={`flex items-center px-3 py-2.5 font-medium rounded-lg text-left cursor-pointer ${activeTab === 'resume' ? 'bg-red-50 text-red-600 border border-red-200' : 'hover:bg-gray-50'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Resume
                        </button>

                        <Link
                            to="/applications"
                            onClick={() => setActiveTab && setActiveTab('profile')}
                            className="flex items-center px-3 py-2.5 font-medium rounded-lg text-left cursor-pointer hover:bg-gray-50"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            Applied Jobs
                        </Link>

                        <Link
                            to="/"
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2.5 font-medium rounded-lg text-left cursor-pointer text-red-600 hover:bg-gray-50 hover:underline"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                                />
                            </svg>
                            Logout
                        </Link>
                    </div>
                </aside>

                <main className="w-full py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-3xl sm:rounded-lg">
                            {activeTab === 'profile' && (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Public Profile</h2>
                                        <button
                                            onClick={() => setEditMode(!editMode)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                                        >
                                            {editMode ? 'Cancel' : 'Edit Profile'}
                                        </button>
                                    </div>
                                    {renderProfileTab()}
                                </>
                            )}

                            {activeTab === 'resume' && renderResumeTab()}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default ProfileManagement;
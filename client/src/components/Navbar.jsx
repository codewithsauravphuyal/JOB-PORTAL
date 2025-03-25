import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const {
    setShowRecruiterLogin,
    setShowJobSeekerLogin,
    userData,
    userToken,
    userLogout
  } = useContext(AppContext);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    userLogout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className='shadow py-4'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        <img 
          onClick={() => navigate('/')} 
          className='cursor-pointer w-32 sm:w-40' 
          src={assets.logo} 
          alt="logo" 
        />
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-4'>
          {userToken && userData ? (
            <>
              <Link to={'/applications'} className='hover:text-red-600 transition'>Applied Jobs</Link>
              <p className="text-gray-400">|</p>
              <Link to="/profile" className="flex items-center gap-2 hover:text-red-600 transition">
                <span>Hi, {userData?.name || 'User'}</span>
                <img
                  src={userData?.image || assets.default_profile}
                  className="w-8 h-8 rounded-full object-cover"
                  alt="Profile"
                />
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-red-600 cursor-pointer hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowRecruiterLogin(true)} 
                className='text-gray-600 hover:text-red-600 transition'
              >
                Recruiter Login
              </button>
              <button
                onClick={() => setShowJobSeekerLogin(true)}
                className='bg-red-600 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-red-700 transition'
              >
                Job Seeker Login
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="text-gray-600 focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            {isDropdownOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Mobile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md py-2 z-50 border border-gray-100">
              {userToken && userData ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 border-b border-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <img
                      src={userData?.image || assets.default_profile}
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Profile"
                    />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  <Link 
                    to={'/applications'} 
                    className="block px-4 py-3 hover:bg-gray-50 text-gray-700 border-b border-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Applied Jobs
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 flex items-center gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { setShowRecruiterLogin(true); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 border-b border-gray-100 flex items-center gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Recruiter Login</span>
                  </button>
                  <button
                    onClick={() => { setShowJobSeekerLogin(true); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 bg-red-600 rounded text-white hover:bg-red-700 flex gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Job Seeker Login</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
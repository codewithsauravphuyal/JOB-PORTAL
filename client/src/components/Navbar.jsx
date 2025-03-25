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
  } = useContext(AppContext);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className='shadow py-4'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        <img 
          onClick={() => navigate('/')} 
          className='cursor-pointer w-32 sm:w-40' 
          src={assets.logo} 
          alt="logo" 
        />
        
        <div className='hidden md:flex items-center gap-4'>
          {userToken && userData ? (
            <>
              <Link to={'/applications'} className='hover:text-red-600 transition'>Applied Jobs</Link>
              <p>|</p>
              <Link to="/profile" className="flex items-center gap-2 hover:text-red-600 transition">
                <span>Hi, {userData?.name || 'User'}</span>
                <img
                  src={userData?.image || assets.default_profile}
                  className="w-8 h-8 rounded-full object-cover"
                  alt="Profile"
                />
              </Link>
              {/* <button 
                onClick={userLogout} 
                className="text-red-600 cursor-pointer hover:underline"
              >
                Logout
              </button> */}
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

        {/* Mobile menu button */}
        <div className="md:hidden relative">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-600">
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

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-38 bg-white shadow-md rounded-lg py-1 z-50">
              {userToken && userData ? (
                <>
                <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-1 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {/* <img
                      src={userData?.image || assets.default_profile}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="Profile"
                    /> */}
                    <span>Profile</span>
                    {/* <span>Hi, {userData?.name || 'User'}</span> */}
                  </Link>
                  <Link 
                    to={'/applications'} 
                    className="block px-4 py-1 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Applied Jobs
                  </Link>
                  {/* <button 
                    onClick={() => { userLogout(); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-1 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button> */}
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { setShowRecruiterLogin(true); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Recruiter Login
                  </button>
                  <button
                    onClick={() => { setShowJobSeekerLogin(true); setIsDropdownOpen(false); }}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Job Seeker Login
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
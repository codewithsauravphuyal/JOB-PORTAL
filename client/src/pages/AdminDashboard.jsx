import React from 'react';
import { assets } from '../assets/assets';
import Footer from '../components/Footer';
import { NavLink, useNavigate } from 'react-router-dom';




const AdminDashboard = () => {
    const navigate = useNavigate()
    return (
        <div className='min-h-screen'>
            {/* Navbar for Admin Panel */}
            <div className='shadow py-4'>
                <div className='px-5 flex justify-between items-center'>
                    <img onClick={e => navigate('/')} className='max-sm:w-32 cursor-pointer' src={assets.logo} alt='logo' width='150' />
                    <div className='flex items-center gap-3'>
                        <p className='max-sm:hidden'>Welcome, Admin</p>
                        <div className='relative group'>
                            <img className='w-8 border border-gray-50 rounded-full' src={assets.company_icon} alt='' />
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex'>
                {/* Left Sidebar */}
               <div className='inline-block min-h-screen border-gray-300 border-r-2'>
                                   <ul className="flex flex-col items-start pt-5 text-gray-800">
                                       <NavLink
                                           className={({ isActive }) =>
                                               `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 
                        ${isActive ? 'bg-red-100 border-r-4 border-red-500' : ''}`
                                           }
                                           to="#"
                                       >
                                           <img className='min-w-4' src={assets.add_icon} alt="Graph Icon" />
                                           <p className='max-sm:hidden'>Report and Analysis</p>
                                       </NavLink>
               
                                       <NavLink
                                           className={({ isActive }) =>
                                               `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 
                        ${isActive ? 'bg-red-100 border-r-4 border-red-500' : ''}`
                                           }
                                           to="#"
                                       >
                                           <img className='min-w-4' src={assets.home_icon} alt="Recruitments Management Icon" />
                                           <p className='max-sm:hidden'>Recruitments Management</p>
                                       </NavLink>
               
                                       <NavLink
                                           className={({ isActive }) =>
                                               `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 
                        ${isActive ? 'bg-red-100 border-r-4 border-red-500' : ''}`
                                           }
                                           to="#"
                                       >
                                           <img className='min-w-4' src={assets.person_tick_icon} alt="Users Management Icon" />
                                           <p className='max-sm:hidden'>Users Management</p>
                                       </NavLink>
                                   </ul>
                               </div>

                {/* Main Content Area */}
                <div className='flex-1 h-full p-2 sm:p-5'>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;

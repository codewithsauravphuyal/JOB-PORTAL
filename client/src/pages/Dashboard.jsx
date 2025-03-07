import React, { useContext, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'

const Dashboard = () => {


    const navigate = useNavigate()
    const {companyData, setCompanyData, setCompanyToken} = useContext(AppContext)

    //Function to logout company
    const logout = () =>{
        setCompanyToken(null)
        localStorage.removeItem('companyToken')
        setCompanyData(null)
        navigate('/')
    }

    useEffect (()=>{
        if (companyData){
            navigate('/dashboard/manage-job')
        }
    },[companyData])


    return (
        <div className='min-h-screen'>
            {/* Navbar for Recuiter Panel */}
            <div className='shadow py-4'>
                <div className='px-5 flex justify-between items-center'>
                    <img onClick={e => navigate('/')} className='max-sm:w-32 cursor-pointer' src={assets.logo} alt="logo" width="150" />
                    {companyData&& (
                        <div className='flex items-center gap-3'>
                        <p className='max-sm:hidden'>Welcome, {companyData.name}</p>
                        <div className='relative group'>
                            <img className='w-8 border border-gray-50 rounded-full' src={companyData.image} alt="" />
                            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                                <ul className='list-non m-0 p-2 bg-white rounded-md border border-gray-50 text-sm'>
                                    <li onClick={logout} className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    )}
                    
                </div>
            </div>


            <div className='flex item-start'>

                {/*Left Sidebar with option to add job, manage jobs, and view application*/}
                <div className='inline-block min-h-screen border-gray-300 border-r-2'>
                    <ul className="flex flex-col items-start pt-5 text-gray-800">
                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 
         ${isActive ? 'bg-red-100 border-r-4 border-red-500' : ''}`
                            }
                            to="/dashboard/add-job"
                        >
                            <img className='min-w-4' src={assets.add_icon} alt="Add Job Icon" />
                            <p className='max-sm:hidden'>Add Job</p>
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 
         ${isActive ? 'bg-red-100 border-r-4 border-red-500' : ''}`
                            }
                            to="/dashboard/manage-job"
                        >
                            <img className='min-w-4' src={assets.home_icon} alt="Manage Jobs Icon" />
                            <p className='max-sm:hidden'>Manage Jobs</p>
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 
         ${isActive ? 'bg-red-100 border-r-4 border-red-500' : ''}`
                            }
                            to="/dashboard/view-applications"
                        >
                            <img className='min-w-4' src={assets.person_tick_icon} alt="View Applications Icon" />
                            <p className='max-sm:hidden'>View Applications</p>
                        </NavLink>
                    </ul>
                </div>


                <div className='flex-1 h-full p-2 sm:p-5'>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
        
    )
}

export default Dashboard

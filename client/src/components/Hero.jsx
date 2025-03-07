import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {

    const {setSearchFilter, setIsSearched} = useContext(AppContext)

    const titleRef = useRef(null)
    const locationRef = useRef(null)

    const onSearch = () =>{
        setSearchFilter({
            title: titleRef.current.value,
            location: locationRef.current.value
        })
        setIsSearched(true)
        console.log({
            title: titleRef.current.value,
            location: locationRef.current.value
        });
    }
    
    return (
        <div className='container 2xl:px-20 mx-auto my-10'>
            <div className='bg-gradient-to-r from-red-800 to-red-950 text-white py-16 text-center mx-2 rounded-xl'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>Over 100+ jobs to apply</h2>
                <p className='mb-8 max-w-xl mx-auto test-sm font-light px-5'>Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!</p>
                <div className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'>
                    <div className='flex items-center'>
                        <img className='h-4 sm:h-5' src={assets.search_icon} alt="search icon" />
                        <input type="text" placeholder='Search for jobs' className='max-sm:text-xs p-2 rounded outline-none w-full' 
                        ref={titleRef}/>
                    </div>
                    <div className='flex items-center'>
                        <img className='h-4 sm:h-5' src={assets.location_icon} alt="search icon" />
                        <input type="text" placeholder='Location' className='max-sm:text-xs p-2 rounded outline-none w-full' 
                        ref={locationRef}/>
                    </div>
                    <button onClick={onSearch} className='bg-red-600 px-6 py-2 rounded text-white m-1 cursor-pointer'>Search</button>
                </div>
            </div>
            <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-lg bg-white">
                <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
                    <p className="font-semibold text-gray-700 text-lg w-full text-center tracking-wide">
                        Trusted By Leading Companies
                    </p>
                    <img className="h-10 md:h-12 grayscale hover:grayscale-0 transition duration-300" src={assets.code_it_logo} alt="Code IT" />
                    <img className="h-14 md:h-16 grayscale hover:grayscale-0 transition duration-300" src={assets.digital_pathshala_logo} alt="Digital Pathshala" />
                    {/* <img className="h-10 md:h-12 grayscale hover:grayscale-0 transition duration-300" src={assets.hunchha_digital_logo} alt="Hunchha Digital" /> */}
                    <img className="h-10 md:h-12 grayscale hover:grayscale-0 transition duration-300" src={assets.lunar_it_logo} alt="Lunar IT" />
                    <img className="h-10 md:h-12 filter invert grayscale hover:grayscale-0 transition duration-300" src={assets.youth_it_logo} alt="Youth IT" />
                </div>
            </div>


        </div>
    )
}

export default Hero

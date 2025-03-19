// import React, { useContext, useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AppContext } from '../context/AppContext';
// import { toast } from 'react-toastify';
// import { JobCategories, JobLocations } from '../assets/assets';

// const EditJob = () => {
//   const { jobId } = useParams(); // Get jobId from URL
//   const { backendUrl, companyToken } = useContext(AppContext);
//   const navigate = useNavigate();

//   const [title, setTitle] = useState('');
//   const [location, setLocation] = useState('');
//   const [category, setCategory] = useState('');
//   const [level, setLevel] = useState('');
//   const [salary, setSalary] = useState(0);
//   const [isLoading, setIsLoading] = useState(false); // Loading state

//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/company/job/${jobId}`, {
//           headers: { token: companyToken },
//         });
//         if (data.success) {
//           const job = data.job;
//           setTitle(job.title);
//           setLocation(job.location);
//           setCategory(job.category);
//           setLevel(job.level);
//           setSalary(job.salary);
//         } else {
//           toast.error(data.message);
//         }
//       } catch (error) {
//         toast.error("Failed to fetch job details");
//       }
//     };

//     fetchJobDetails();
//   }, [jobId, backendUrl, companyToken]);

//   const handleUpdateJob = async (e) => {
//     e.preventDefault();
//     setIsLoading(true); // Start loading state
//     try {
//       const { data } = await axios.put(
//         `${backendUrl}/api/company/update-job/${jobId}`,
//         { title, location, category, level, salary },
//         { headers: { token: companyToken } }
//       );
//       setIsLoading(false); // Stop loading state
//       if (data.success) {
//         toast.success(data.message);
//         navigate('/manage-jobs'); // Redirect to manage jobs page
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       setIsLoading(false); // Stop loading state
//       toast.error('Failed to update the job: ' + error.message);
//     }
//   };

//   return (
//     <div className='container'>
//       <form onSubmit={handleUpdateJob} className='p-4'>
//         <h2>Edit Job</h2>
//         <div className='mb-4'>
//           <label>Job Title</label>
//           <input
//             type='text'
//             className='w-full p-2 border border-gray-300'
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>
//         <div className='mb-4'>
//           <label>Category</label>
//           <select
//             className='w-full p-2 border border-gray-300'
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             {JobCategories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className='mb-4'>
//           <label>Location</label>
//           <select
//             className='w-full p-2 border border-gray-300'
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           >
//             {JobLocations.map((loc) => (
//               <option key={loc} value={loc}>
//                 {loc}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className='mb-4'>
//           <label>Level</label>
//           <select
//             className='w-full p-2 border border-gray-300'
//             value={level}
//             onChange={(e) => setLevel(e.target.value)}
//           >
//             <option value="Beginner Level">Beginner Level</option>
//             <option value="Intermediate Level">Intermediate Level</option>
//             <option value="Senior Level">Senior Level</option>
//           </select>
//         </div>
//         <div className='mb-4'>
//           <label>Salary</label>
//           <input
//             type='number'
//             className='w-full p-2 border border-gray-300'
//             value={salary}
//             onChange={(e) => setSalary(e.target.value)}
//             required
//           />
//         </div>
//         <button
//           className='py-2 px-4 bg-red-600 text-white rounded'
//           type='submit'
//           disabled={isLoading} // Disable button when loading
//         >
//           {isLoading ? 'Saving...' : 'Save Changes'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditJob;

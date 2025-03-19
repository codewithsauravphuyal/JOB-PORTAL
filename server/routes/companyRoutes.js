import express from 'express'
import { changeJobApplicantsStatus, changeVisibility, deleteJob, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router = express.Router()

//Register a company
router.post('/register', upload.single('image'), registerCompany)

//Company Login
router.post('/login', loginCompany)

//Get Company Data
router.get('/company', protectCompany, getCompanyData)

//Post a job
router.post('/post-job', protectCompany, postJob)

//Get Applicants Data of Company
router.get('/applicants', protectCompany, getCompanyJobApplicants)

//Get Company Job List
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

//Change Applications Status
router.post('/change-status', protectCompany, changeJobApplicantsStatus)

// Delete a job
router.delete('/delete-job/:id', protectCompany, deleteJob);

//Change Applications Visibility
router.post('/change-visibility', protectCompany, changeVisibility)

export default router
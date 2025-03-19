import express from 'express'
import { getJobByID, getJobs } from '../controllers/jobController.js';

const router = express.Router()

//Routes to get all jobs data
router.get('/', getJobs)

//Routes to get a single job by ID
router.get('/:id', getJobByID)





export default router;
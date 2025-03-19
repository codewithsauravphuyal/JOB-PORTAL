import Company from "../models/Company.js";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// Register a new Company
export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;
    const imageFile = req.file;
    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "Missing Details" });
    }
    try {
        const companyExists = await Company.findOne({ email });

        if (companyExists) {
            return res.json({ success: false, message: "Company already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url,
        });

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
            token: generateToken(company._id),
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Company Login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body;
    try {
        const company = await Company.findOne({ email });
        if (await bcrypt.compare(password, company.password)) {
            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image,
                },
                token: generateToken(company._id),
            });
        } else {
            res.json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Company Data
export const getCompanyData = async (req, res) => {
    try {
        const company = req.company;
        res.json({ success: true, company });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Post a new job
export const postJob = async (req, res) => {
    const { title, description, location, salary, level, category } = req.body;
    const companyId = req.company._id;

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: new Date(),
            level,
            category,
        });
        await newJob.save();
        res.json({ success: true, newJob });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id;
        const applications = await JobApplication.find({ companyId })
            .populate('userId', 'name image resume')
            .populate('jobId', 'title location category level salary')
            .exec();

        return res.json({ success: true, applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id;
        const jobs = await Job.find({ companyId });

        const jobsData = await Promise.all(
            jobs.map(async (job) => {
                const applicants = await JobApplication.find({ jobId: job._id });
                return { ...job.toObject(), applicants: applicants.length };
            })
        );

        res.json({ success: true, jobsData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Change Job Applicants Status
export const changeJobApplicantsStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        // Find Job application and update status
        await JobApplication.findOneAndUpdate({ _id: id }, { status });

        res.json({ success: true, message: 'Status Changed' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Change Job Visibility
export const changeVisibility = async (req, res) => {
    try {
        const { id } = req.body;
        const companyId = req.company._id;
        const job = await Job.findById(id);

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible;
        }
        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Job
export const deleteJob = async (req, res) => {
    const { id } = req.params; // Get job ID from the request parameters
    const companyId = req.company._id; // Company ID from the authenticated user

    try {
        // Find the job by ID
        const job = await Job.findById(id);

        // If the job does not exist, return a 404 error
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check if the company is authorized to delete the job (i.e., the job's companyId must match the authenticated company)
        if (job.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this job',
            });
        }

        // Optionally delete related job applications if needed
        await JobApplication.deleteMany({ jobId: id });

        // Delete the job from the database
        await Job.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
        });
    }
};

import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';
import generateToken from "../utils/generateToken.js";

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const imageFile = req.file;
  
  if (!name || !email || !phone || !password || !imageFile) {
    return res.status(400).json({ 
      success: false, 
      message: "Please provide all required fields" 
    });
  }
  
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      image: imageUpload.secure_url,
      resume: ""
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image
      },
      token
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// User login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user._id; // From middleware

    // Check if already applied
    const existingApplication = await JobApplication.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied for this job' 
      });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check if user has a resume
    const user = await User.findById(userId);
    if (!user.resume) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload your resume before applying' 
      });
    }

    // Create application
    await JobApplication.create({
      companyId: job.companyId,
      userId,
      jobId,
      date: Date.now(),
      status: 'Pending'
    });

    res.json({ 
      success: true, 
      message: "Application submitted successfully" 
    });
  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update user resume
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.user._id; // From middleware
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload a resume file' 
      });
    }

    // Upload resume to Cloudinary
    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, {
      resource_type: "auto" // For PDF files
    });

    // Update user's resume
    await User.findByIdAndUpdate(userId, { 
      resume: resumeUpload.secure_url 
    });

    res.json({ 
      success: true, 
      message: 'Resume updated successfully' 
    });
  } catch (error) {
    console.error("Resume update error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get user data
export const getUserData = async (req, res) => {
    try {
        // User is attached to request by protectUser middleware
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get user's job applications
export const getUserJobApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({ userId: req.user._id })
            .populate('companyId', 'name image')
            .populate('jobId', 'title location salary')
            .exec();

        res.json({ 
            success: true, 
            applications 
        });
    } catch (error) {
        console.error("Get applications error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const updateUserProfile = async (req, res) => {
  try {
    const updates = {};
    const user = await User.findById(req.user._id);

    // Update name if provided
    if (req.body.name) {
      updates.name = req.body.name;
    }

    // Update image if provided
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path);
      updates.image = imageUpload.secure_url;
    }

    // Update password if provided
    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required'
        });
      }

      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.newPassword, salt);
    }

    // Apply updates
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
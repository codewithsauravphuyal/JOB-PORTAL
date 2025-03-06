import mongoose from "mongoose";

// Function to Connect MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`);

        console.log("Database Connected Successfully...");
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;


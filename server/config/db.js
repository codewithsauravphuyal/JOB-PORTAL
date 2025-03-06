import mongoose from "mongoose";

// Function to Connect MongoDB database
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;  // Ensure this is a valid URI in your .env file
        if (!uri) {
            console.error("MongoDB URI not provided in .env file.");
            process.exit(1);
        }

        // Connect to MongoDB without deprecated options
        await mongoose.connect(uri);

        console.log("Database Connected Successfully...");
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;

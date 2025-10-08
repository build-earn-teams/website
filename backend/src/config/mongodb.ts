import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        mongoose.connection.on('connected', () => console.log("DATABASE CONNECTED"));

        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        await mongoose.connect(`${mongoUri}/build-earn-website`);
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in connecting Database:", error.message);
        } else {
            console.log("Unknown error in connecting Database:", error);
        }
    }
}

export default connectDB;

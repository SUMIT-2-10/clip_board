import mongoose from 'mongoose';




// This function checks if a mongoose connection already exists.
// If connected, it reuses the existing connection.
// Otherwise, it creates a new connection.
const connectDB = async () => {
    try {
        const mongoUri = process.env.MongoDB_URI;
        if (!mongoUri) {
            throw new Error('MongoDB_URI environment variable is not defined');
        }
        // 1 = connected, 2 = connecting
        if (mongoose.connection.readyState === 1) {
            console.log('Using existing MongoDB connection');
            return mongoose.connection;
        }
        const db = await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
        return db;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};

export default connectDB;
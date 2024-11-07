import mongoose from 'mongoose';

let isConnected; // Track the connection state

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return mongoose.connection;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    });
    isConnected = true;
    console.log("Successfully connected to MongoDB!");
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error('Failed to connect to MongoDB');
  }
};

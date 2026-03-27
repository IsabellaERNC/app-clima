import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB conectado ");
  } catch (error) {
    console.error("Error conectando MongoDB:", error.message);

    setTimeout(connectDB, 5000);
  }
};

export default connectDB;

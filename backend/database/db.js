import mongoose from "mongoose";

const connectDB = async()=>{
  try{
    await mongoose.connect(`${process.env.MONGO_URI}/auth_demo`)
    console.log("Database connected successfully");
  } catch(error){
    console.log("Error connecting to database:", error);
  }
}


export default connectDB
import express from 'express';
import 'dotenv/config';
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js';


const app = express();

const PORT = process.env.PORT || 8000;

// middleware
app.use(express.json());


app.use('/user', userRoute)



app.listen(PORT, ()=>{
  connectDB()
  console.log(`Server is running at ${PORT}`)
})
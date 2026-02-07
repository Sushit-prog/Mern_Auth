// import { verify } from "jsonwebtoken"
import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { verifyMail } from "../emailVerify/verifyEmail.js"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) =>{
  try{
    const {username, email, password} = req.body
    if(!username || !email || !password){
      return res.status(400).json({
        success: false,
        message:"All fields are required"
      })
    }
    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:"User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    })
    const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn:"1h"})

    verifyMail(token, email)
    newUser.token = token;

    await newUser.save()

    return res.status(201).json({
      sucess:true,
      message:"User registered sucessfully",
      data:newUser
    })

  } catch(error){
    return res.status(500).json({message:"Internal server error", error:error.message})
  }
}

// export const verification  = async(req,res)=>{
//   try{
//     const authHeader = req.headers.authorization

//     if(!authHeader || !authHeader.startswith("Bearer ")){
//       return res.status(401).json({
//         success:false,
//         message:"Authorization token is missing or invalid"
//       })

//       const token = authHeader.split(" ")[1]

//       let decoded
//       try {
//         decoded = jwt.verify(token, process.env.JWT_SECRET)
//       } catch (err) {
//         if(err.name === 'TokenExpiredError'){
//           return res.status(401).json({
//             seccess:false,
//             message:"Token has expired"
//           })
//         }
//         return res.status(400).json({
//           success:false,
//           message:"Token verification failed"
//         })
        
//       }
//     }
//     const user = await User.findById(decoded.id)
//     if(!user){
//       return res.status(404).json({
//         success:false,
//         message:"User not found"
//       })
//     }

//     user.token = null
//     user.isVerified = true
//     await user.save()

//     return res.status(200).json({
//       success:true,
//       message:"Email verified successfully"
//     })
//   } catch(error){
//     return res.status(500).json({
//       success:false,
//       message:"Internal server error"
//     })
//   }
// }
export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid"
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired"
        });
      }

      return res.status(400).json({
        success: false,
        message: "Token verification failed"
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.token = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

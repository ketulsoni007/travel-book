import UserModel from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerController = async (req, res) => {
  try {
    const requiredFields = ["username", "email", "password"];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} is a required field(s)`,
      });
    }
    const { username, email, password, photo } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }
    const newUser = new UserModel({ username, email, password: hashedPassword, photo });
    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "15d" });
    return res.status(201).json({
      success: true,
      message: "User successfully created",
      data: savedUser,
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error,
    });
  }
};

// export const loginController = async (req, res) => {
//   try {
//       const requiredFields = ["email", "password"];
//       const missingFields = requiredFields.filter(field => !(field in req.body));
//       if (missingFields.length > 0) {
//           return res.status(400).json({
//               success: false,
//               message: `${missingFields.join(", ")} is a required field(s)`,
//           });
//       }
//       const { email, password } = req.body;
//       const existingUser = await UserModel.findOne({ email });
//       if (!existingUser) {
//           return res.status(400).json({
//               success: false,
//               message: "User not found",
//           });
//       }
//       const passwordMatch = await bcrypt.compare(password, existingUser.password);
//       if (!passwordMatch) {
//           return res.status(400).json({
//               success: false,
//               message: "Invalid password",
//           });
//       }
//       const token = jwt.sign({ userId: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: "15d" });
//       const expirationDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days
//       res.cookie("accessToken", token, {
//           httpOnly: true,
//           expires: expirationDate,
//       });
//       return res.status(200).json({
//           success: true,
//           message: "Login successful",
//           data: existingUser,
//       });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({
//           success: false,
//           message: "Error during login",
//           error: error.message,
//       });
//   }
// };
export const loginController = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkCorrectPassword) {
      return res.status(402).json({
        success: false,
        message: "Incorrect Email or Password",
      })
    }
    const { password, role, ...rest } = user._doc;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15d" });
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: token.expiresIn,
    }).status(200).json({
      success:true,
      message:"Login successful",
      token,
      data:{...rest},
      role
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error,
    });
  }
};

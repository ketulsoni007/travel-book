import { Router } from "express";
import { registerController,loginController } from "../Controller/authController.js";
// import userAuth from "../middlewares/authMiddleware.js";

const authRoute = Router();

authRoute.post("/register",registerController)
authRoute.post("/login",loginController)

export default authRoute;
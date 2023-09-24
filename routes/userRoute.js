import { Router } from "express";
import { createUserController,updateUserController,getAllUserController,getSingleUserController,deleteUserController } from "../Controller/userController.js";
import { verifyUserCheck } from "../utils/verifyToken.js";

const userRoute = Router();

userRoute.post("/create-user", createUserController);
userRoute.put("/update-user/:id",verifyUserCheck ,updateUserController);
userRoute.get("/getall-user", verifyUserCheck,getAllUserController);
userRoute.get("/getsingle-user/:id", verifyUserCheck, getSingleUserController);
userRoute.delete("/delete-user/:id", verifyUserCheck,deleteUserController);

export default userRoute;
import { Router } from "express";
import { createReviewController } from "../Controller/reviewController.js";
import { verifyUserCheck } from "../utils/verifyToken.js";

const reviewRoute = Router();

reviewRoute.post("/create-review/:tourId",verifyUserCheck,createReviewController)

export default reviewRoute;
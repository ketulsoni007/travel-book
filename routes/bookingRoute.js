import { Router } from "express";
import { createbookingController, getAllBookingController, getBookingController } from "../Controller/bookingController.js";
import { verifyUserCheck } from "../utils/verifyToken.js";

const bookingRoute = Router();

bookingRoute.post("/create-booking",verifyUserCheck,createbookingController)
bookingRoute.get("/get-booking-details/:id",verifyUserCheck,getBookingController)
bookingRoute.get("/get-all-booking",verifyUserCheck,getAllBookingController)

export default bookingRoute;
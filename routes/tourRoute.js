import { Router } from "express";
import { createTourController, deleteTourController, getAllTourController, getSingleTourController, updateTourController,getTourBySearchController,getFeaturedTourController,getTourCount } from "../Controller/tourController.js";
import { verifyAdmin } from "../utils/verifyToken.js";


const tourRoute = Router();

tourRoute.post("/create-tour",verifyAdmin,createTourController);
tourRoute.put("/update-tour/:id",verifyAdmin,updateTourController);
tourRoute.delete("/delete-tour/:id",verifyAdmin,deleteTourController);
tourRoute.get("/get-tour",getAllTourController);
tourRoute.get("/get-single-tour/:id",getSingleTourController);
tourRoute.get("/search-tours", getTourBySearchController);
tourRoute.get("/get-featured-tours", getFeaturedTourController);
tourRoute.get("/get-tour-count", getTourCount);

export default tourRoute;
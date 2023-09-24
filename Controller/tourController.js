import TourModel from "../Model/TourModel.js";

export const createTourController = async (req, res) => {
    try {
        const requiredFields = ["title", "city", "address", "distance", "photo", "desc", "price", "maxGroupSize"];
        const missingFields = requiredFields.filter(field => !(field in req.body));
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${missingFields.join(", ")} is a required fields`,
            });
        }
        const newTour = new TourModel(req.body);
        const savedTour = await newTour.save();
        return res.status(201).json({
            success: true,
            message: "Successfully Created",
            data: savedTour
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Creating Tour",
            success: false,
            error
        });
    }
};

export const updateTourController = async (req, res) => {
    try {
        const requiredFields = ["title", "city", "address", "distance", "photo", "desc", "price", "maxGroupSize"];
        const missingFields = requiredFields.filter(field => !(field in req.body));
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${missingFields.join(", ")} are required fields`,
            });
        }
        const { id } = req.params;
        const updatedTour = await TourModel.findByIdAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );
        if (!updatedTour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Tour updated successfully",
            data: updatedTour,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error updating tour",
            success: false,
            error,
        });
    }
};

export const getAllTourController = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const tours = await TourModel.find({}).populate("reviews").skip(page * 8).limit(8);
        return res.status(200).json({
            success: true,
            message: "All tours retrieved successfully",
            count:tours.length,
            data: tours,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving tours",
            success: false,
            error,
        });
    }
};

export const getSingleTourController = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await TourModel.findById({_id:id}).populate("reviews");
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Tour retrieved successfully",
            data: tour,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving tour",
            success: false,
            error,
        });
    }
};

export const deleteTourController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTour = await TourModel.findByIdAndDelete({ _id: id });
        if (!deletedTour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Tour deleted successfully",
            data: deletedTour,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting tour",
            success: false,
            error,
        });
    }
};

export const getTourBySearchController = async (req, res) => {
    try {
        const city = new RegExp(req.query.city, "i");
        const distance = parseInt(req.query.distance);
        const maxGroupSize = parseInt(req.query.maxGroupSize);
        const tours = await TourModel.aggregate([
            {
                $match: {
                    city,
                    distance: { $gte: distance },
                    maxGroupSize: { $gte: maxGroupSize },
                },
            },
        ]);
        return res.status(200).json({
            success: true,
            message: "Tours fetched successfully",
            data: tours,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching tours",
            success: false,
            error,
        });
    }
};

export const getFeaturedTourController = async (req, res) => {
    try {
        const tours = await TourModel.find({featured:true}).populate("reviews").limit(8);
        return res.status(200).json({
            success: true,
            message: "Tours fetched successfully",
            data: tours,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching tours",
            success: false,
            error,
        });
    }
};

export const getTourCount = async (req,res)=>{
    try {
        const tourCount = await TourModel.estimatedDocumentCount();
        return res.status(200).json({
            success: true,
            message: "Tours count fetched successfully",
            data: tourCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error getting tour count",
            success: false,
            error,
        });
    }
}
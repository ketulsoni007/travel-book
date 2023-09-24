import TourModel from "../Model/TourModel.js";
import ReviewModel from "../Model/ReviewModel.js";

export const createReviewController = async (req, res) => {
    const tourId = req.params.tourId;
    const newReview = new ReviewModel({ ...req.body });
    try {
        const savedReview = await newReview.save();
        await TourModel.findByIdAndUpdate(tourId, { $push: { reviews: savedReview._id } });
        return res.status(200).json({
            success: true,
            message: "Review Submitted",
            data: savedReview
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error Creating Review",
            error: error.message
        });
    }
};
import BookingModel from "../Model/BookingModel.js";

export const createbookingController = async (req, res) => {
    const newBooking = new BookingModel(req.body);
    try {
        const savedBooking = await newBooking.save();
        return res.status(200).json({
            success: true,
            message: "Tour Succesfully Booked",
            data: savedBooking
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Booking Tour",
            success: false,
            error
        });
    }
};

export const getBookingController = async(req,res)=>{
    const id = req.params.id
    try {
        const book = await BookingModel.findById({_id:id})
        return res.status(200).json({
            success: true,
            message: "Tour Succesfully Fetched",
            data: book
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Fetching Tour",
            success: false,
            error
        });
    }
}

export const getAllBookingController = async(req,res)=>{
    try {
        const books = await BookingModel.find({});
        return res.status(200).json({
            success: true,
            message: "Tour Succesfully Fetched",
            data: books
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Fetching Tour",
            success: false,
            error
        });
    }
}


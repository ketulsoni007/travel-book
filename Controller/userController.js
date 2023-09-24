import UserModel from "../Model/UserModel.js";

export const createUserController = async (req, res) => {
    try {
        const requiredFields = ["username", "email", "password"];
        const missingFields = requiredFields.filter(field => !(field in req.body));
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${missingFields.join(", ")} is a required field(s)`,
            });
        }
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email already exists",
            });
        }
        const newUser = new UserModel({ username, email, password });
        const savedUser = await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User successfully created",
            data: savedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message,
        });
    }
};

export const updateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !UserModel.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const requiredFields = ["username", "email", "password"];
        const missingFields = requiredFields.filter(field => !(field in req.body));
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${missingFields.join(", ")} are required fields`,
            });
        }
        const { username, email } = req.body;
        const existingUser = await UserModel.findOne({ $and: [{ _id: { $ne: id } }, { $or: [{ username }, { email }] }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email already exists",
            });
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating user",
            error: error.message,
        });
    }
};

export const getAllUserController = async (req, res) => {
    try {
        const users = await UserModel.find({})
        return res.status(200).json({
            success: true,
            message: "All users retrieved successfully",
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving users",
            success: false,
            error,
        });
    }
};

export const getSingleUserController = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the provided user ID is valid
        if (!id || !UserModel.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // Find the user by ID
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving user",
            error: error.message,
        });
    }
};

export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !UserModel.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const deletedUser = await UserModel.findByIdAndRemove(id);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message,
        });
    }
};
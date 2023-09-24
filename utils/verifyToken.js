import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// export const tokenValidationCheck = async (req, res, next) => {
//     const token = req.cookies.accessToken;
//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: 'Access denied'
//         });
//     }
//     jwt.verify(req.token, process.env.JWT_SECRET, (err, user) => {
       
//         if (err) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid Token'
//             });
//         }
//         req.user = user
//         next()
//     });
// };

export const tokenValidationCheck = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied'
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Token'
            });
        }
        req.user = user;
        next();
    });
};


export const verifyUserCheck = async (req, res, next) => {
    tokenValidationCheck(req,res,next,()=>{
        if(req.user.id === req.params.id || req.user.role === "admin"){
            next()
        }else{
            return res.status(401).send({
                success:false,
                message:"You are not authorized to perform this action",
            })
        }
    })
};

export const verifyAdmin = async (req, res, next) => {
    tokenValidationCheck(req,res,next,()=>{
        if(req.user.role === "admin"){
            next()
        }else{
            return res.status(401).send({
                success:false,
                message:"You are not authorized to perform this action",
            })
        }
    })
};
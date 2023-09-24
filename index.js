import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import morgan from "morgan";
import colors from "colors"
import connectDB from "./Config/db.js";
import tourRoute from "./routes/tourRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import path from "path";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config();
connectDB();
  
const corsOptions = {
    origin: "http://ec2-13-49-78-161.eu-north-1.compute.amazonaws.com:3000",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/tour", tourRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);

app.use(express.static(path.resolve(__dirname, "./client/build")));

// Route all other requests to the client's index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 8181;

app.listen(PORT, () => {
    console.log(`node server runnings In ${process.env.DEV_MODE} mode on PORT ${PORT}`.bgCyan.white)
})
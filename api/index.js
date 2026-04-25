import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import counterargRoutes from "./routes/counterargument.route.js";
import savedRoutes from "./routes/saved.route.js";
import adminRoutes from "./routes/admin.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

const counterargLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Maximum 50 requests per IP per window
  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many requests. Please wait a few minutes before trying again.",
  },
  standardHeaders: true, // Sends rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disables the old X-RateLimit-* headers
});

app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      // or from chrome-extension:// origins
      if (
        !origin ||
        origin.startsWith("chrome-extension://") ||
        origin === "https://argusure.onrender.com"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on Port ${process.env.PORT}`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/counterarg", counterargLimiter);
app.use("/api/counterarg", counterargRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/admin", adminRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

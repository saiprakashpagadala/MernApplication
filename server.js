// Api Documentation

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
// packages imports
// const express = require("express"); // this one is common.js type
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// security imports
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// file imports
import connectDB from "./config/db.js";

// routes imports
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

// dotenv config
dotenv.config();

// mongo database connection
connectDB();

// swagger api config
// swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node ExpressJs Job Portal Application",
    },
    servers: [
      {
        // url: "http://localhost:8080",
        url:"https://node-express-job-application.onrender.com/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerJSDoc(options)

// rest objects
const app = express();

// middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// app.get("/", (req, res) => {
//   res.send(
//     `<h1>Welcome to Mern stack Application in ${process.env.DEV_MODE}</h1>`
//   );
// });

// routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);

// homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

// validation middleware
app.use(errorMiddleware);

// port
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
  console.log(`Node Server Running At Port ${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger";
import authRoutes from './routes/auth.routes'
import articleRoutes from './routes/article.routes'
import tagRoutes from './routes/tag.routes'

dotenv.config();

const app = express();

const whiteList = ["http://localhost:4000"];

app.use(
  cors({
    origin: function (origin: any, callback) {
      if (!origin || whiteList.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes)
app.use("/api/tags", tagRoutes)

app.listen(4000, () => {
  console.log("Server running at: " + whiteList);
});

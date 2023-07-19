import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import APIRouter from "./api/router";

dotenv.config();

const app: Express = express();
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (_: Request, res: Response) => {
  res.send("Coupons app with Express & Typescript 🎫");
});
APIRouter(app);

const port = process.env.PORT || 3000;
const mongodbURL = `${process.env.MONGODB_URL}`;
async function connectDB(callback: Function) {
  mongoose.connect(mongodbURL).then(
    () => {
      console.log("🔌[mongodb]: MongoDB is connected successfully.");
      if (callback) {
        callback();
      }
    },
    (error: Error) => {
      throw error;
    }
  );
}
connectDB(() => {
  app.listen(port, () => {
    console.log(`⚡[server]: Server is running at //localhost:${port}.`);
  });
});

export { app as server };

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const mongodbURL = `${process.env.MONGODB_URL}`;

app.get("/", (_: Request, res: Response) => {
  res.send("Coupons app with Express & Typescript 🎫");
});

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
  )
}
connectDB(() => {
  app.listen(port, () => {
    console.log(`⚡[server]: Server is running at //localhost:${port}.`);
  });
});

export { app as server };
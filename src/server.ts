/* eslint-disable no-console */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./config/db.config";
import errorHandler from "./middlewares/error.middleware";
import publicRouter from "./routes/public.routes";
import userRouter from "./routes/user.routes";
import protect from "./middlewares/auth.middleware";
import roleRouteAccess from "./middlewares/role_access.middleware";
import { recieveMessage } from "./controllers/chat.controller";
import socketConfig from "./config/socket.config";

dotenv.config();

// Connect to DB
connectToDB();

// Express App
const app = express();
const port: number = Number(process.env.PORT) || 5050;

// Express & Cors Middlewares
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
    origin: "*",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const apiVersion = process.env.API_VERSION || "";
app.use(`${apiVersion}/public`, publicRouter);
app.use(`${apiVersion}/user`, protect, roleRouteAccess, userRouter);

// Middlewares
app.use(errorHandler);

export const server = app.listen(port, () => {
  console.log(`🌐 Server is running on port ${port} 🌐`);
  recieveMessage(server);
});

// Graceful Shutdown
type ExitHandlerOptions = {
  shutdownSERVER: boolean;
};
const exitHandler = (options: ExitHandlerOptions, exitCode: number) => {
  if (options.shutdownSERVER) {
    console.log("\n🙌Shutting down... SERVER🙌");
    server.close(() => {
      console.log("Process terminated! 💀", exitCode);
      process.exit(0);
    });
  }
};
process.on("SIGINT", exitHandler.bind(null, { shutdownSERVER: true }));

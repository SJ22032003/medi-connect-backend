/* eslint-disable no-console */
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

function socketConfig(server: http.Server) {
  const io = new Server(server, {
    cors: {
      methods: ["GET", "POST"],
      origin: "*",
    },
  });

  return io;
}

export default socketConfig;

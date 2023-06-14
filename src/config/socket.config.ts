/* eslint-disable no-console */
import http from "http";
import { Server } from "socket.io";

function socketConfig(server: http.Server) {
  const io = new Server(server, {
    cors: {
      methods: ["GET", "POST"],
      origin: process.env.ALLOWED_ORIGIN || "*",
    },
  });

  return io;
}

export default socketConfig;

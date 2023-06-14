/* eslint-disable no-console */
import http from "http";
import { Server } from "socket.io";

function socketConfig(server: http.Server) {
  const io = new Server(server, {
    cors: {
      methods: ["GET", "POST"],
      origin: "http://localhost:5173",
    },
  });

  return io;
}

export default socketConfig;

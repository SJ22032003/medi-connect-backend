/* eslint-disable no-console */
import http from "http";
import { Server } from "socket.io";

function socketConfig(server: http.Server) {
  const io = new Server(server, {
    cors: {
      methods: ["GET", "POST"],
      origin: "https://md-connect-prt.onrender.com",
    },
  });

  return io;
}

export default socketConfig;

/* eslint-disable no-console */
import { Server } from "http";
import { IRequestWithRole, IStatusResponse } from "../types/request.type";
import { createChatForUser, getChatForUser } from "../service/chat.service";
import socketConfig from "../config/socket.config";
import tryCatch from "../utils/try_catch.util";
import getSanitizedParam from "../utils/sanitized_param";

// RECIEVE MESSAGE FROM PATIENT|DOCTOR FROM SOCKET
const recieveMessage = async (server: Server) => {
  const io = socketConfig(server);
  console.log("Socket is running");
  io.on("connection", (socket) => {
    socket.on("JOIN", (data) => {
      socket.join(data);
    });

    socket.on("MESSAGE", async (room, data) => {
      socket.to(room).emit("MESSAGE", data);
      try {
        const chat = await createChatForUser(data);
        if (chat instanceof Error) throw chat;
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  io.on("disconnect", () => {
    console.log("user disconnected");
  });
};

// @desc get all chats based on room id
// @route GET /api/v1/user/chat/:roomId
// @access Private
const getAllChats = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const roomId = getSanitizedParam(req.params.roomId);

    const chats = await getChatForUser({ roomId }, {});
    if (chats instanceof Error) {
      res.statusCode = 400;
      throw chats;
    }

    return res.status(200).json({
      success: true,
      data: chats,
    });
  },
);

export { recieveMessage, getAllChats };

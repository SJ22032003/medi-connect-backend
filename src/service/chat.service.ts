import Chat from "../models/chat.model";

export const createChatForUser = async (data: {}) => {
  try {
    const response = await Chat.create(data);
    if (!response) return new Error("Error creating chat");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getChatForUser = async (conditions: {}, attributes: {}) => {
  try {
    const response = await Chat.find(conditions, attributes);
    if (!response) return new Error("Error getting chat");
    return response;
  } catch (error) {
    throw error;
  }
};

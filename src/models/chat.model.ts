import { mongoose, Document, Schema } from "./mongoose_export";

interface IChat extends Document {
  roomId: string;
  from: string;
  chat: string;
  fromId: string;
  toId: string;
}

const ChatSchema = new Schema(
  {
    roomId: {
      type: String,
      required: [true, "Room id required"],
    },
    from: {
      type: String,
      required: [true, "From required"],
    },
    chat: {
      type: String,
      required: [true, "Chat required"],
    },
    fromId: {
      type: String,
    },
    toId: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "chats",
  },
);

export default mongoose.model<IChat>("Chat", ChatSchema);

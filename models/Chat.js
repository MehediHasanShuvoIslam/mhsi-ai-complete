import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Reference to Clerk userId
  name: { type: String, default: 'New Chat' },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;

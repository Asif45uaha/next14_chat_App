import { connectDB } from "@mogodb";
import Message from "@models/Message";
import Chat from "@models/Chats";
import { pusherServer } from "@lib/pusher";
import User from "@models/User";


export const POST = async (req) => {
    try {
        await connectDB()
        const body = await req.json()

        const { chatId, currentUserId, text, photo } = body

        const currentUser = await User.findById(currentUserId)

        const newMessage = await Message.create({
            chat: chatId,
            sender: currentUser,
            text,
            photo,
            seenBy: currentUserId

        })

        const updatedChat = await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } }, { $set: { lastMessage: newMessage.createdAt } }, { new: true })
            .populate({
                path: "messages",
                model: Message,
                populate: {
                    path: "sender seenBy",
                    model: "User"
                }
            })
            .populate({
                path: "members",
                model: "User"
            }).exec()
        //trigger a pusher event for a specific event
        await pusherServer.trigger(chatId, "new-message", newMessage)
        const lastMessages = updatedChat.messages[updatedChat.messages.length - 1]
        updatedChat.members.forEach(async (member) => {
            try {
                await pusherServer.trigger(member._id.toString(), "update-chat", {
                    id: chatId,
                    messages: lastMessages
                })
            } catch (error) {
                console.log(error);
            }
        })
        return new Response(JSON.stringify(newMessage), { status: 201 })
    } catch (error) {
        console.log(error);
        return new Response("Failed to create a new message", { status: 500 });
    }
}
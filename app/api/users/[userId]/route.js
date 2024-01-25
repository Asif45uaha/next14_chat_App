import Chat from "@models/Chats"
import Message from "@models/Message"
import User from "@models/User"
import { connectDB } from "@mogodb"

export const GET = async (req, { params }) => {
    try {
        await connectDB()
        const { userId } = params
        const allChats = await Chat.find({ members: userId }).sort({ lastMessage: -1 })
            .populate({
                path: 'members',
                model: User
            })
            .populate({
                path: "messages",
                model: Message,
                populate: {
                    path: "sender seenBy",
                    model: User
                }
            })
            .exec()

        return new Response(JSON.stringify(allChats), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch chats' }), { status: 500 })
    }
}
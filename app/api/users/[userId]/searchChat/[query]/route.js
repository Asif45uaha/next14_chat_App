import Chat from "@models/Chats";
import Message from "@models/Message";
import User from "@models/User";
import { connectDB } from "@mogodb";

export const GET = async (req, { params }) => {
    try {
        await connectDB()
        const { userId, query } = params;
        const searchedChat = await Chat.find({
            members: userId,
            name: { $regex: query, $options: "i" }
        }).populate({
            path: "members",
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
        return new Response(JSON.stringify(searchedChat), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response("Failed to search chats", { status: 500 })
    }
}
import Chat from "@models/Chats";
import { connectDB } from "@mogodb"

export const POST = async (req, { params }) => {
    try {
        await connectDB()
        const body = await req.json()
        const { chatId } = params;
        const { name, groupPhoto } = body
        const updatedGroupChat = await Chat.findByIdAndUpdate(chatId, { name, groupPhoto }, { new: true })

        return new Response(JSON.stringify(updatedGroupChat), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response("Could not update group chat", { status: 500 })
    }
}
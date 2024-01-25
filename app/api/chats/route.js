import { pusherServer } from "@lib/pusher";
import Chat from "@models/Chats";
import User from "@models/User";
import { connectDB } from "@mogodb"

export const POST = async (req) => {
    try {
        await connectDB()
        const body = await req.json()
        const { currentUserId, members, isGroup, name, groupPhoto } = body;

        //query to find a chat
        const query = isGroup ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] } : { members: { $all: [currentUserId, ...members], $size: 2 } }

        let chat = await Chat.findOne(query)

        if (!chat) {
            chat = await new Chat(
                isGroup ? query : { members: [currentUserId, ...members] },
            )
            await chat.save()

            const updateAllMembers = chat.members.map(async (memberId) => {
                await User.findByIdAndUpdate(
                    memberId,
                    {
                        $addToSet: { chats: chat._id },
                    },
                    { new: true }
                );
            })
            Promise.all(updateAllMembers);
            chat.members.map(async (member) => {
                await pusherServer.trigger(member._id.toString(), "new-chat", chat)
            })
        }
        return new Response(JSON.stringify(chat), { status: 201 })
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Could not create chat' }), { status: 500 })
    }
}
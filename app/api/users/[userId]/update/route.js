import User from "@models/User";
import { connectDB } from "@mogodb";

export const POST = async (req, { params }) => {
    try {
        await connectDB()

        const { userId } = params

        const body = await req.json()

        const { username, profileImage } = body;

        const updateduser = await User.findByIdAndUpdate(userId, { username, profileImage }, { new: true })
        return new Response(JSON.stringify(updateduser), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}
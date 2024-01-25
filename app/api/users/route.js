import User from "@models/User";
import { connectDB } from "@mogodb";

export const GET = async () => {
    try {
        await connectDB()

        const allUsers = await User.find()

        return new Response(JSON.stringify(allUsers), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}
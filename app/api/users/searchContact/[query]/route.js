import User from "@models/User";
import { connectDB } from "@mogodb";

export const GET = async (req, { params }) => {
    try {
        await connectDB()

        const { query } = params;
        const searchedContacts = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } }, //i in regex means it can search uppercase as well as lowercase
                { email: { $regex: query, $options: "i" } }
            ]
        })
        return new Response(JSON.stringify(searchedContacts));
    } catch (error) {
        console.log(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
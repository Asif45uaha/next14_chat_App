import User from "@models/User";
import { connectDB } from "@mogodb";
import bcrypt from 'bcryptjs'
export const POST = async (req, res) => {
    try {
        await connectDB()
        const body = await req.json()
        const { username, email, password } = body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return new Response("User already exists", { status: 400 })
        }
        const hashedpass = await bcrypt.hash(password, 10)

        const newUser = await User({ username, email, password: hashedpass })
        await newUser.save()
        return new Response(JSON.stringify(newUser), { status: 201 })
    } catch (error) {
        console.log(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
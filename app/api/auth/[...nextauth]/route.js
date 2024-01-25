import User from "@models/User"
import { connectDB } from "@mogodb"
import { compare } from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid Credentials")
                }

                await connectDB()

                const user = await User.findOne({ email: credentials.email })

                if (!user || !user.password) {
                    throw new Error("User Not Found")
                }

                const isMatch = await compare(credentials.password, user.password)
                if (!isMatch) {
                    throw new Error("Invalid Password")
                }

                return user
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session }) {
            const mongoUser = await User.findOne({ email: session.user.email })
            session.user.id = mongoUser._id.toString()

            session.user = { ...session.user, ...mongoUser._doc }
            return session
        }
    }
})

export { handler as GET, handler as POST }
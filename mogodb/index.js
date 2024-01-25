import mongoose from 'mongoose'


let isConnected = false


export const connectDB = async () => {
    if (isConnected) {
        console.log("DB is Already Connected!!");
        return
    }

    try {
        await mongoose.connect(process.env.MONGO_URL)
        isConnected = true
        console.log("DB Connected!!");
    } catch (error) {
        console.log("error in connecting DB", error);
    }
}
import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    members: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    messages: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
        default: []
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: ''
    },
    groupPhoto: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastMessage: {
        type: Date,
        default: Date.now()
    }
})

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)
export default Chat
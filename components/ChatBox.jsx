"use client"
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
const ChatBox = ({ chat, currUser, currentChatId }) => {
    const router = useRouter()
    const otherMembers = chat?.members?.filter((member) => member._id !== currUser?._id)
    const lastMessages = chat?.messages?.length > 0 && chat?.messages[chat?.messages?.length - 1]
    const seen = lastMessages?.seenBy?.find((member) => member?._id === currUser._id)
    return (
        <div className={`chat-box ${chat._id === currentChatId ? "bg-blue-2" : ""}`} onClick={() => router.push(`/chats/${chat._id}`)}>
            <div className="chat-info">
                {
                    chat?.isGroup ?
                        <img className="profilePhoto" src={chat?.groupPhoto || "/assets/group.png"} alt="error" />
                        :
                        <img className="profilePhoto" src={otherMembers[0].profilePhoto || '/assets/person.jpg'} alt="error" />
                }
                <div className="flex flex-col gap-1 ">
                    {
                        chat?.isGroup ?
                            <p className="text-base-bold">{chat?.name}</p>
                            :
                            <p className="text-base-bold">
                                {otherMembers[0]?.username}
                            </p>
                    }
                    {
                        !lastMessages && <p className="text-small-bold">
                            Started a Chat
                        </p>
                    }
                    {
                        lastMessages?.photo ? (
                            lastMessages?.sender?._id === currUser._id ? (
                                <p className="text-small-medium text-grey-3">
                                    You Sent a Photo
                                </p>
                            ) :
                                (
                                    <p className={`${seen ? "text-small-medium text-grey-3" : "text-small-bold"} `}>
                                        {lastMessages?.sender?.username} Received a Photo
                                    </p>
                                )
                        ) : (
                            <p className={`last-message ${seen ? "text-small-medium text-grey-3" : "text-small-bold"}`}>
                                {lastMessages?.text}
                            </p>
                        )
                    }
                </div>
            </div>
            <div>
                <p className="text-base-light text-grey-3">
                    {!lastMessages ? format(new Date(chat?.createdAt), "p") : format(new Date(chat?.lastMessage), "p")}
                </p>
            </div>
        </div>
    )
}
export default ChatBox
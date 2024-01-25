import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import Loader from "./Loader"
import Link from "next/link"
import { AddPhotoAlternate } from "@mui/icons-material"
import { CldUploadButton } from 'next-cloudinary'
import MessageBox from "./MessageBox"
import { pusherClient } from "@lib/pusher"
const ChatDetails = ({ chatId }) => {
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(true)
    const [chat, setChat] = useState({})
    const [otheMembers, setOtherMembers] = useState([])
    const { data: session } = useSession()
    const currUser = session?.user

    const getChatDetails = async () => {
        try {
            const res = await fetch(`/api/chats/${chatId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            setChat(data)
            setLoading(false)
            setOtherMembers(data?.members?.filter(member => member !== currUser._id))
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (currUser && chatId) {
            getChatDetails()
        }
    }, [currUser, chatId])

    const sendText = async () => {
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ text, chatId, currentUserId: currUser._id })
            })
            if (res.ok) { setText("") }

        } catch (error) {
            console.log(error);
        }
    }
    const sendPhoto = async (result) => {
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ chatId, currentUserId: currUser._id, photo: result?.info?.secure_url })
            })
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        pusherClient.subscribe(chatId)
        const handleMessage = async (newMessage) => {
            setChat((prevChat) => {
                return {
                    ...prevChat,
                    messages: [...prevChat.messages, newMessage]
                }
            })
        }
        pusherClient.bind("new-message", handleMessage)
        return () => {
            pusherClient.unsubscribe(chatId);
            pusherClient.unbind("new-message", handleMessage)
        }
    }, [chatId])

    const bottomRef = useRef(null)
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chat?.messages])
    return loading ? <Loader /> : (
        <div className="pb-20">
            <div className="chat-details">
                <div className="chat-header">
                    {chat?.isGroup ?
                        <>
                            <Link href={`/chats/${chatId}/group-info`}>
                                <img className="profilePhoto" src={chat?.groupPhoto || "/assets/group.png"} alt="" />
                            </Link>
                            <div className="text">
                                <p>{chat?.name}  &#160; &#183; &#160; {chat?.members?.length} members</p>
                            </div>
                        </>
                        :
                        <>
                            <img
                                src={otheMembers[0]?.profileImage || "/assets/person.jpg"}
                                alt="profile photo"
                                className="profilePhoto"
                            />
                            <div className="text">
                                <p>{otheMembers[0]?.username}</p>
                            </div>
                        </>
                    }
                </div>
                <div className="chat-body">
                    {chat?.messages?.map((msg, id) =>
                        <MessageBox message={msg} key={id} currUser={currUser} />
                    )}
                    <div ref={bottomRef}></div>
                </div>
                <div className="send-message">
                    <div className="prepare-message">
                        <CldUploadButton options={{ maxFiles: 1 }} onUpload={sendPhoto} uploadPreset="kk8uk4rv">
                            <AddPhotoAlternate sx={{ fontSize: "35px", color: "#737373", cursor: "pointer", "&:hover": { color: "red" }, }} />
                        </CldUploadButton>
                        <input
                            className="input-field"
                            required
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            type="text"
                            placeholder="write a message...." />
                    </div>
                    <div onClick={sendText}>
                        <img src="/assets/send.jpg" alt="send" className="send-icon" />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChatDetails
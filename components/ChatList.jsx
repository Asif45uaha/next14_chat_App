"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Loader from "./Loader"
import ChatBox from "./ChatBox"
import { pusherClient } from "@lib/pusher"

const ChatList = ({ currentChatId }) => {
    const [loading, setLoading] = useState(true)
    const [chats, setChats] = useState([])
    const { data: session } = useSession()
    const [search, setSearch] = useState("")
    const currUser = session?.user

    const getChats = async () => {
        try {
            const res = await fetch(search !== "" ? `/api/users/${currUser._id}/searchChat/${search}` : `/api/users/${currUser._id}`)
            const data = await res.json()
            setChats(data)
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currUser) {
            getChats()
        }

    }, [currUser, search])
    useEffect(() => {
        if (currUser) {
            pusherClient.subscribe(currUser._id)
            const handleChatUpdate = async (data) => {
                setChats((allChats) => allChats.map((chat) => {
                    if (chat._id === data.id) {
                        return { ...chat, messages: data.messages }
                    } else {
                        return chat
                    }
                }))
            }

            pusherClient.bind("update-chat", handleChatUpdate)
            pusherClient.bind("new-chat", (newChat) => {
                setChats((allChats) => [...allChats, newChat]);
            });
        }
        return () => {
            pusherClient.unsubscribe(currUser?._id)
            pusherClient.unbind("update-chat")

        }
    }, [currUser])

    return loading ? <Loader /> : (
        <div className="chat-list">
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="search chat ..."
                className="input-search"
            />
            <div className="chats">
                {
                    chats?.map((chat, id) => <ChatBox chat={chat} key={id} currUser={currUser} currentChatId={currentChatId} />
                    )}
            </div>
        </div>
    )
}
export default ChatList
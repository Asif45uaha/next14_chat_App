"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Loader from "./Loader"
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'
const Contacts = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [contacts, setContacts] = useState([])
    const [search, setSearch] = useState("")

    const { data: session } = useSession()
    const currUser = session?.user

    const getContacts = async () => {
        try {
            const res = await fetch(search !== "" ? `/api/users/searchContact/${search}` : '/api/users')
            const data = await res.json()
            setContacts(data.filter((contact) => contact._id !== currUser._id))
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currUser) {
            getContacts()
        }
    }, [currUser, search])

    //select contact

    const [selectedContacts, setSelectedContacts] = useState([])
    const isGroup = selectedContacts.length > 1

    const handleSelect = (contact) => {
        if (selectedContacts.includes(contact)) {
            selectedContacts((prev) => prev.filter((c) => c !== contact))
        }
        else {
            setSelectedContacts((prev) => [...prev, contact])
        }
    }
    const [name, setName] = useState("")

    const createChat = async () => {
        if (isGroup && !name) {
            toast.error("Please Enter chat name to proceed")
            return
        }
        try {
            const res = await fetch("/api/chats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    currentUserId: currUser._id,
                    members: selectedContacts.map((c) => c._id),
                    isGroup,
                    name
                })
            })

            const chat = await res.json()

            if (chat.error) {
                toast.error("error in creating chat")
                return
            }

            if (res.ok) {
                router.push(`/chats/${chat._id}`)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return loading ? <Loader /> : (
        <div className="create-chat-container">
            <input
                value={search}
                onChange={(ev) => setSearch(ev.target.value)}
                type="text"
                placeholder="Search contact ..."
                className="input-search" />
            <div className="contact-bar">
                <div className="contact-list">
                    <p className="text-body-bold">Select or Deselect</p>
                    {
                        contacts.map((user, id) => (
                            <div key={id} className="contact" onClick={() => handleSelect(user)}>
                                {
                                    selectedContacts.find((item) => item === user) ? <CheckCircle sx={{ color: "red" }} /> : <RadioButtonUnchecked />
                                }
                                <img src={user.profileImage || "/assets/person.jpg"} alt="profile" className="profilePhoto" />
                                <p className="text-base-bold">
                                    {user.username}
                                </p>
                            </div>
                        ))
                    }
                </div>
                <div className="create-chat">
                    {
                        isGroup && (
                            <>
                                <div className="flex flex-col gap-3">
                                    <p className="text-base-bold">Group Chat Name</p>
                                    <input
                                        placeholder="Enter Group Chat Name"
                                        className="input-group-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <p className="text-body-bold">Members</p>
                                    <div className="flex flex-wrap gap-3">
                                        {
                                            selectedContacts.map((contact, id) =>
                                                <p key={id} className="selected-contact">
                                                    {contact.username}
                                                </p>
                                            )
                                        }
                                    </div>
                                </div>
                            </>
                        )
                    }
                    <button className="btn" onClick={createChat}>Find or Start a new Chat</button>
                </div>
            </div>

        </div>


    )
}
export default Contacts
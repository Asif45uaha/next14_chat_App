"use client"
import { GroupOutlined } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import { CldUploadButton } from 'next-cloudinary'
import { useEffect, useState } from "react"
import Loader from "@components/Loader"
import { useParams, useRouter } from "next/navigation"
const GroupInfo = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [chat, setChat] = useState({})
    const { chatId } = useParams()
    const getChatDetails = async () => {
        try {
            const res = await fetch(`/api/chats/${chatId}`)
            const data = await res.json()
            setChat(data)
            setLoading(false)
            reset({
                name: data?.name,
                groupPhoto: data?.groupPhoto
            })
        } catch (error) {

        }
    }
    useEffect(() => {
        if (chatId) getChatDetails()
    }, [chatId])
    const { register, watch, reset, handleSubmit, setValue, formState: { error } } = useForm()
    const uploadPhoto = (result) => {
        setValue("groupPhoto", result?.info?.secure_url)
    }
    const updateGroupChat = async (data) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/chats/${chatId}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            setLoading(false)
            if (res.ok) {
                router.push(`/chats/${chatId}`)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return loading ? <Loader /> :
        (
            <div className="profile-page">
                <h1 className="text-heading3-bold">Edit Group Info</h1>
                <form className="edit-profile" onSubmit={handleSubmit(updateGroupChat)}>
                    <div className="input">
                        <input
                            {...register("name", {
                                required: "Group Chat name is required",
                            })}
                            type="text"
                            placeholder="Group Chat name"
                            className="input-field" />
                        <GroupOutlined sx={{ color: "#737373" }} />
                    </div>
                    {error?.name && (
                        <p className="text-red-500">{error.username.message}</p>
                    )}
                    <div className="flex items-center justify-between">
                        <img src={watch("groupPhoto") || "/assets/group.png"} alt="" className="w-40 h-40 rounded-full" />
                        <CldUploadButton options={{ maxFiles: 1 }} onUpload={uploadPhoto} uploadPreset="kk8uk4rv">
                            <p className="text-body-bold">upload new photo</p>
                        </CldUploadButton>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {
                            chat?.members?.map((member, id) => {
                                return (
                                    <p key={id} className="selected-contact">{member?.username}</p>
                                )
                            }
                            )
                        }
                    </div>
                    <button className="btn" type="submit">Save Changes</button>
                </form>
            </div>
        )
}
export default GroupInfo 
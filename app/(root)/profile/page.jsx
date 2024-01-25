"use client"
import { PersonOutline } from "@mui/icons-material"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { CldUploadButton } from 'next-cloudinary'
import { useEffect, useState } from "react"
import Loader from "@components/Loader"
const ProfilePage = () => {
    const { data: session } = useSession()
    const user = session?.user
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (user) {
            reset({
                username: user?.username,
                profileImage: user?.profileImage
            })
            setLoading(false)
        }
    }, [user])

    const { register, watch, reset, handleSubmit, setValue, formState: { error } } = useForm()
    const uploadPhoto = (result) => {
        setValue("profileImage", result?.info?.secure_url)
    }
    const updateUser = async (data) => {
        setLoading(true)
        try {
            await fetch(`/api/users/${user._id}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            setLoading(false)
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    }

    return loading ? <Loader /> :
        (
            <div className="profile-page">
                <h1 className="text-heading3-bold">Edit Your Profile</h1>
                <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
                    <div className="input">
                        <input
                            {...register("username", {
                                required: "Username is required",
                                validate: (value) => {
                                    if (value.length < 3) {
                                        return "Username must be at least 3 characters";
                                    }
                                },
                            })}
                            type="text"
                            placeholder="Username"
                            className="input-field" />
                        <PersonOutline sx={{ color: "#737373" }} />
                    </div>
                    {error?.username && (
                        <p className="text-red-500">{error.username.message}</p>
                    )}
                    <div className="flex items-center justify-between">
                        <img src={watch("profileImage") || user?.profileImage || "/assets/person.jpg"} alt="" className="w-40 h-40 rounded-full" />
                        <CldUploadButton options={{ maxFiles: 1 }} onUpload={uploadPhoto} uploadPreset="kk8uk4rv">
                            <p className="text-body-bold">upload new photo</p>
                        </CldUploadButton>
                    </div>
                    <button className="btn" type="submit">Save Changes</button>
                </form>
            </div>
        )
}
export default ProfilePage
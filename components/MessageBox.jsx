import { format } from "date-fns"

const MessageBox = ({ message, currUser }) => {
    return message?.sender?._id !== currUser._id ? (
        <div className="message-box">
            <img src={message?.sender?.profileImage || "/assets/person.jpg"} alt="error" className="message-profilePhoto" />
            <div className="message-info">
                <p className="text-small-bold">
                    {message?.sender?.username} &#160; &#183; &#160; {format(new Date(message.createdAt), "p")}
                </p>
                {
                    message?.text ? (
                        <p className="message-text">{message?.text}</p>
                    )
                        : (
                            <img src={message?.photo} alt="error" className="message-photo" />
                        )
                }
            </div>
        </div>
    ) : (
        <div className="message-box justify-end">
            <div className="message-info items-end">
                <p className="text-small-bold">
                    {format(new Date(message.createdAt), "p")}
                </p>
                {
                    message?.text ? (
                        <p className="message-text-sender">{message?.text}</p>
                    )
                        : (
                            <img src={message?.photo} alt="error" className="message-photo" />
                        )
                }
            </div>
        </div>
    )
}
export default MessageBox
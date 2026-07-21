import React , { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'
import useGetGroupMessages from "@/hooks/useGetGroupMessages";
import useGetGroupRTM from "@/hooks/useGetGroupRTM";

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    useGetGroupMessages();
    useGetGroupRTM();
    // const {messages} = useSelector(store=>store.chat);
    const { messages, groupMessages } =useSelector(store => store.chat);

    const currentMessages =
    selectedUser?.chatType === "group"
        ? groupMessages
        : messages;

    const {user} = useSelector(store=>store.auth);
    const bottomRef = useRef(null);
    useEffect(() => {
    bottomRef.current?.scrollIntoView({
        behavior: "smooth",
    });
    }, [currentMessages]);
    return (    
        <div className='overflow-y-auto flex-1 p-6'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2" variant="secondary">View profile</Button></Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {
                //    currentMessages && currentMessages.map((msg) => {
                //         return (
                //             <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                //                 <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                //                     {msg.message}
                //                 </div>
                //             </div>
                //         )
                //     })
                currentMessages && currentMessages.map((msg) => {

    const isMe =
        selectedUser?.chatType === "group"
            ? msg.sender?._id === user?._id
            : msg.senderId === user?._id;

    return (
        <div
            key={msg._id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
        >
            {/* <div
                className={`p-2 rounded-lg max-w-xs break-words ${
                    isMe
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                }`}
            >
                {msg.message}
            </div> */}
            <div
    className={`p-2 rounded-lg max-w-xs break-words ${
        isMe
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
    }`}
>

    {selectedUser?.chatType === "group" && !isMe && (
        <p className="text-sm font-bold text-green-500 mb-1">
            {msg.sender?.username}
        </p>
    )}

    {msg.message}

</div>
        </div>
    );
})
                }

            </div>
            <div ref={bottomRef}></div>
        </div>  
    )
}

export default Messages
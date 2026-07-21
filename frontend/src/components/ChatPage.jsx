import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import api from '@/lib/axios';
import { setMessages } from '@/redux/chatSlice';
// import { Phone } from "lucide-react";
// import VideoCallModal from "./VideoCallModal";
import useGetGroups from "@/hooks/useGetGroups";
import CreateGroupModal from "./CreateGroupModal";
import ViewGroupMembersModal from "./ViewGroupMembersModal";
import ModifyGroupModal from "./ModifyGroupModal";
import { toast } from "sonner";


const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  //  const { onlineUsers, messages } = useSelector(store => store.chat);
    const {onlineUsers,messages,groups} = useSelector(store => store.chat);
    const [openGroup, setOpenGroup] = useState(false);
    const [openMembers, setOpenMembers] = useState(false);
    const [openModifyGroup, setOpenModifyGroup] = useState(false);
    const dispatch = useDispatch();


    const [openCall, setOpenCall] =useState(false);
    const { socket } =useSelector(store => store.socketio);

    useEffect(() => {

    if (
        socket &&
        selectedUser?.chatType === "group"
    ) {
        socket.emit("join-group", selectedUser._id);

        console.log("JOINED GROUP:", selectedUser._id);
    }

}, [socket, selectedUser]);

    // const sendMessageHandler = async (receiverId) => {
    //     try {
    //         const res = await api.post(`/api/v1/message/send/${receiverId}`, { textMessage }, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //         });
    //         if (res.data.success) {
    //             dispatch(setMessages([...messages, res.data.newMessage]));
    //             setTextMessage("");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const sendMessageHandler = async () => {

    if (!textMessage.trim()) return;

    try {

        if (selectedUser?.chatType === "group") {

            console.log("Sending:", textMessage);

            const res = await api.post(
                `/api/v1/groupMessage/send/${selectedUser._id}`,
                { textMessage },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data.success) {
                setTextMessage("");
            }

        } else {

            const res = await api.post(
                `/api/v1/message/send/${selectedUser._id}`,
                { textMessage },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }

        }

    } catch (error) {
        console.log(error);
    }
};


    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    },[dispatch]);

    useGetGroups();


console.log("CHAT STATE:", {
    suggestedUsers,
    groups
});


const chatList = [
    ...((suggestedUsers || []).map(user => ({
        ...user,
        chatType: "user"
    }))),

    ...((groups || []).map(group => ({
        ...group,
        chatType: "group"
    })))
];

console.log({
    suggestedUsers,
    groups,
    chatList
});

console.log("SELECTED USER:", selectedUser);

    return (
        <div className='flex  h-screen'>
            <section className='w-full md:w-1/4 my-8'>
                <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                       (chatList || []).map((suggestedUser) => {
                            // const isOnline = onlineUsers.includes(suggestedUser?._id);
                            const isGroup =suggestedUser.chatType === "group";
                        
                            const isOnline =!isGroup &&onlineUsers.includes(suggestedUser._id);

                            return (
                                <div             
                                key={suggestedUser._id}

    
 onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                                    <Avatar className='w-14 h-14'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    
                                    {/* <div className='flex flex-col'>
                                        
                                        {suggestedUser.chatType === "group"
        ? suggestedUser.name
        : suggestedUser.username}
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
                                    </div> */}

                                    <div className='flex flex-col'>

    <span className="font-medium">
        {suggestedUser.chatType === "group"
            ? suggestedUser.name
            : suggestedUser.username}
    </span>

    {suggestedUser.chatType !== "group" && (
        <span
            className={`text-xs font-bold ${
                isOnline ? "text-green-600" : "text-red-600"
            }`}
        >
            {isOnline ? "online" : "offline"}
        </span>
    )}

</div>

                                </div>
                            )
                        })
                    }
                </div>
                <Button
className="w-full mt-3"
onClick={()=>setOpenGroup(true)}
>

+ New Group

</Button>


            </section>
            {
                selectedUser ? (
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage
    src={
        selectedUser?.chatType === "group"
            ? selectedUser?.image
            : selectedUser?.profilePicture
    }
    alt="profile"
/>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            {/* <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div> */}
                            <div className='flex flex-col'>
    <span className="font-medium">
        {selectedUser?.chatType === "group"
            ? selectedUser?.name
            : selectedUser?.username}
    </span>

    {selectedUser?.chatType === "group" && (
        <span className="text-md  text-gray-700">
            {selectedUser?.members?.length} members
        </span>
    )}
</div>
                            {/* <button
        onClick={() => setOpenCall(true)}
        className='ml-auto p-2 rounded-full hover:bg-gray-100'
    >
        <Phone size={22}/>
    </button> */}

    <div className="ml-auto flex items-center gap-2">

   
    {selectedUser?.chatType === "group" && (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenMembers(true)}
            >
                View Members
            </Button>

            <Button
                size="sm"
                onClick={() => setOpenModifyGroup(true)}
            >
                Modify Group
            </Button>
        </>
    )}


</div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)}  onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault();sendMessageHandler();}}} type="text" className='flex-1 mr-2 focus-visible:ring-transparent' placeholder="Messages..." />
                            {/* <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button> */}
                            <Button onClick={sendMessageHandler}>Send</Button>
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <MessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-medium'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
            {/* <VideoCallModal
            socket={socket}
            selectedUser={selectedUser}
            open={openCall}
            setOpen={setOpenCall}
        /> */}
        <CreateGroupModal
    open={openGroup}
    setOpen={setOpenGroup}
/>

<ViewGroupMembersModal
    open={openMembers}
    setOpen={setOpenMembers}
    group={selectedUser}
/>

<ModifyGroupModal
    open={openModifyGroup}
    setOpen={setOpenModifyGroup}
    group={selectedUser}
/>
        </div>
    )
}

export default ChatPage
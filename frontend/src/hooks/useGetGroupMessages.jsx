// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import api from "@/lib/axios";
// import { setGroupMessages } from "@/redux/chatSlice";

// const useGetGroupMessages = ()=>{

//     const dispatch=useDispatch();

//     // const {selectedGroup}
//     // =useSelector(store=>store.chat);
//     const { selectedUser } = useSelector(store => store.auth);


//     useEffect(()=>{

//         // if(!selectedGroup) return;
//         if (
//     !selectedUser ||
//     selectedUser.chatType !== "group"
// )
//     return;

//         const fetchMessages=
//         async()=>{

//             try{

//                 const res=
//                 await api.get(
//                     // `/api/v1/groupMessage/${selectedGroup._id}`
//                     `/api/v1/groupMessage/${selectedUser._id}`
//                 );

//                 if(res.data.success){

//                     dispatch(
//                         setGroupMessages(
//                             res.data.messages
//                         )
//                     );

//                 }

//             }

//             catch(err){

//                 console.log(err);

//             }

//         };

//         fetchMessages();

//     },[
//         selectedGroup,
//         dispatch
//     ]);

// };

// export default useGetGroupMessages;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axios";
import { setGroupMessages } from "@/redux/chatSlice";

const useGetGroupMessages = () => {

    const dispatch = useDispatch();

    const { selectedUser } = useSelector(store => store.auth);

    useEffect(() => {

        if (
            !selectedUser ||
            selectedUser.chatType !== "group"
        ) return;

        const fetchMessages = async () => {

            try {

                const res = await api.get(
                    `/api/v1/groupMessage/${selectedUser._id}`
                );

                if (res.data.success) {
                    dispatch(
                        setGroupMessages(res.data.messages)
                    );
                }

            } catch (err) {
                console.log(err);
            }

        };

        fetchMessages();

    }, [selectedUser, dispatch]);

};

export default useGetGroupMessages;
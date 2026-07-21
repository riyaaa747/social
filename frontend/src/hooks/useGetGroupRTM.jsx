import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGroupMessage } from "@/redux/chatSlice";

const useGetGroupRTM=()=>{

    const dispatch=useDispatch();

    const {socket}
    =useSelector(store=>store.socketio);

    useEffect(()=>{

        if(!socket) return;

        socket.on(
            "newGroupMessage",
            (message)=>{

                dispatch(
                    addGroupMessage(
                        message
                    )
                );

            }
        );

        return()=>{

            socket.off(
                "newGroupMessage"
            );

        };

    },[
        socket,
        dispatch
    ]);

};

export default useGetGroupRTM;
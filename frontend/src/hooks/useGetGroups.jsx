import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import { setGroups } from "@/redux/chatSlice";

const useGetGroups = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        const fetchGroups = async () => {

            try{

                const res =
                await api.get("/api/v1/group");

                if(res.data.success){

                    dispatch(
                        setGroups(
                            res.data.groups
                        )
                    );

                }

            }

            catch(err){

                console.log(err);

            }

        };

        fetchGroups();

    },[]);

};

export default useGetGroups;
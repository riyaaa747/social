import { useEffect } from "react";
import api from "@/lib/axios";
import { useDispatch } from "react-redux";
import { setFollowingUsers } from "@/redux/authSlice";

const useGetFollowingUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFollowingUsers = async () => {
            try {
                const res = await api.get("/api/v1/user/following");

                if (res.data.success) {
                    dispatch(setFollowingUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchFollowingUsers();
    }, [dispatch]);
};

export default useGetFollowingUsers;
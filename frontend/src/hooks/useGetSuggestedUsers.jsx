import { setSuggestedUsers ,setFollowingUsers} from "@/redux/authSlice";
import api from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await api.get('/api/v1/user/suggested');
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users));

                    const followingRes = await api.get("/api/v1/user/following");

                    if (followingRes.data.success) {
                    dispatch(setFollowingUsers(followingRes.data.users));
                }
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, [dispatch]);
};
export default useGetSuggestedUsers;
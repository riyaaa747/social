import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from 'react-redux';
import { setSuggestedUsers } from '@/redux/authSlice';



const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const followHandler = async (id) => {
        try {
            const res = await axios.post(
                `http://localhost:3000/api/v1/user/followorunfollow/${id}`,
                {},
                {
                    withCredentials: true,
                }
            );

            if(res.data.success){

                // remove followed user immediately
                const updatedUsers =
                    suggestedUsers.filter(user => user._id !== id);

                dispatch(setSuggestedUsers(updatedUsers));

                toast.success(res.data.message);
            }
        } catch(error){
            console.log(error);
        }
    };


    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers.map((user) => {
                    return (
                        <div key={user._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className=' text-md'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                           <span
    onClick={() => followHandler(user._id)}
    className='text-[#3BADF8] text-md font-bold cursor-pointer hover:text-[#3495d6]'
>
    Follow
</span>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SuggestedUsers
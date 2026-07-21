import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";


const ViewGroupMembersModal = ({ open, setOpen, group }) => 
{
const navigate = useNavigate();

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        {group?.name} Members
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    {group?.members?.map((member) => (

                        // <div
                        //     key={member._id}
                        //     className="flex items-center gap-3"
                        // >
                        <div
    key={member._id}
    onClick={() => {
        setOpen(false);
        navigate(`/profile/${member._id}`);
    }}
    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
>

    

                            <Avatar>

                                <AvatarImage
                                    src={member.profilePicture}
                                />

                                <AvatarFallback>
                                    {member.username[0]}
                                </AvatarFallback>

                            </Avatar>

                            <span>
                                {member.username}
                            </span>

                        </div>

                    ))}

                </div>

            </DialogContent>

        </Dialog>
    );
};

export default ViewGroupMembersModal;
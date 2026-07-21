import { useState } from "react";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect } from "react";
import { toast } from "sonner";

const ModifyGroupModal = ({ open, setOpen, group }) => {

    const { suggestedUsers } = useSelector(store => store.auth);

   const [name, setName] = useState("");
const [members, setMembers] = useState([]);

useEffect(() => {
    if (group) {
        setName(group.name);

        setMembers(
    group.members?.map(member => member._id) || []
);
    }
}, [group]);

    const toggleMember = (id) => {

        if (members.includes(id)) {

            setMembers(
                members.filter(x => x !== id)
            );

        } else {

            setMembers([...members, id]);

        }

    };

    const modifyGroup = async () => {

        if (!name.trim()) {
    alert("Group name is required");
    return;
}

        try {

            const res = await api.put(`/api/v1/group/${group._id}`, {
    name,
    members
});

            if (res.data.success) {

                toast.success("Group modified successfully!");

                setOpen(false);

                // setName("");

                // setMembers([]);

            }

        } catch (err) {

            toast.error("Failed to modify group. Please try again.");
            console.log(err);

        }

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-lg w-[420px]">

                <h1 className="text-2xl font-bold mb-5">
                    Modifiy Group
                </h1>

                <Input
                    placeholder="Group Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />

                <div className="mt-5 h-60 overflow-y-auto">

                    {
                        suggestedUsers.map(user=>(

                            <label
                                key={user._id}
                                className="flex items-center gap-3 mb-3 cursor-pointer"
                            >

                                <input
                                    type="checkbox"
                                    checked={members.includes(user._id)}
                                    onChange={()=>toggleMember(user._id)}
                                />

                                <span>

                                    {user.username}

                                </span>

                            </label>

                        ))
                    }

                </div>

                <div className="flex justify-end gap-3 mt-5">

                    <Button
                        variant="outline"
                        onClick={()=>setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={modifyGroup}
                    >
                        Save Changes
                    </Button>

                </div>

            </div>

        </div>

    );

};

export default ModifyGroupModal;
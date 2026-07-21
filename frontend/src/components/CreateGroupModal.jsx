import { useState } from "react";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect } from "react";
import { toast } from "sonner";

const CreateGroupModal = ({ open, setOpen }) => {

    const { suggestedUsers } = useSelector(store => store.auth);

    const [name, setName] = useState("");

    const [members, setMembers] = useState([]);

    const toggleMember = (id) => {

        if (members.includes(id)) {

            setMembers(
                members.filter(x => x !== id)
            );

        } else {

            setMembers([...members, id]);

        }

    };

    const createGroup = async () => {

        try {

            const res = await api.post(
                "/api/v1/group/create",
                {
                    name,
                    members
                }
            );

            if (res.data.success) {

                toast.success("Group created successfully!");

                setOpen(false);

                setName("");

                setMembers([]);

            }

        } catch (err) {

            toast.error("Failed to create group. Please try again.");
            console.log(err);

        }

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-lg w-[420px]">

                <h1 className="text-2xl font-bold mb-5">
                    Create Group
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
                        onClick={createGroup}
                    >
                        Create
                    </Button>

                </div>

            </div>

        </div>

    );

};

export default CreateGroupModal;
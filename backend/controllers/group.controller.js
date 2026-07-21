import { Group } from "../models/group.model.js";

export const createGroup = async (req, res) => {
    try {

        const { name, members } = req.body;

        if (!name || !members || members.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            });
        }

        const uniqueMembers = [...new Set([req.id, ...members])];

        const group = await Group.create({
            name,
            admin: req.id,
            members: uniqueMembers
        });

        return res.status(201).json({
            success: true,
            group
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false
        });

    }
};

export const getGroups = async (req, res) => {

    try {

        const groups = await Group.find({
            members: req.id
        })
        .populate("admin", "username profilePicture")
        .populate("members", "username profilePicture");

        return res.json({
            success: true,
            groups
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });

    }

};


export const updateGroup = async (req, res) => {
    try {

        const { name, members } = req.body;

        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        group.name = name;
        group.members = members;

        await group.save();

        return res.status(200).json({
            success: true,
            group
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false
        });

    }
};
import { GroupMessage } from "../models/groupMessage.model.js";
import { io } from "../socket/socket.js";

export const sendGroupMessage = async (req,res)=>{
     console.log("GROUP MESSAGE CONTROLLER HIT");

    try{

        const groupId=req.params.id;

        const {textMessage}=req.body;
        if (!textMessage?.trim()) 
        {
        return res.status(400).json({
        success: false,
        message: "Message cannot be empty"
        });
        }

        // const message=await GroupMessage.create({

        //     groupId,

        //     senderId:req.id,

        //     message:textMessage

        // });

        console.log("BODY:", req.body);
        console.log("TEXT:", textMessage);

        const message = await GroupMessage.create({
        group: groupId,
        sender: req.id,
        message: textMessage,
    });

        // io.to(groupId).emit(
        //     "newGroupMessage",
        //     message
        // );
        const populatedMessage = await GroupMessage.findById(message._id)
        .populate("sender", "username profilePicture");

        io.to(groupId).emit("newGroupMessage", populatedMessage);

    return res.status(201).json({
    success: true,
    message: populatedMessage,
    });
//
        return res.status(201).json({

            success:true,

            message

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false

        });

    }

};

export const getGroupMessages = async(req,res)=>{

    try{

        const groupId=req.params.id;

        // const messages=await GroupMessage.find({

        //     groupId

        // })
        const messages = await GroupMessage.find({
        group: groupId
        })
        // .populate("senderId","username profilePicture");
        .populate("sender", "username profilePicture");
        return res.json({

            success:true,

            messages

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false

        });

    }

};
import {Server} from "socket.io";
import express from "express";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:process.env.URL,
        methods:['GET','POST'],
        credentials:true
    }
})

const userSocketMap = {} ; // this map stores socket id corresponding the user id; userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// io.on('connection', (socket)=>{
//     const userId = socket.handshake.query.userId;
//     if(userId){
//         userSocketMap[userId] = socket.id;
//     }

//     io.emit('getOnlineUsers', Object.keys(userSocketMap));

//     socket.on('disconnect',()=>{
//         if(userId){
//             delete userSocketMap[userId];
//         }
//         io.emit('getOnlineUsers', Object.keys(userSocketMap));
//     });
// })

io.on('connection', (socket) => {
    console.log("SOCKET CONNECTED");
    console.log("USER ID:", socket.handshake.query.userId);

    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
//these two line added

console.log("userSocketMap:", userSocketMap);

io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    //video
//     socket.on("call-user", ({to, offer}) => {
//     const receiverSocket =
//         userSocketMap[to];

//     if(receiverSocket){
//         io.to(receiverSocket).emit(
//             "incoming-call",
//             {
//                 from:userId,
//                 offer
//             }
//         );
//     }
// });



socket.on("join-group",(groupId)=>{

    socket.join(groupId);

});

// socket.on("answer-call", ({to, answer}) => {
//     const receiverSocket =
//         userSocketMap[to];

//     if(receiverSocket){
//         io.to(receiverSocket).emit(
//             "call-answered",
//             {
//                 answer
//             }
//         );
//     }
// });

// socket.on("ice-candidate", ({to, candidate}) => {
//     const receiverSocket =
//         userSocketMap[to];

//     if(receiverSocket){
//         io.to(receiverSocket).emit(
//             "ice-candidate",
//             {
//                 candidate
//             }
//         );
//     }
// });

///


    socket.on('disconnect', () => {
        console.log("SOCKET DISCONNECTED");

        if (userId) {
            delete userSocketMap[userId];
        }

        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});


export {app, server, io};
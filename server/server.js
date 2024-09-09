import { Server } from 'socket.io';
import { createServer } from 'http'
import express, { urlencoded, json } from 'express';
import cors from 'cors';
import { generateUniqueRoomId } from './utils.js';

const HTTP_SERVER_PORT = 4500, SOCKET_IO_SERVER_PORT = 5000;

const app = express();
const io = new Server(SOCKET_IO_SERVER_PORT,{
    cors: true
});

app.use(cors());
app.use(urlencoded({ extended:true }))
app.use(json());

const roomToSocketIdMap = new Map();
const socketIdToRoomMap = new Map();
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on('connection',(socket)=>{
    console.log("User Connected", socket.id)

    socket.on("room:join",(data)=>{
        const { email, roomId } = data;
        socket.join(roomId);
        if(roomToSocketIdMap.has(roomId)) roomToSocketIdMap.get(roomId).push(socket.id);
        socketIdToRoomMap.set(socket.id, roomId);
        socketIdToEmailMap.set(socket.id, email);
        emailToSocketIdMap.set(email, socket.id);
        io.to(roomId).emit("new-user-update",roomToSocketIdMap.get(roomId)); 
    })

    socket.on("user:call",({ to, offer })=>{
        io.to(to).emit("incoming:call", { from: socket.id, offer });
    })

    socket.on("call:accepted",({to, answer})=>{
        io.to(to).emit("call:accepted",{ from:socket.id, answer });
    })

    socket.on("nego:needed",({to, offer})=>{
        io.to(to).emit("nego:request",{ from: socket.id, offer });
    })

    socket.on("nego:complete",({to, answer})=>{
        io.to(to).emit("nego:complete:answer",{ from: socket.id, answer });
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected ",socket.id)
        const email = socketIdToEmailMap.get(socket.id);
        const roomId = socketIdToRoomMap.get(socket.id);
        socketIdToEmailMap.delete(socket.id);
        socketIdToRoomMap.delete(socket.id);
        emailToSocketIdMap.delete(email);
        const participantsArray = roomToSocketIdMap.get(roomId) || [];
        const newParticipantsArray = participantsArray.filter( participant => participant !== socket.id ) || [];
        roomToSocketIdMap.set(roomId, newParticipantsArray);    
        io.to(roomId).emit("new-user-update",roomToSocketIdMap.get(roomId));
    })

})

app.get('/room/create',(req,res)=>{
    let roomId = generateUniqueRoomId(roomToSocketIdMap);
    roomToSocketIdMap.set(roomId, []);
    return res.send(roomId);
})

app.post('/room/isValid',(req,res)=>{
    const { roomId } = req.body;
    if( !roomId ) return res.status(400).send({ message: "Invalid Room Id" });
    return res.send({ isValid: roomToSocketIdMap.has(roomId) });
})

app.listen(HTTP_SERVER_PORT, ()=> console.log("HTTP Server Listening on Port",HTTP_SERVER_PORT));
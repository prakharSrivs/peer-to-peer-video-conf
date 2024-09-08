const {Server} = require('socket.io');

const io = new Server({
    cors: true
});

const HTTP_SERVER_PORT = 4500, SOCKET_IO_SERVER_PORT = 5000;
const emailToSocketId = new Map();
const socketIdToEmail = new Map();

io.on('connection',(socket)=>{
    console.log("Device Connected to IO Server Socket Id - ",socket.id)

    socket.on("room:join",(data)=>{
        emailToSocketId.set(data.email, socket.id);
        socketIdToEmail.set(socket.id, data.email);
        socket.join(data.room);
        io.to(room).emit("room:joined", data);
    })

})


io.listen(SOCKET_IO_SERVER_PORT, ()=> console.log("IO Server Listening on Port ",SOCKET_IO_SERVER_PORT));
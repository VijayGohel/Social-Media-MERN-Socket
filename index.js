const io = require("socket.io")(8800, {
    cors: {
        origin: "http://localhost:3000"
    }
})

let activeUsers = [];

io.on("connection", (socket)=>{

    //add new User
    socket.on("new-user-add", (newUserId)=>{
        if(!activeUsers.find((user)=>user.userId==newUserId))
        {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        console.log("User Connected ", activeUsers);
        io.emit("get-users", activeUsers);
    })

    //send message
    socket.on("send-message", (data)=>{
        const {receiverId} = data;
        const user = activeUsers.find((user)=>user.userId==receiverId);
        console.log("Sending message to: ", receiverId);
        console.log("Message: ", data.message);
        if(user)
            io.to(user.socketId).emit("receive-message", data.message);
    })

    //user disconnect
    socket.on("disconnect", ()=>{
        activeUsers = activeUsers.filter((user)=>user.socketId!=socket.id)
        console.log("User disconnected", activeUsers);
        io.emit("get-users", activeUsers);
    })
})
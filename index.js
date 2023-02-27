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

    //disconnect socket
    socket.on("disconnect", ()=>{
        activeUsers = activeUsers.filter((user)=>user.socketId!=socket.id)
        console.log("Socket closed ", activeUsers);
        io.emit("get-users", activeUsers);
    })
})
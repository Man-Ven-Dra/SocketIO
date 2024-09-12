import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("User Connected Successfully!: ", socket.id);
    
    socket.on("joinRoom", (room) => {
        socket.join(room);
    });

    socket.on("message", ({message, room, file}) => {
        console.log("File: ",file);
        if(file !== ""){
            socket.to(room).emit("sendMessage", file);
        }
        else{
            socket.to(room).emit("sendMessage", message);
        }
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
})

const port = 3000;

server.listen(port, () => {
    console.log(`Server is listening at Port: ${port}`)
})
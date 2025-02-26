import express from "express";
import socket from "socket.io";
import http from "http";
import path from "path";

const app = express();
const port: number = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.render("index");
});

const server = http.createServer(app);

const io = new socket.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("disconnect", () => {
        console.log("User disconnected");
        io.emit("user-disconnected",socket.id);
    });
    socket.on("sendLocation",(obj)=>{
        obj.id=socket.id;
        console.log(obj);
        io.emit("receiveLocation",obj);
    
    }); 

});



server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

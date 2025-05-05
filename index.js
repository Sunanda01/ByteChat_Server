const express = require("express");
const cors = require("cors");
const PORT = require("./config/config").PORT;
const authRoutes = require("./routes/authRoutes");
const db_connection = require("./utils/db_connection");
const HealthCheckController = require("./controller/health_check");
const errorHandler = require("./middleware/errorHandler");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/userModel");
const {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
} = require("./controller/messageController");
const Message = require("./models/messageModel");
const FRONTEND_URL = require("./config/config").FRONTEND_URL;
const rooms = ["general", "tech", "finance", "crypto"];
const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log(`User Connected with SocketId ${socket.id}`);
  socket.on("newUser", async () => {
    const members = await User.find();
    io.emit("newUser", members);
  });

  socket.on("join-room", async (newRoom, oldRoom) => {
    socket.join(newRoom);
    socket.leave(oldRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await Message.create({
      to: room,
      content,
      from: sender,
      time,
      date,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });

  socket.on("disconnect", () => {
    // console.log(`User Disconnected with SocketId ${socket.id}`);
  });

  app.post("/auth/logout", async (req, res) => {
    const { id, newMessages } = req.body;
    try {
      const user = await User.findById(id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      io.emit("newUser", members);
      return res.status(200).json({
        success: true,
        msg: "Loggout Successfull",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        msg: "Failed to Loggout",
      });
    }
  });
});

app.use("/auth", authRoutes);
app.get("/health-check", HealthCheckController.HealthCheck);
app.get("/room", (req, res) => {
  res.json(rooms);
});
app.use(errorHandler);
server.listen(PORT, async () => {
  console.log(`Connected @ PORT ${PORT}`);
  await db_connection();
});

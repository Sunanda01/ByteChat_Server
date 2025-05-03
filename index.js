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
  console.log(`User Connected with SocketId ${socket.id}`);
  socket.on("newUser", async () => {
    const member = await User.find();
    io.emit("newUser", member);
  });

  socket.on("disconnect",()=>{
    console.log(`User Disconnected with SocketId ${socket.id}`)
  })
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

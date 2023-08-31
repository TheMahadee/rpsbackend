const express = require("express");
const http = require("http");
//const cors = require("cors");
const socketIO = require("socket.io");
const path = require("path");
const { getWinner } = require("./src/helpers/rpsGame");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    "Access-Control-Allow-Origin": "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});
const { JsonDB, Config } = require("node-json-db");

const port = process.env.PORT || 3000;

// Middleware to serve static files from the "public" folder

app.use(express.static(path.join(__dirname, "src/public")));

//To fetch json body
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

//DB connection
const dbPath = path.join(__dirname, "src/db/db.json");
const db = new JsonDB(new Config(dbPath, true, false, "/"));

//Server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Socket.io connection handler
io.on("connection", (socket) => {
  const s_user_id = socket.handshake.query.user_id;
  console.log(`New user connected: ${s_user_id}`);

  //Join room
  socket.on("joinRoom", async (room) => {
    const skts = await io.in(room).fetchSockets();
    const sktsIds = skts.map((skt) => skt.id);
    if (sktsIds.length >= 2) {
      socket.emit("roomFull");
    } else {
      socket.join(room);
      console.log(`User with ID: ${s_user_id} joined room: ${room}`);
    }
  });

  //DB emit
  socket.on("choose", async (params) => {
    await db.push(`/${params.room}/${s_user_id}`, {
      user_id: s_user_id,
      room: params.room,
      name: params.usr,
      choice: params.choice,
    });

    const choice = await db.getData(`/${params.room}`);
    const skts = await io.in(params.room).fetchSockets();
    const sktsIds = skts.map((skt) => skt.handshake.query.user_id);
    const p1 = choice[sktsIds[0]];
    const p2 = choice[sktsIds[1]];

    if (p1 !== undefined && p2 !== undefined) {
      const result = getWinner(p1, p2);
      console.log(result);
      io.in(params.room).emit("result", result.msg);
      await db.delete(`/${params.room}`);
    }
  });

  // Event handler for disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${s_user_id}`);
  });
});

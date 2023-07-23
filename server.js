const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { JsonDB, Config } = require("node-json-db");

const port = process.env.PORT || 3000;

// Middleware to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "src/public")));

//DB connection
const dbPath = path.join(__dirname, "src/db/db.json");
const db = new JsonDB(new Config(dbPath, true, false, "/"));

//Server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  let p1, p2;

  // Event handler for player's choice
  socket.on("choice", (choice) => {
    playerChoice.push(choice);
    console.log(playerChoice);
    if (playerChoice.length === 2) {
      p1 = playerChoice[0];
      p2 = playerChoice[1];

      const result = getWinner(p1, p2);

      // Emit the result to both players
      io.emit("result", {
        p1,
        p2,
        result,
      });
      playerChoice = [];
    }
  });

  //Join room
  socket.on("joinRoom", async (room) => {
    const skts = await io.in(room).fetchSockets();
    const sktsIds = skts.map((skt) => skt.id);
    if (sktsIds.length >= 2) {
      socket.emit("roomFull");
    } else {
      socket.join(room);
      console.log(`User with ID: ${socket.id} joined room: ${room}`);
    }
  });

  //DB emit
  socket.on("choose", async (params) => {
    await db.push(`/${params.room}/${socket.id}`, {
      name: params.usr,
      msg: params.msg,
    });

    const choice = await db.getData(`/${params.room}`);
    const skts = await io.in(params.room).fetchSockets();
    const sktsIds = skts.map((skt) => skt.id);
    const p1 = choice[sktsIds[0]];
    const p2 = choice[sktsIds[1]];

    if (p1 !== undefined && p2 !== undefined) {
      console.log(`success\nplayer 1 ${p1}\nplayer 2 ${p2}`);
    } else {
      console.log(`fail\nplayer 1 ${p1}\nplayer 2 ${p2}`);
    }
  });

  // Event handler for disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

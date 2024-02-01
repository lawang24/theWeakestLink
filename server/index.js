import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import {
  process_move_handler,
  join_room_handler,
  create_room_handler,
  disconnection_handler,
  set_time_format_handler,
} from "./server_handlers.js";
import {
  room_is_valid_handler,
  change_team_handler,
  start_game_handler,
  stop_game_handler,
} from "./server_handlers.js";

const port = 3001;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User Connected: " + socket.id);

  process_move_handler(io, socket, rooms);

  join_room_handler(io, socket, rooms);

  create_room_handler(io, socket, rooms);

  room_is_valid_handler(socket, rooms);

  change_team_handler(io, socket, rooms);

  start_game_handler(io, socket, rooms);

  stop_game_handler(io, socket, rooms);

  disconnection_handler(io, socket, rooms);

  set_time_format_handler(io, socket, rooms);
});

server.listen(process.env.PORT || port, () => {
  console.log(`server is on port ${port}`);
});

import { newPlayer, chooseWeakest, turnIsOver, makeid, deletePlayer } from "./helpers.js";
import express from 'express';
import cors from 'cors';
import http from "http";
import { Server } from 'socket.io';
import {process_move, join_room_handler, create_room_handler,  disconnection_handler} from './server_listeners.js';
import { room_isvalid_handler, change_team_handler, start_game_handler } from "./server_listeners.js";

const port = 3001;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// setting up game stuff
const rooms = new Map();

// emits to client that a team has run out of time
const time_out = (io, roomCode) => {
    io.to(roomCode).emit("time_out");
}

io.on("connection", (socket) => {

    console.log('User Connected: ' + socket.id);

    process_move(io, socket, rooms); 
    join_room_handler(io, socket, rooms);
    create_room_handler(io, socket, rooms);
    room_isvalid_handler(socket, rooms);
    change_team_handler(io, socket, rooms);
    start_game_handler(io, socket, rooms);
    disconnection_handler(io, socket, rooms);

});


server.listen(process.env.PORT || port, () => {
    console.log(`server is on port ${port}`)
});


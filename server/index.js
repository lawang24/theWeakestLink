import express from 'express';
import cors from 'cors';
import http from "http";
import { Server } from 'socket.io';
import { process_move, join_room_handler, create_room_handler, disconnection_handler } from './server_listeners.js';
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

/* Player object tracks the latest move's stockfish score (move_rating), 
   position of that move (move_fen), and the count of times their move was played (scorecard). */
export const Player = () => {
    this.move_rating = 0;
    this.move_fen = "";
    this.scorecard = 0;
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


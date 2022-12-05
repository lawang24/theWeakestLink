
// setting up the server
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
app.use(cors());
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

// setting up the chess game
const {Chess} = require ('chess.js');
const game = new Chess();

io.on("connection", (socket) => {
    console.log('User Connected: ' + socket.id);
    socket.on("move", (onDrop) => {
        const isValid = game.move({ from: onDrop.sourceSquare, to: onDrop.targetSquare });
        let newPosition = isValid ? game.fen() : null;
        io.emit("receive_move", newPosition);
    });
});

server.listen(3001, () => {
    console.log("server is running")
});



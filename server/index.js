// setting up the server
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);

const rooms = new Map();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});


io.on("connection", (socket) => {
    console.log('User Connected: ' + socket.id);

    socket.on("player_move", ({ rating, position, roomCode }) => {
        let thisRoom = rooms.get(roomCode);
        thisRoom.moves.push({ rating, position });
        console.log(thisRoom.moves);
        if (thisRoom.numberPlayers != 0 && thisRoom.moves.length == thisRoom.numberPlayers) {
            let weakest = chooseWeakest(thisRoom.moves);
            io.to(roomCode).emit("weakest_position", weakest);
            turnIsOver(thisRoom);
            console.log(thisRoom.whiteTurn);
            io.to(roomCode).emit("nextTurn", thisRoom.whiteTurn);
        }
    });

    socket.on("join_room", (data) => {
        if (rooms.has(data)) {
            socket.join(data);
            console.log("joined room " + data);
            socket.emit("room_joined", data);
        }
        else {
            socket.emit("no_room");
        };
    });

    socket.on("create_room", () => {
        createRoom(socket);
    });

});

function chooseWeakest(moves) {
    let index = 0;
    let champ = moves[0].rating;
    for (let i = 1; i < moves.length; i++) {
        if (moves[i].rating < champ) {
            champ = moves[i].rating;
            index = i;
        }
        return moves[index].position;
    }
}

function turnIsOver(thisRoom) {
    thisRoom.moves = [];
    thisRoom.whiteTurn = !thisRoom.whiteTurn;
    console.log(thisRoom.whiteTurn);
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function createRoom(socket) {
    let roomCode = makeid(4);
    rooms.set(roomCode, { numberPlayers: 2, moves: [], whiteTurn: true });
    socket.join(roomCode); // figure out how to create a random four letter code
    io.to(roomCode).emit("room_code", roomCode);
}

server.listen(3001, () => {
    console.log("server is running")
});




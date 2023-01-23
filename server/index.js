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

function addPlayer(roomCode, username) {
    const thisRoom = rooms.get(roomCode);
    const team = thisRoom.players[0].length > thisRoom.players[1].length ? 1 : 0;
    thisRoom.players[team].push(username);
    console.log(`${username} has joined room ${roomCode}`);
    console.log(thisRoom);
}
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

io.on("connection", (socket) => {
    console.log('User Connected: ' + socket.id);

    socket.on("player_move", ({ rating, position, roomCode }) => {
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

    socket.on("join_room", (roomCode, username) => {
        socket.join(roomCode);
        addPlayer(roomCode, username);
        socket.emit("room_joined", roomCode);
    });

    socket.on("create_room", (username) => {
        let roomCode = makeid(4);
        while (rooms.has(roomCode)) {
            roomCode = makeid(4);
        };
        rooms.set(roomCode, { players: [[], []], moves: [], whiteTurn: true }); // players[0] = white players
        socket.join(roomCode); 
        addPlayer(roomCode,username) 
        socket.emit("room_joined", roomCode);
    });

    socket.on("is_room_valid?",(roomCode)=>{
        rooms.has(roomCode) ? socket.emit("yes_room") : socket.emit("no_room");
    });
}
);

server.listen(3001, () => {
    console.log("server is running")
});




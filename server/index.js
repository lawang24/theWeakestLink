// setting up the server
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);

const rooms = new Map();
// rooms.set(roomCode, { players: [[], []], moves: [], whiteTurn: true }); 
// players[0] = white players

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

function newPlayer(roomCode, username) {
    let isWhite;
    const thisRoom = rooms.get(roomCode);
    console.log(`${username} has joined room ${roomCode}`)
    if (thisRoom.players[0].length <= thisRoom.players[1].length) {
        thisRoom.players[0].push(username);
        isWhite = true;
    }
    else {
        thisRoom.players[1].push(username);
        isWhite = false;
    }
    console.log(thisRoom);
    return isWhite;
}
function chooseWeakest(moves) {
    let index = 0;
    let champ = moves[0].rating;
    for (let i = 0; i < moves.length; i++) {
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
    console.log(`status of white's turn: ${thisRoom.whiteTurn}`);
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
function deletePlayer(isWhite, roomCode, username) {
    const oldTeam = isWhite ? 0 : 1;
    const teams = rooms.get(roomCode).players;
    for (let i = 0; i < teams[oldTeam].length; i++) {
        if (username === teams[oldTeam][i]) teams[oldTeam].splice(i, 1);
    };
}


io.on("connection", (socket) => {
    console.log('User Connected: ' + socket.id);

    socket.on("send_rating", (rating, position, roomCode, isWhite) => {
        const thisRoom = rooms.get(roomCode);
        thisRoom.moves.push({ rating, position });
        console.log(thisRoom.moves);
        const teamLength = isWhite ? thisRoom.players[0].length : thisRoom.players[1].length;
        if (teamLength && teamLength === thisRoom.moves.length) {
            let weakest = chooseWeakest(thisRoom.moves);
            io.to(roomCode).emit("weakest_position", weakest);
            turnIsOver(thisRoom);
            io.to(roomCode).emit("nextTurn", thisRoom.whiteTurn);
        }
    });

    socket.on("join_room", (roomCode, username) => {
        socket.join(roomCode);
        const isWhite = newPlayer(roomCode, username);
        socket.emit("room_joined", roomCode, isWhite);
        io.to(roomCode).emit("update_players", JSON.stringify(rooms.get(roomCode).players))
    });

    socket.on("create_room", (username) => {
        const isWhite = true;
        let roomCode = makeid(4);
        while (rooms.has(roomCode)) {
            roomCode = makeid(4);
        };
        rooms.set(roomCode, { players: [[], []], moves: [], whiteTurn: true }); // players[0] = white players
        socket.join(roomCode);
        newPlayer(roomCode, username)
        socket.emit("room_joined", roomCode, isWhite);
        io.to(roomCode).emit("update_players", JSON.stringify(rooms.get(roomCode).players))
    });

    socket.on("is_room_valid?", (roomCode) => {
        rooms.has(roomCode) ? socket.emit("yes_room") : socket.emit("no_room");
    });

    socket.on("change_team", (isWhite, roomCode, username) => {

        // delete player off the old team
        deletePlayer(isWhite, roomCode, username);

        // in on the new team
        const teams = rooms.get(roomCode).players;
        const newTeam = isWhite ? 1 : 0;
        teams[newTeam].push(username);
        console.log(rooms.get(roomCode).players);
        console.log(`the teams are ${JSON.stringify(teams)}`)
        io.to(roomCode).emit("update_players", JSON.stringify(teams));
    });

    socket.on("start_game", (roomCode) => {
        io.to(roomCode).emit("begin_game");
    });

});

server.listen(3001, () => {
    console.log("server is running")
});




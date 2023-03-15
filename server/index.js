//importing helper functions
import { newPlayer, chooseWeakest, turnIsOver, makeid, deletePlayer } from "./helpers.js";
import Timer from "./timer.js";

const port = 3001;

// setting up the server
import express from 'express';
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from 'socket.io';



// import cors from "cors";
// app.use(cors());

import path from 'path';
app.use(express.static(path.join(__dirname,'..','client','build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','client','build','index.html'));
})


// setting up game stuff
const rooms = new Map();

const io = new Server(server, {
    // cors: {
    //     origin: "http://localhost:3000",
    //     methods: ["GET", "POST"],
    // }
});

const time_out = (io, roomCode) => {
    io.to(roomCode).emit("time_out");
}

io.on("connection", (socket) => {
    console.log('User Connected: ' + socket.id);

    socket.on("send_rating", (rating, position, roomCode, isWhite, username) => {
        const team = isWhite ? 0 : 1;
        const thisRoom = rooms.get(roomCode);

        // enters the player's move into move array (for calculation of weakest)
        thisRoom.moves.push({ rating, position });
        console.log("moves: " + JSON.stringify(thisRoom.moves));

        // enters the rating into rating array for display of ratings
        const index = thisRoom.players[team].indexOf(username);
        thisRoom.ratings[index] = rating;
        console.log("ratings: " + JSON.stringify(thisRoom.ratings));


        const teamLength = thisRoom.players[team].length;

        if (teamLength && teamLength === thisRoom.moves.length) {
            const position_and_index = chooseWeakest(thisRoom.moves);
            const weakest = position_and_index[0];
            const index = position_and_index[1];

            console.log(`weakest: ${weakest}`);
            // clears moves array, flips whiteTurn, updates scorecard
            turnIsOver(thisRoom, team, index);
            io.to(roomCode).emit("nextTurn", weakest, thisRoom.whiteTurn, thisRoom.ratings, thisRoom.scorecard);

            // starts the timer 
            thisRoom.timer.nextTurn(thisRoom.whiteTurn, time_out, io, roomCode);
        }
    });

    socket.on("join_room", (roomCode, username) => {
        socket.join(roomCode);
        const thisRoom = rooms.get(roomCode);
        const isWhite = newPlayer(thisRoom, username);
        socket.emit("room_joined", roomCode, isWhite);
        io.to(roomCode).emit("update_players", JSON.stringify(thisRoom.players))
    });

    socket.on("create_room", (username) => {
        const isWhite = true;
        let roomCode = makeid(4);
        while (rooms.has(roomCode)) {
            roomCode = makeid(4);
        };

        rooms.set(roomCode, { players: [[], []], scorecard: [], moves: [], whiteTurn: true, timer: new Timer([600, 600]), ratings: [] });
        socket.join(roomCode);
        const thisRoom = rooms.get(roomCode);
        newPlayer(thisRoom, username);
        socket.emit("room_joined", roomCode, isWhite);
        io.to(roomCode).emit("update_players", JSON.stringify(rooms.get(roomCode).players))
    });

    socket.on("is_room_valid?", (roomCode) => {
        rooms.has(roomCode) ? socket.emit("yes_room") : socket.emit("no_room");
    });

    socket.on("change_team", (isWhite, roomCode, username) => {

        // delete player off the old team
        const teams = rooms.get(roomCode).players;
        deletePlayer(isWhite, teams, username);

        // in on the new team
        const newTeam = isWhite ? 1 : 0;
        teams[newTeam].push(username);
        console.log(rooms.get(roomCode).players);
        console.log(`the teams are ${JSON.stringify(teams)}`)
        io.to(roomCode).emit("update_players", JSON.stringify(teams));
    });

    socket.on("start_game", (roomCode) => {
        const thisRoom = rooms.get(roomCode);

        // create the scorecards
        thisRoom.scorecard = [];
        thisRoom.ratings = [];
        thisRoom.scorecard.push(new Array(thisRoom.players[0].length).fill(0));
        thisRoom.scorecard.push(new Array(thisRoom.players[1].length).fill(0));
        thisRoom.timer.setTimer([600, 600]);
        thisRoom.timer.startTimer(time_out, io, roomCode);
        console.log(thisRoom);
        io.to(roomCode).emit("begin_game", JSON.stringify(thisRoom.scorecard));

    });

    socket.on("disconnecting", () => {
        const roomCode = Array.from(socket.rooms).pop();
        const playerCount = (io.sockets.adapter.rooms.get(roomCode).size); // number of players in room

        // free memory if everybody gone
        if (playerCount == 1) {
            rooms.get(roomCode).timer.stopTimer(); // stop all timers etc
            rooms.delete(roomCode);
        };
    });


});

server.listen(process.env.PORT || port, () => {
    console.log(`server is on port ${port}`)
});




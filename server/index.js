// setting up the server
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
app.use(cors());
const server = http.createServer(app)

var moves = [];
let numberPlayers = 0;
let whiteTurn = true ;

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

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const turnIsOver = () =>{
    moves = [];
    whiteTurn = !whiteTurn;
    console.log(whiteTurn);
    if (whiteTurn) io.to("white").emit("play");
    if (!whiteTurn) io.to("black").emit("play");
}

io.on("connection", (socket) => {
    console.log('User Connected: ' + socket.id);
    
    socket.on("player_move", (rating) => {
        moves.push(rating);
        console.log(moves);
        if (numberPlayers != 0 && moves.length == numberPlayers) {
            let weakest = chooseWeakest(moves);
            io.emit("weakest_position", weakest);
            turnIsOver();
            console.log(moves);
        }
    });

    socket.on("join_room", (data) =>{
        socket.join(data);
        console.log("joined room "+data);
    });

    socket.on("new_room", () =>{
        socket.join(); // figure out how to create a random four letter code
        io.emit()
    });
    
});

server.listen(3001, () => {
    console.log("server is running")
});




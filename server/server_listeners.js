import { newPlayer, makeid } from "./helpers.js";
import Timer from "./timer.js";
import { Player } from "./Player.js";

const time_format = [600, 600];

export const process_move_handler = (io, socket, rooms) => {
    socket.on("send_rating", (rating, position, roomCode, isWhite, username) => {
        const this_room = rooms.get(roomCode);
        const team = isWhite ? this_room.white_team : this_room.black_team;
        const player = team.get(username);

        player._move_fen = position;
        player._move_rating = rating;

        this_room.moves_submitted++;

        // triggers once everyone's votes are in
        if (team.size != 0 && team.size === this_room.moves_submitted) {

            let lowest_rating = Infinity;
            let worst_fen = "";
            let weakest_player = "";

            team.forEach((player, username) => {
                if (player._move_rating < lowest_rating) {
                    lowest_rating = player._move_rating;
                    worst_fen = player._move_fen;
                    weakest_player = username;
                }
            });

            // update room state
            team.get(weakest_player)._scorecard++;
            this_room.whiteTurn = !this_room.whiteTurn;
            this_room.moves_submitted = 0;

            isWhite ? io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(team)))
                : io.to(roomCode).emit("update_black_team", JSON.stringify(Array.from(team)));

            io.to(roomCode).emit("next_turn", worst_fen, this_room.whiteTurn);

            // update timer
            this_room.timer.stopTimer();
            io.to(roomCode).emit("update_timer", this_room.timer.getTimer());
            this_room.timer.nextTurn(this_room.whiteTurn, time_out, io, roomCode);

        }
    });
};

export const join_room_handler = (io, socket, rooms) => {
    socket.on("join_room", (roomCode, username) => {
        socket.join(roomCode);
        const thisRoom = rooms.get(roomCode);
        const isWhite = newPlayer(thisRoom, username);
        socket.emit("room_joined", roomCode, isWhite);

        io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(thisRoom.white_team)))
        io.to(roomCode).emit("update_black_team", JSON.stringify(Array.from(thisRoom.black_team)));
    });
};

export const create_room_handler = (io, socket, rooms) => {
    socket.on("create_room", (username) => {
        let roomCode;
        const isWhite = true;

        // regenerate until reach a unique roomcode
        do {
            roomCode = makeid(4);
        } while (rooms.has(roomCode));

        rooms.set(roomCode, {
            white_team: new Map(),
            black_team: new Map(),
            whiteTurn: true,
            timer: new Timer(time_format),
            moves_submitted: 0
        });

        const thisRoom = rooms.get(roomCode);
        newPlayer(thisRoom, username);
        socket.join(roomCode);

        console.log("Room Joined: " + roomCode);
        socket.emit("room_joined", roomCode, isWhite);

        io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(thisRoom.white_team)));
    });
};

export const change_team_handler = (io, socket, rooms) => {
    socket.on("change_team", (isWhite, roomCode, username) => {

        const thisRoom = rooms.get(roomCode);

        const teams = {
            oldTeam: isWhite ? thisRoom.white_team : thisRoom.black_team,
            newTeam: isWhite ? thisRoom.black_team : thisRoom.white_team
        };

        // update teams
        teams.oldTeam.delete(username);
        teams.newTeam.set(username, new Player());

        // add to the new team first so the maximum height is more stable
        // that way it doesn't flicker the screen
        if (isWhite) {
            io.to(roomCode).emit("update_black_team", JSON.stringify(Array.from(thisRoom.black_team)));
            io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(thisRoom.white_team)));
        }
        else {
            io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(thisRoom.white_team)));
            io.to(roomCode).emit("update_black_team", JSON.stringify(Array.from(thisRoom.black_team)));
        }
    });
}

export const room_is_valid_handler = (socket, rooms) => {
    socket.on("is_room_valid?", (roomCode) => {
        rooms.has(roomCode) ? socket.emit("yes_room") : socket.emit("no_room");
    });
};

export const start_game_handler = (io, socket, rooms) => {
    socket.on("start_game", (roomCode) => {
        const thisRoom = rooms.get(roomCode);
        thisRoom.timer.setTimer(time_format);
        thisRoom.timer.startTimer(time_out, io, roomCode);
        io.to(roomCode).emit("begin_game", time_format);
    });
}

export const stop_game_handler = (socket, rooms) => {
    socket.on("stop_game", (roomCode) => {
        const thisRoom = rooms.get(roomCode);
        thisRoom.timer.stopTimer();
    });
}

export const disconnection_handler = (io, socket, rooms) => {

    socket.on("disconnecting", () => {
        const roomCode = Array.from(socket.rooms).pop();
        const playerCount = (io.sockets.adapter.rooms.get(roomCode).size); // number of players in room

        // free memory if everyone has disconnected from the room
        if (playerCount == 1 && rooms.has(roomCode)) {
            const room = rooms.get(roomCode);
            if (room) {
                room.timer.stopTimer(); // stop all timers etc
            }
            rooms.delete(roomCode);
        };

        // print remaining rooms
        const roomsArray = [...rooms.keys()];
        console.log("Open Rooms:")
        console.log(roomsArray);

    });
}

// emits to client that a team has run out of time
const time_out = (io, roomCode) => {
    io.to(roomCode).emit("time_out");
}


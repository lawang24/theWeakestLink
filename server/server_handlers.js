import { newPlayer, makeid, reset_scorecards } from "./helpers.js";
import Timer from "./timer.js";
import { Player } from "./Player.js";
import { findWeakestPlayers } from "./helpers.js";

const time_format = [50, 50];

export const process_move_handler = (io, socket, rooms) => {
    socket.on("send_rating", (rating, position, roomCode, isWhite, username, target, source) => {

        const this_room = rooms.get(roomCode);
        const team = isWhite ? this_room.white_team : this_room.black_team;
        const player = team.get(username);

        player._move_fen = position;
        player._move_rating = rating;

        this_room.moves_submitted++;

        // update board highlighting
        player._source_square = source;
        player._target_square = target;

        // triggers once everyone's votes are in
        if (team.size != 0 && team.size === this_room.moves_submitted) {

            // clear highlights
            for (const player of team.values()){
                player.is_highlighted = false
            }

            // update room state
            const weakestPlayers = findWeakestPlayers(team);

            weakestPlayers.forEach(({username,moveType,score})=> {
                const player = team.get(username);
                player._scorecard++;
                player.is_highlighted = true;
            });

            // take data from an arbitrary player from the weakest (they should be the same by rule logic)
            const sample_player = team.get(weakestPlayers[0].username);
            const worst_fen = sample_player._move_fen;
            const target_square = sample_player._target_square;
            const source_square = sample_player._source_square;

            this_room.whiteTurn = !this_room.whiteTurn;
            this_room.moves_submitted = 0;

            isWhite ? io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(team)))
                : io.to(roomCode).emit("update_black_team", JSON.stringify(Array.from(team)));

            // console.log( target_square, source_square)
            io.to(roomCode).emit("next_turn", worst_fen, this_room.whiteTurn, target_square, source_square);

            // update timer
            this_room.timer.stopTimer();
            io.to(roomCode).emit("update_timer", this_room.timer.getTimer());
            console.log("Changed Time:" + this_room.timer.getTimer())
            this_room.timer.nextTurn(this_room.whiteTurn, time_out, io, roomCode);

        }
    });
};

export const join_room_handler = (io, socket, rooms,) => {
    socket.on("join_room", (roomCode, username) => {
        socket.join(roomCode);
        const this_room = rooms.get(roomCode);
        const isWhite = newPlayer(this_room, username);
        socket.emit("room_joined", roomCode, isWhite);

        io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(this_room.white_team)))
        io.to(roomCode).emit("update_black_team", JSON.stringify(Array.from(this_room.black_team)));
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

        const this_room = rooms.get(roomCode);
        newPlayer(this_room, username);
        socket.join(roomCode);
        this_room.timer.setTimer(time_format);

        console.log("Room Joined: " + roomCode);
        socket.emit("room_joined", roomCode, isWhite);

        io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(this_room.white_team)));
    });
};

export const change_team_handler = (io, socket, rooms) => {
    socket.on("change_team", (isWhite, roomCode, username) => {

        const this_room = rooms.get(roomCode);

        const teams = {
            oldTeam: isWhite ? this_room.white_team : this_room.black_team,
            newTeam: isWhite ? this_room.black_team : this_room.white_team
        };

        // update teams
        teams.oldTeam.delete(username);
        teams.newTeam.set(username, new Player());

        // add to the new team first so the maximum height is more stable
        // that way it doesn't flicker the screen
        if (isWhite) {
            io.to(roomCode).emit("update_black_team", JSON.stringify(Array.from(this_room.black_team)));
            io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(this_room.white_team)));
        }
        else {
            io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(this_room.white_team)));
            io.to(roomCode).emit("update_black_team", JSON.stringify(Array.from(this_room.black_team)));
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
        console.log("server start game");
        const this_room = rooms.get(roomCode);

        reset_scorecards(this_room);

        io.to(roomCode).emit("update_white_team", JSON.stringify(Array.from(this_room.white_team)))
        io.to(roomCode).emit("update_black_team", JSON.stringify(Array.from(this_room.black_team)));
        io.to(roomCode).emit("begin_game");
        this_room.timer.startTimer(time_out, io, roomCode);
    });
}

export const stop_game_handler = (io, socket, rooms) => {
    socket.on("stop_game", (roomCode) => {
        const this_room = rooms.get(roomCode);
        this_room.timer.stopTimer();
        this_room.timer.resetTimer()
        io.to(roomCode).emit("update_timer", this_room.timer.getTimer());
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

const time_out = (io, roomCode) => {
    io.to(roomCode).emit("time_out");
}

// sets the room time format to new format sent by host
// updates the rest of the room
export function set_time_format_handler(io, socket, rooms) {
    socket.on("set_time_format", (roomCode, timeFormat) => {
        const this_room = rooms.get(roomCode);
        this_room.timer.setTimer([timeFormat, timeFormat])

        io.to(roomCode).emit("update_timer", this_room.timer.getTimer());

    })
}
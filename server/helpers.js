import { Player } from "./Player.js";

export function newPlayer(thisRoom, username) {
    let isWhite;

    if (thisRoom.white_team.size <= thisRoom.black_team.size) {
        thisRoom.white_team.set(username, new Player());
        isWhite = true;
    }
    else {
        thisRoom.black_team.set(username, new Player());
        isWhite = false;
    }

    return isWhite;
}

export function the_weakest_player(team) {


};

export function turnIsOver(thisRoom,team,index) {
    thisRoom.moves = [];
    thisRoom.whiteTurn = !thisRoom.whiteTurn;
    console.log(`status of white's turn: ${thisRoom.whiteTurn}`);

    // update scorecard
    thisRoom.scorecard[team][index]++;
    console.log(thisRoom.scorecard);
}

export function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function reset_scorecards(this_room) {
    ['white_team', 'black_team'].forEach(team => {
        for (const player of this_room[team].values()) {
            player._scorecard = 0;
        }
    });
}

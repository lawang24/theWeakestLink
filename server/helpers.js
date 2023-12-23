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

export function findWeakestPlayer(team) {
    
    let weakestPlayerInfo = {
        username: "",
        moveType: "",
        score: null
    };

    team.forEach((player, username) => {
        let [moveType, score] = player.move_rating.split(' ');
        score = parseInt(score);


        // mate in 0 is overriden and gg
        const isFirstPlayer = weakestPlayerInfo.score === null;
        const isCurrentMoveTypeM = moveType === 'm';
        const isWeakestMoveTypeC = weakestPlayerInfo.moveType === 'c';
        const isNewWeakestForM = isCurrentMoveTypeM && (isWeakestMoveTypeC || score < weakestPlayerInfo.score);
        const isNewWeakestForC = !isCurrentMoveTypeM && (isWeakestMoveTypeC && score > weakestPlayerInfo.score);

        if (isFirstPlayer || isNewWeakestForM || isNewWeakestForC) {
            weakestPlayerInfo = { username, moveType, score };
        }
    });

    return weakestPlayerInfo;

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

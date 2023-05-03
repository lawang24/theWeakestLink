export function newPlayer(thisRoom, username) {
    let isWhite;
    if (!thisRoom.players.length) return true;

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
export function chooseWeakest(moves) {
    let index = 0;
    let champ = moves[0].rating;

    for (let i = 0; i < moves.length; i++) {
        if (moves[i].rating < champ) {
            champ = moves[i].rating;
            index = i;
        }

    }

    const position_and_index = [moves[index].position, index]

    return position_and_index;

}
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
export function deletePlayer(isWhite, teams, username) {
    const oldTeam = isWhite ? 0 : 1;
    for (let i = 0; i < teams[oldTeam].length; i++) {
        if (username === teams[oldTeam][i]) teams[oldTeam].splice(i, 1);
    };
}
export function createCounters(thisRoom) {
    let isWhite;

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
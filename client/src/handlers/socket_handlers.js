import { squareStyling } from "./helpers";

export const room_joined_handler = (socket, setRoomCode, setIsWhite) => {
  socket.on("room_joined", (roomCode, isWhite) => {
    setRoomCode(roomCode);
    setIsWhite(isWhite);
  });
};

export const next_turn_handler = (socket, game, setFen, setIsCheckmate, setGameStarted,
  setWhiteTurn, setTurn, isWhite, setCanSubmitMove, roomCode, setSquareStyles) => {

  socket.on("next_turn", (worst_fen, nowWhiteTurn, target_square, source_square) => {
    setFen(worst_fen);
    game.load(worst_fen);

    let kingSquare = null;

    // check highlighting
    if (game.inCheck()) {
      const pieceColor = nowWhiteTurn ? 'w' : 'b';
      const boardInCheck = game.board()
      for (let i = 0; i < boardInCheck.length; i++) {
        kingSquare = boardInCheck[i].find(piece => (piece && piece.type === 'k' && piece.color === pieceColor))
        if (kingSquare) break;
      }
    }

    setSquareStyles(squareStyling(source_square.current, target_square.current, kingSquare));

    // check game conditions
    if (game.isCheckmate()) {
      setIsCheckmate(true);
      setGameStarted(false);
      setTurn(false);
      setCanSubmitMove(false);
      socket.emit("stop_game", roomCode);
    }
    // allow the proper players to move 
    else {
      setWhiteTurn((whiteTurn) => !whiteTurn);
      setTurn((turn) => !turn);
      if (isWhite === nowWhiteTurn) setCanSubmitMove(true);
    }

  });
};

export const update_teams_handler = (socket, setWhiteTeam, setBlackTeam) => {
  socket.on("update_white_team", (white_team) => {
    setWhiteTeam(new Map(JSON.parse(white_team)));
  });

  socket.on("update_black_team", (black_team) => {
    setBlackTeam(new Map(JSON.parse(black_team)));
  });
};

export const begin_game_handler = (socket, game, setWhiteTurn, setGameStarted, setFen, setIsCheckmate,
  setTimeOut, isWhite, setTurn, setCanSubmitMove, setSquareStyles) => {

  socket.on("begin_game", () => {
    setWhiteTurn(true);
    setGameStarted(true);
    setFen("start");
    setIsCheckmate(false);
    setTimeOut(false);
    setSquareStyles({});
    if (isWhite) {
      setTurn(true);
      setCanSubmitMove(true);
    }
    game.reset(); // restart the game
  });


};

/* handles socket event listeners for timer functionality in between turns and at the end of the game, resetting the game
to the initial state in the latter case*/
export const timer_handler = (socket, setGameStarted, setTimeOut, setTurn, setCanSubmitMove,
  roomCode, setWhiteTime, setBlackTime) => {

  socket.on("time_out", () => {
    setGameStarted(false);
    setTimeOut(true);
    setTurn(false);
    setCanSubmitMove(false);
    socket.emit("stop_game", roomCode);
  });

  socket.on("update_timer", (timer) => {
    console.log("update_time:" + timer.toString())
    setWhiteTime(timer[0]);
    setBlackTime(timer[1]);
  });

};


// socketHandlers for receiving confirmation of the queried room's existence 
export function roomListeners(socket, setisHomescreen) {

  socket.on("yes_room", () => {
    setisHomescreen(false);
  });

  socket.on("no_room", () => {
    alert("Game Not Found");
    console.log("alert!");
  });

};



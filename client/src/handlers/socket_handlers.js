export const room_joined_handler = (socket, setRoomCode, setIsWhite) => {
  socket.on("room_joined", (roomCode, isWhite) => {
    setRoomCode(roomCode);
    setIsWhite(isWhite);
  });
};

export const next_turn_handler = (socket, game, setFen, setIsCheckmate, setGameStarted,
  setWhiteTurn, setTurn, isWhite, setCanSubmitMove, roomCode) => {
  
    socket.on("next_turn", (worst_fen, nowWhiteTurn) => {
    setFen(worst_fen);
    game.load(worst_fen);

    // check game conditions
    if (game.isCheckmate() === true) {
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
  setTimeOut, isWhite, setTurn, setCanSubmitMove) => {

  socket.on("begin_game", () => {
    setWhiteTurn(true);
    setGameStarted(true);
    setFen("start");
    setIsCheckmate(false);
    setTimeOut(false);
    if (isWhite) {
      setTurn(true);
      setCanSubmitMove(true);
    }
    game.reset(); // restart the game
  });

};

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
    setWhiteTime(timer[0]);
    setBlackTime(timer[1]);
    console.log(timer);
  });

};

export function roomListeners(socket, setisHomescreen) {

  socket.on("yes_room", () => {
    setisHomescreen(false);
  });

  socket.on("no_room", () => {
    alert("Game Not Found");
    console.log("alert!");
  });

};

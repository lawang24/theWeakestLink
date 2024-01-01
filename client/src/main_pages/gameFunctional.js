import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { useState, useEffect, useRef } from "react";
import { Logo } from "../styled_components"
import { RoomCode as RoomCodeButton } from "../styled_components/gameComponents"
import { MatchClock } from "../items/matchClock.js";
import { usePlayerContext } from '../contexts/PlayerContext';
import {
  begin_game_handler, next_turn_handler, room_joined_handler,
  timer_handler, update_teams_handler
} from "../handlers/socket_handlers.js";
import { sendRating, squareStyling } from "../handlers/helpers.js"
import TeamRoster from "../items/teamRoster.js";
import styled from 'styled-components';
import { Ratings, Gameover } from "../items/display_components.js";
import { GameControls, TurnDisplay } from "../items/interactive_components.js";
import Settings from "../items/settingsMenu.js";


console.log("Game functional loaded")

const engine = new Worker("stockfish.js");
const game = new Chess();

// function chessBoardWidth(screen){
//   return 
// }

const Game = () => {
  const [fen, setFen] = useState("start");
  const [turn, setTurn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [canSubmitMove, setCanSubmitMove] = useState(false);
  const [whiteTurn, setWhiteTurn] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [whiteTime, setWhiteTime] = useState(50);
  const [blackTime, setBlackTime] = useState(50);
  const [whiteTeam, setWhiteTeam] = useState(new Map());
  const [blackTeam, setBlackTeam] = useState(new Map());
  const [squareStyles, setSquareStyles] = useState({});
  const proposedMove = useRef("");
  const target = useRef("");
  const source = useRef("");


  const { socket,
    roomCode,
    setRoomCode,
    host,
    isWhite,
    setIsWhite,
    username,
  } = usePlayerContext();

  // core logic handler mounts
  useEffect(() => {
    room_joined_handler(socket, setRoomCode, setIsWhite);

    next_turn_handler(socket, game, setFen, setIsCheckmate, setGameStarted,
      setWhiteTurn, setTurn, isWhite, setCanSubmitMove, roomCode, setSquareStyles);

    update_teams_handler(socket, setWhiteTeam, setBlackTeam);

    begin_game_handler(socket, game, setWhiteTurn, setGameStarted, setFen, setIsCheckmate,
      setTimeOut, isWhite, setTurn, setCanSubmitMove, setSquareStyles);

    timer_handler(socket, setGameStarted, setTimeOut, setTurn, setCanSubmitMove, roomCode, setWhiteTime, setBlackTime);

    return () => {
      socket.removeAllListeners();
    }

  }, [isWhite, roomCode, setIsWhite, setRoomCode, socket]);



  const engineGame = () => {

    const evalMove = () => {
      engine.postMessage("ucinewgame");
      console.log("proposedMove.current:" + proposedMove.current)
      engine.postMessage("position fen " + proposedMove.current);
      engine.postMessage("go depth 5")

      // engine.postMessage("eval");
      // if (!game.isGameOver()) {
      //   engine.postMessage("ucinewgame");
      //   console.log("proposedMove.current:" + proposedMove.current)
      //   engine.postMessage("position fen " + proposedMove.current);
      //   engine.postMessage("eval");
      // }
    };

    engine.onmessage = (event) => {
      let line;
      console.log("trigger")

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }
      console.log(line);
      if (line.substring(0, 8) === "bestmove") {

        let score = line.substring(line.indexOf("score") + 6);
        console.log(score)
        // if (!isWhite) score = score * -1;
        sendRating(socket, score, proposedMove.current, roomCode, isWhite, username, target, source);
      }
    };

    return {
      start: function () {
        console.log("starting")
        engine.postMessage("ucinewgame");
        engine.postMessage("isready");
        // announced_game_over = false;
      },
      evalMove: function () {
        evalMove();
      },
    };
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {

    if (!turn || !canSubmitMove) return;
    const move = game.move({ from: sourceSquare, to: targetSquare })
    if (move === null) return; // illegal move  
    console.log(game.fen());
    // grab player proposed position and show it
    proposedMove.current = game.fen();
    target.current = targetSquare;
    source.current = sourceSquare
    setFen(proposedMove.current);
    setCanSubmitMove(false);

    // game.undo();

    // highlight the move made
    setSquareStyles(squareStyling(sourceSquare, targetSquare));

    return new Promise((resolve) => {
      resolve();
    }).then(() => engineGame().evalMove());
  };

  const GameStateDisplay = () => {
    return (
      <GameStateDisplayWrapper>
        <Ratings team={isWhite ? whiteTeam : blackTeam} gameStarted={gameStarted} />
        <GameControls gameStarted={gameStarted} socket={socket} roomCode={roomCode} host={host}
          isWhite={isWhite} username={username} setIsWhite={setIsWhite} />
        <TurnDisplay gameStarted={gameStarted} turn={turn} />
          <Gameover isCheckmate={isCheckmate} timeOut={timeOut} whiteTurn={whiteTurn} />
      </GameStateDisplayWrapper>
    )
  }

  return (

    <GameWrapper>
      <ChessboardWrapper>
        <Chessboard
          id="board!"
          position={fen}
          onDrop={onDrop}
          boardStyle={BoardStyle}
          orientation={isWhite ? "white" : "black"}
          calcWidth={(screen) => Math.min(screen.screenHeight, screen.screenWidth) * .9}
          squareStyles={squareStyles}
        />
      </ChessboardWrapper>
      <Logo/>
      <TeamRoster whiteTeam={whiteTeam} blackTeam={blackTeam} gameStarted={gameStarted} />
      <GameStateDisplay />
      <Footer>
        {/* <SettingButton setWhiteTime={setWhiteTime} setBlackTime={setBlackTime} socket={socket} /> */}
        <Settings/>
        <RoomCodeButton>ROOM: {roomCode}</RoomCodeButton>
        <MatchClock whiteTime={whiteTime} blackTime={blackTime} whiteTurn={whiteTurn} gameStarted={gameStarted} />
      </Footer>

    </GameWrapper>

  );
}

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
  width: 100%;
  height: 100%;
  gap: 3%;
  grid-area: footer;
`;

const BoardStyle = {
};

const GameStateDisplayWrapper = styled.div`
  grid-area: control;
`;

const ChessboardWrapper = styled.div`
  border: 5px solid #868BAC;
  border-radius: 5px;
  grid-area: chessboard;
`

const GameWrapper = styled.div`
display: grid;
position: relative;
grid-template:
    "logo chessboard" 1fr
    "roster chessboard" 1fr 
    "roster chessboard" 1fr
    "control chessboard" 1fr
    "footer chessboard" 1fr 
    / 1fr 2fr;
margin:0;
padding:0;
background-color: rgb(38,40,56,0.93);
height:100dvh;
width: 100dvw;
overflow-y:hidden;
max-width: 1800px;
justify-items: center;
align-items: center;
box-sizing: border-box;

@media screen and (width<=600px){
    grid-template:
    "footer logo" 1fr
    "roster roster" 2fr
    "control control" 1fr
    "chessboard chessboard" 3fr
    / 3fr 1fr;
    padding: 5px 0 15px 0;

}
`;

export default Game;

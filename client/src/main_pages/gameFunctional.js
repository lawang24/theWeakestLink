import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { useState, useEffect, useRef } from "react";
import { SettingButton } from "../styled_components/settingButton";
import { Logo } from "../styled_components"
import { GameWrapper, RoomCode as RoomCodeButton, NonChessboard } from "../styled_components/gameComponents"
import { Ratings, Gameover } from "../items/display_components.js";
import { GameControls } from "../items/interactive_components";
import { MatchClock } from "../items/matchClock.js";
import { usePlayerContext } from '../contexts/PlayerContext';
import {
  begin_game_handler, next_turn_handler, room_joined_handler,
  timer_handler, update_teams_handler
} from "../handlers/socket_handlers.js";
import { sendRating, squareStyling } from "../handlers/helpers.js"
import TeamRoster from "../items/teamRoster.js";

console.log("Game functional loaded")

const engine = new Worker("stockfish.js");
const game = new Chess();

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
  const [history, setHistory] = useState([]);
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
      setWhiteTurn, setTurn, isWhite, setCanSubmitMove, roomCode, setHistory, setSquareStyles);

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

  return (

    <GameWrapper>
      <Chessboard
        id="board!"
        position={fen}
        onDrop={onDrop}
        boardStyle={boardStyle}
        orientation={isWhite ? "white" : "black"}
        calcWidth={(screen) => Math.min(screen.screenHeight * .9, screen.screenWidth * .53)}
        squareStyles={squareStyles}
      />

      <NonChessboard>

        <Logo style={{ width: "50%", height: "auto" }}></Logo>
        <TeamRoster  whiteTeam = {whiteTeam} blackTeam = {blackTeam} gameStarted = {gameStarted} />
        <Ratings team={isWhite ? whiteTeam : blackTeam} gameStarted={gameStarted} />

        {/*display of these depend on the state of the game*/}
        <GameControls gameStarted={gameStarted} socket={socket} roomCode={roomCode} host={host}
          isWhite={isWhite} username={username} setIsWhite={setIsWhite} />
        <h1 style={{ color: "#FFFFFF", fontFamily: "Montserrat", fontSize: "1.5rem" }}>{turn ? "Your" : "Not Your"} Turn</h1>
        <h1 style={{ color: "#FFFFFF" }}>
          <Gameover isCheckmate={isCheckmate} timeOut={timeOut} whiteTurn={whiteTurn} />
        </h1>

        <section id="footer" style={{ display: "flex", width: "100%", margin: "0 0 34px 34px", 'justifyContent': 'start', 'gap': '5%' }}>
          <SettingButton setWhiteTime={setWhiteTime} setBlackTime={setBlackTime} socket={socket} />
          <RoomCodeButton>ROOM: {roomCode}</RoomCodeButton>
          <MatchClock whiteTime={whiteTime} blackTime={blackTime} whiteTurn={whiteTurn} gameStarted={gameStarted} />
        </section>

      </NonChessboard>

    </GameWrapper>


  );
}

export default Game;

const boardStyle = {
  border: "10px solid #868BAC",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
  "border-radius": "5px",
  position: "relative",
  left: "5%"
};


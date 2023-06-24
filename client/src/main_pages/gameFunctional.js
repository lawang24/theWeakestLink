import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { useState, useEffect, useRef } from "react";
import { Logo, SettingButton } from "../styled_components"
import { GameWrapper, RoomCode as RoomCodeButton, TeamName, GameplaySection, NonChessboard } from "../styled_components/gameComponents"
import { TeamSection } from "../styled_components/gameComponents";
import { Teams, Ratings, Gameover } from "../items/display_components.js";
import { GameControls } from "../items/interactive_components";
import { CountdownTimer } from "../items/client_clock.js";
import { usePlayerContext } from '../contexts/PlayerContext';
import {
  begin_game_handler, next_turn_handler, room_joined_handler,
  timer_handler, update_teams_handler
} from "../handlers/socket_handlers.js";
import {sendRating, squareStyling} from "../handlers/helpers.js"

const STOCKFISH = window.STOCKFISH;
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

  const engineGame = (options) => {
    options = options || {};

    /// We can load Stockfish via Web Workers or via STOCKFISH() if loaded from a <script> tag.
    let engine =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(options.stockfishjs || "stockfish.js");

    const evalMove = () => {
      engine.postMessage("ucinewgame");
        console.log("proposedMove.current:" + proposedMove.current)
        engine.postMessage("position fen " + proposedMove.current);
        engine.postMessage("eval");
      // if (!game.isGameOver()) {
      //   engine.postMessage("ucinewgame");
      //   console.log("proposedMove.current:" + proposedMove.current)
      //   engine.postMessage("position fen " + proposedMove.current);
      //   engine.postMessage("eval");
      // }
    };

    engine.onmessage = (event) => {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }
      console.log("line");
      console.log(line);
      if (line.substr(0, "Total Evaluation".length) === "Total Evaluation") {
        let score = parseFloat(line.substr(18).substr(0, 4));
        if (!isWhite) score = score * -1;
        sendRating(socket, score, proposedMove.current, roomCode, isWhite, username, target, source);
      }
    };

    return {
      start: function () {
        engine.postMessage("ucinewgame");
        engine.postMessage("isready");
        // announced_game_over = false;
      },
      evalMove: function () {
        evalMove();
      },
    };
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
        squareStyles = {squareStyles}
      />

      <NonChessboard>

        <Logo style={{ width: "50%", height: "auto" }}></Logo>

        <GameplaySection>
          <div style={{ display: "flex", "flex-flow": "row wrap", "justify-content": "center", height: "fit-content", width: "100%", "margin-top": "17%" }}>
            <TeamSection>
              <TeamName color="white">WHITE</TeamName>
              <Teams team={whiteTeam} isWhite={true} gameStarted={gameStarted} />
            </TeamSection>
            <TeamSection>
              <TeamName>BLACK</TeamName>
              <Teams team={blackTeam} isWhite={false} gameStarted={gameStarted} />
            </TeamSection>
          </div>

          <Ratings team={isWhite ? whiteTeam : blackTeam} gameStarted={gameStarted} />

          {!gameStarted && <GameControls socket={socket} roomCode={roomCode} host={host} 
          isWhite={isWhite} username = {username} setIsWhite={setIsWhite} />}

          <h1 style={{ color: "#FFFFFF" }}>{turn ? "Your" : "Not Your"} Turn</h1>
          <h1 style={{ color: "#FFFFFF" }}>
            <Gameover isCheckmate={isCheckmate} timeOut={timeOut} whiteTurn={whiteTurn} />
          </h1>

          <div style={{ display: "flex", height: "8%", width: "30%", justifyContent: "center", alignItems: "center" }}>
            <CountdownTimer totalSeconds={whiteTime} isRunning={(whiteTurn && gameStarted)} />
            <CountdownTimer totalSeconds={blackTime} isRunning={(!whiteTurn && gameStarted)} />
          </div>
        </GameplaySection>

        <section id="footer" style={{ display: "flex", width: "100%", margin: "0 0 34px 34px", 'justify-content': 'start' }}>
          <SettingButton style={{ height: "48px", width: "48px", }}></SettingButton>
          <RoomCodeButton>ROOM: {roomCode}</RoomCodeButton>
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


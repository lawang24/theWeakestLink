import Chessboard from "chessboardjsx";
import { useState, useEffect } from "react";
import { Logo, SettingButton } from "../StyledComponents"
import { GameWrapper, RoomCode as RoomCodeButton, ChangeTeam, TeamName, StartGame, GameplaySection } from "../StyledComponents/gameComponents"
import { TeamSection } from "../StyledComponents/gameComponents";
import { Chess } from "chess.js";
import { Teams, Ratings, CountdownTimer } from "../items/displayItems";
import { usePlayerContext } from '../contexts/PlayerContext';

const STOCKFISH = window.STOCKFISH;
const game = new Chess();

const Game = () => {
  const [fen, setFen] = useState("start");
  const [turn, setTurn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState({});
  const [scorecard, setScorecard] = useState({});
  const [canSubmitMove, setCanSubmitMove] = useState(false);
  const [whiteTurn, setWhiteTurn] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  const { socket,
    roomCode,
    setRoomCode,
    host,
    isWhite,
    setIsWhite,
    username,
  } = usePlayerContext();

  let proposedMove;

  useEffect(() => {

    socket.on("room_joined", (roomCode, isWhite) => {
      setRoomCode(roomCode);
      setIsWhite(isWhite);
    });
  
    socket.on("nextTurn", (weakest, isWhiteTurn, ratings, scorecard) => {
      console.log(weakest);
      console.log(scorecard);
      setFen(weakest);
      setScorecard(scorecard);
      game.load(weakest);

      // if no longer your turn, update last turn's ratings so you can see who's the bum
      if (isWhite !== isWhiteTurn) setRatings(ratings);

      // check if checkmate
      if (game.isCheckmate() === true) {
        setGameStarted(false);
        setIsCheckmate(true);
      } else {
        setWhiteTurn((whiteTurn) => !whiteTurn);
        setTurn((turn) => !turn);
        if (isWhite === isWhiteTurn) setCanSubmitMove(true);
      }

    });

    socket.on("update_players", (teams) => {
      setPlayers(JSON.parse(teams));
    });

    socket.on("begin_game", (scorecard) => {
      const Scorecard = JSON.parse(scorecard);
      setWhiteTurn(true);
      setGameStarted(true);
      setScorecard(Scorecard);
      setFen("start");
      setIsCheckmate(false);
      setTimeOut(false);
      setWhiteTime(600);
      setBlackTime(600);

      if (isWhite) {
        setTurn(true);
        setCanSubmitMove(true);
      }

      game.reset(); // restart the game
    });

    socket.on("time_out", () => {
      setGameStarted(false);
      setTimeOut(true);
    });

    socket.on("update_timer", (timer) => {
      setWhiteTime(timer[0]);
      setBlackTime(timer[1]);
    });

    return () => {
      socket.removeAllListeners();
    }

  }, [isWhite, setIsWhite, setRoomCode, socket]);

  // send the client's rating to the server
  const sendRating = (rating, position) => {
    socket.emit("send_rating", rating, position, roomCode, isWhite, username);
  };

  const changeTeam = () => {
    console.log(roomCode);
    socket.emit("change_team", isWhite, roomCode, username);
    setIsWhite((isWhite) => !isWhite);
  }

  const onDrop =  ({ sourceSquare, targetSquare }) => {

    if (!turn || !canSubmitMove) return;
    const move = game.move({ from: sourceSquare, to: targetSquare })
    if (move === null) return; // illegal move  
    console.log(game.fen());
    // grab player proposed position and show it
    proposedMove = game.fen();
    setFen(proposedMove);
    setCanSubmitMove(false);

    game.undo();

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

    //let announced_game_over;

    // setInterval(() => {
    //   if (announced_game_over) {
    //     return;
    //   }
    //   if (game.isGameOver()) {
    //     announced_game_over = true;
    //   }
    // }, 500);

    const evalMove = () => {
      if (!game.isGameOver()) {
        engine.postMessage("ucinewgame");
        console.log("proposedMove:"+ proposedMove)
        engine.postMessage("position fen " + proposedMove);
        engine.postMessage("eval");
      }
    };

    engine.onmessage = (event) => {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }
      if (line.substr(0, "Total Evaluation".length) === "Total Evaluation") {
        let score = parseFloat(line.substr(18).substr(0, 4));
        if (!isWhite) score = score * -1;
        sendRating(score, proposedMove);
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

  // increment_whitetime = (time) => {
  //   this.setState( {white_time : time } ) 
  // }

  // increment_blacktime = () => {
  //   this.setState((state) => ({
  //     black_time: state.black_time - 1
  //   }));
  // };

  const StartGameButton = () => {
    if (host)
      return (<StartGame onClick={() => socket.emit("start_game", roomCode)}>START</StartGame>);
  };

  const GameControls = () => {
    if (!gameStarted) {
      return (
        <div style={{ display: "flex", justifyContent: "space-evenly", width: "70%", height: "9%" }}>
          <StartGameButton />
          <ChangeTeam team="white" onClick={(e) => changeTeam(true)} >CHANGE TEAM</ChangeTeam>
        </div>
      )
    }
  }

  const Gameover = () => {
    if (isCheckmate) {
      return (<div>CHECKMATE BUCKO</div>)
    }
    else if (timeOut) {
      return (<div>{isWhite ? "WHITE" : "BLACK"} WINS ON TIME</div>)
    }
  }

  return (
    <GameWrapper>
      <Chessboard
        id="board!"
        position={fen}
        onDrop={onDrop}
        boardStyle={boardStyle}
        orientation={isWhite ? "white" : "black"}
        calcWidth={(screen) => Math.min(screen.screenHeight * .9, screen.screenWidth * .53)}
      />

      <div style={{ display: "flex", "flex-direction": 'column', "justify-content": "space-between", height: "100vh", width: "33vw" }}>

        <Logo style={{ width: "50%", height: "auto" }}></Logo>


        <GameplaySection>
          <div style={{ display: "flex", "flex-flow": "row wrap", "justify-content": "center", height: "fit-content", width: "100%", "margin-top": "17%" }}>
            <TeamSection>
              <TeamName color="white">WHITE</TeamName>
              <Teams players={players} isWhite={true} scorecard={scorecard} gameStarted={gameStarted} />
            </TeamSection>
            <TeamSection>
              <TeamName>BLACK</TeamName>
              <Teams players={players} isWhite={false} scorecard={scorecard} gameStarted={gameStarted} />
            </TeamSection>
          </div>

          <Ratings ratings={ratings} />

          <GameControls gameStarted={gameStarted} />

          <h1 style={{ color: "#FFFFFF" }}>{turn ? "Your" : "Not Your"} Turn</h1>
          <h1 style={{ color: "#FFFFFF" }}>
            <Gameover />
          </h1>

          <div style={{ display: "flex", height: "8%", width: "30%", justifyContent: "center", alignItems: "center" }}>
            <CountdownTimer totalSeconds={whiteTime} isRunning={whiteTurn} />
            <CountdownTimer totalSeconds={blackTime} isRunning={(!whiteTurn && gameStarted)} />
          </div>
        </GameplaySection>

        <section id="footer" style={{ display: "flex", width: "100%", margin: "0 0 34px 34px", 'justify-content': 'start' }}>
          <SettingButton style={{ height: "48px", width: "48px", }}></SettingButton>
          <RoomCodeButton>ROOM: {roomCode}</RoomCodeButton>
        </section>

      </div>
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
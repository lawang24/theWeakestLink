import Chessboard from "chessboardjsx";
import { React, Component } from "react";
import { Logo, SettingButton } from "../StyledComponents"
import { GameWrapper, RoomCode as RoomCodeButton, ChangeTeam, TeamName, StartGame, GameplaySection } from "../StyledComponents/gameComponents"
import { TeamSection } from "../StyledComponents/gameComponents";
import { Chess } from "chess.js";
import { Teams, Ratings, CountdownTimer } from "../items/displayItems";

const STOCKFISH = window.STOCKFISH;
const game = new Chess();

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fen: "start",
      turn: false,
      gameStarted: false,
      players: {},
      scorecard: {}, 
      canSubmitMove: false,
      whiteTurn: false,
      isCheckmate: false,
      timeOut: false,
      ratings: [],
      white_time: 600,
      black_time: 600,
    }
    this.increment_whitetime = this.increment_whitetime.bind(this);
    this.increment_blacktime = this.increment_blacktime.bind(this);
  };

  componentDidMount() {
    this.props.socket.on("nextTurn", (weakest, isWhiteTurn, ratings, scorecard) => {
      console.log(weakest);
      console.log(scorecard);
      this.setState({ fen: weakest, scorecard: scorecard });
      game.load(weakest);

      // if no longer your turn, update last turn's ratings so you can see who's the bum
      if (this.props.isWhite !== isWhiteTurn) this.setState({ ratings: ratings }); 

      // check if checkmate
      if (game.isCheckmate() === true) this.setState({ gameStarted: false, isCheckmate: true })
      else {
        this.setState({ whiteTurn: !this.state.whiteTurn, turn: !this.state.turn });
        if (this.props.isWhite === isWhiteTurn) this.setState({ canSubmitMove: true });
      };
    });

    this.props.socket.on("update_players", (teams) => {
      this.setState({ players: JSON.parse(teams) });
    });

    this.props.socket.on("begin_game", (scorecard) => {
      const Scorecard = JSON.parse(scorecard);
      this.setState({ 
      whiteTurn: true, 
      gameStarted: true, 
      scorecard: Scorecard, 
      fen: "start", 
      isCheckmate: false,
      timeOut: false,
      white_time: 600,
      black_time: 600,
    });
      if (this.props.isWhite) this.setState({ turn: true, canSubmitMove: true });

      game.reset(); // restart the game
      
    })

    this.props.socket.on("time_out", () => {
      this.setState({ gameStarted: false, timeOut: true });
    })

  };

  sendRating = (rating, position) => {
    this.props.socket.emit("send_rating", rating, position, this.props.roomCode, this.props.isWhite, this.props.username);
  };

  changeTeam = () => {
    this.props.socket.emit("change_team", this.props.isWhite, this.props.roomCode, this.props.username);
    this.props.setisWhite(!this.props.isWhite);
  }

  onDrop = ({ sourceSquare, targetSquare }) => {
    console.log(this.state.canSubmitMove);
    if (!this.state.turn || !this.state.canSubmitMove) return;
    const move = game.move({ from: sourceSquare, to: targetSquare })
    if (move === null) return; // illegal move  

    // grab player proposed position and show it
    this.setState({ fen: game.fen() })
    this.setState({ canSubmitMove: false });

    game.undo();

    return new Promise((resolve) => {
      resolve();
    }).then(() => this.engineGame().evalMove());
  };

  engineGame = (options) => {
    options = options || {};

    /// We can load Stockfish via Web Workers or via STOCKFISH() if loaded from a <script> tag.
    let engine =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(options.stockfishjs || "stockfish.js");
    let announced_game_over;

    setInterval(() => {
      if (announced_game_over) {
        return;
      }
      if (game.isGameOver()) {
        announced_game_over = true;
      }
    }, 500);

    const evalMove = () => {
      if (!game.isGameOver()) {
        engine.postMessage("ucinewgame");
        engine.postMessage("position fen " + this.state.fen);
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
        if (!this.props.isWhite) score = score * -1;
        this.sendRating(score, this.state.fen);
      }
    };

    return {
      start: function () {
        engine.postMessage("ucinewgame");
        engine.postMessage("isready");
        announced_game_over = false;
      },
      evalMove: function () {
        evalMove();
      },
    };
  };

  increment_whitetime = () => {
    this.setState((state) => ({
      white_time: state.white_time - 1
    }));
  };

  increment_blacktime = () => {
    this.setState((state) => ({
      black_time: state.black_time - 1
    }));
  };


  render() {

    const startGame = () => {
      if (this.props.host) return (<StartGame onClick={() => this.props.socket.emit("start_game", this.props.roomCode)}>START</StartGame>);
    };

    const GameControls = () => {
      if (!this.state.gameStarted) {
        return (
          <div style={{ display: "flex", justifyContent: "space-evenly", width: "70%", height: "9%" }}>
            {startGame()}
            <ChangeTeam team="white" onClick={e => this.changeTeam(true)} >CHANGE TEAM</ChangeTeam>
          </div>
        )
      }
    }

    const Gameover = () => {
      if (this.state.isCheckmate) {
        return (
          <div>CHECKMATE BUCKO</div>
        )
      }
      else if (this.state.timeOut) {
        return (
          <div>{team.toUpperCase()} WINS ON TIME</div>
        )
      }
    }

    let team = this.props.isWhite ? "white" : "black"
    let status = (this.state.turn ? "Your" : "Not Your");


    return (
      <GameWrapper>
        <Chessboard
          id="board!"
          position={this.state.fen}
          onDrop={this.onDrop}
          boardStyle={boardStyle}
          orientation={team}
          calcWidth={(screen) => Math.min(screen.screenHeight * .9, screen.screenWidth * .53)}
        />

        <div style={{ display: "flex", "flex-direction": 'column', "justify-content": "space-between", height: "100vh", width: "33vw" }}>

          <Logo style={{ width: "50%", height: "auto" }}></Logo>


          <GameplaySection>
            <div style={{ display: "flex", "flex-flow": "row wrap", "justify-content": "center", height: "fit-content", width: "100%", "margin-top": "17%" }}>
              <TeamSection>
                <TeamName color="white">WHITE</TeamName>
                <Teams players={this.state.players} isWhite={true} scorecard={this.state.scorecard} gameStarted={this.state.gameStarted} />
              </TeamSection>
              <TeamSection>
                <TeamName>BLACK</TeamName>
                <Teams players={this.state.players} isWhite={false} scorecard={this.state.scorecard} gameStarted={this.state.gameStarted} />
              </TeamSection>
            </div>

            <Ratings ratings={this.state.ratings} />

            <GameControls gameStarted={this.state.gameStarted} />

            <h1 style={{ color: "#FFFFFF" }}>{status} Turn</h1>
            <h1 style={{ color: "#FFFFFF" }}>{Gameover()}</h1>
            <div style={{ display: "flex", height: "8%", width: "30%", justifyContent: "center", alignItems: "center" }}>

              <CountdownTimer totalSeconds={this.state.white_time} increment={this.increment_whitetime} isRunning={this.state.whiteTurn} />
              <CountdownTimer totalSeconds={this.state.black_time} increment={this.increment_blacktime}
                isRunning={(!this.state.whiteTurn && this.state.gameStarted)} />

            </div>
          </GameplaySection>

          <section id="footer" style={{ display: "flex", width: "100%", margin: "0 0 34px 34px", 'justify-content': 'start' }}>
            <SettingButton style={{ height: "48px", width: "48px", }}></SettingButton>
            <RoomCodeButton>ROOM: {this.props.roomCode}</RoomCodeButton>
          </section>

        </div>
      </GameWrapper>
    );
  }
}

export default Game;

const boardStyle = {
  border: "10px solid #868BAC",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
  "border-radius": "5px",
  position: "relative",
  left: "5%"
};
import Chessboard from "chessboardjsx";
import { React, Component } from "react";
import { Logo, SettingButton } from "../StyledComponents"
import { GameWrapper, RoomCode as RoomCodeButton, ChangeTeam, TeamName, StartGame, Members, Tower, GameplaySection } from "../StyledComponents/gameComponents"
import { TeamSection } from "../StyledComponents/gameComponents";
import { Timer } from "../items/timer";


const STOCKFISH = window.STOCKFISH;

const Teams = ({ players, isWhite }) => {
  const team = isWhite ? 0 : 1;

  if (Object.keys(players).length === 0) return;
  else return (
    <Members>
      {players[team].map((player, i) => {
        return (
          <div style={{ display: "flex", width: "100%", justifyContent: "start", height: "fit-content", marginBottom: "10px" }}>
            <Tower isWhite={isWhite} style={{ height: "22px", paddingRight: "8px" }} />
            <li style={{ color: "#FFFFFF", height: "fit-content" }} key={i}> {player} </li>
          </div>
        )
      })}
    </Members>
  )
}

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fen: "start",
      turn: false,
      gameStarted: false,
      players: {},
      canSubmitMove: false,
      whiteTurn: false,
    }

  };

  componentDidMount() {
    this.props.socket.on("weakest_position", (weakest) => {
      console.log(weakest);
      this.setState({ fen: weakest });
      this.props.game.load(weakest);
    });
    this.props.socket.on("nextTurn", (isWhiteTurn) => {
      this.setState({ whiteTurn: !this.state.whiteTurn, turn: !this.state.turn });
      if (this.props.isWhite === isWhiteTurn) this.setState({ canSubmitMove: true });
    });
    this.props.socket.on("update_players", (teams) => {
      let newTeams = JSON.parse(teams);
      this.setState({ players: newTeams });
    });
    this.props.socket.on("begin_game", () => {
      if (this.props.isWhite) this.setState({ turn: true, canSubmitMove: true });
      this.setState({ whiteTurn: true, gameStarted: true });
    })
  };

  sendRating = (rating, position) => {
    this.props.socket.emit("send_rating", rating, position, this.props.roomCode, this.props.isWhite);
  };

  changeTeam = () => {
    this.props.socket.emit("change_team", this.props.isWhite, this.props.roomCode, this.props.username);
    this.props.setisWhite(!this.props.isWhite);
  }

  onDrop = ({ sourceSquare, targetSquare }) => {
    console.log(this.state.canSubmitMove);
    if (!this.state.turn || !this.state.canSubmitMove) return;
    const move = this.props.game.move({ from: sourceSquare, to: targetSquare })
    if (move === null) return; // illegal move  

    // grab player proposed position and show it
    this.setState({ fen: this.props.game.fen() })
    this.setState({ canSubmitMove: false });

    this.props.game.undo();

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
      if (this.props.game.isGameOver()) {
        announced_game_over = true;
      }
    }, 500);

    const evalMove = () => {
      if (!this.props.game.isGameOver()) {
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


  render() {


    let status = (this.state.turn ? "Your" : "Not Your");

    const GameTimer = () => {
      if (this.props.gameStarted) return Timer(300);
    }

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

    let team = this.props.isWhite ? "white" : "black"

    let blackTurn = this.state.gameStarted ? !this.state.whiteTurn : false;

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
                <Teams players={this.state.players} isWhite={true} />
              </TeamSection>
              <TeamSection>
                <TeamName>BLACK</TeamName>
                <Teams players={this.state.players} isWhite={false} />
              </TeamSection>
            </div>

            <GameControls gameStarted={this.state.gameStarted} />

            <h1 style={{ color: "#FFFFFF" }}>{status} Turn</h1>
            <div style={{ display: "flex", height: "8%", width: "30%", justifyContent: "center", alignItems: "center" }}>
              <Timer sec={300} turn={this.state.whiteTurn} />
              <Timer sec={300} turn={blackTurn} />
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
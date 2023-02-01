import Chessboard from "chessboardjsx";
import { React, Component } from "react";
import styled from "styled-components";
import { Logo, SettingButton } from "../StyledComponents"
import { GameWrapper, RoomCode, ChangeTeam, TeamName, TeamsStyled,StartGame } from "../StyledComponents/gameComponents"
import tower from "../images/tower_white.png"

const STOCKFISH = window.STOCKFISH;

const Teams = ({ players, isWhite }) => {
  const team = isWhite ? 0 : 1;
  const color = isWhite ? "#FFFFFF" : "#000000";

  if (Object.keys(players).length === 0) return;
  else return (
    <ul style={{listStyle: `url(${tower})`,listStyleType:"square"}}>
    {players[team].map((player, i) => <li style={{ color: color }} key={i}> {player} </li>)}
    </ul>
    )
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fen: "start",
      turn: false,
      players: {}
    }
  };

  componentDidMount() {
    this.props.socket.on("weakest_position", (weakest) => {
      this.setState({ fen: weakest });
      this.props.game.load(weakest);
    });
    this.props.socket.on("nextTurn", (isWhiteTurn) => {
      if (this.props.isWhite) this.setState({ turn: isWhiteTurn });
      else this.setState({ turn: !isWhiteTurn });
    });
    this.props.socket.on("update_players", (teams) => {
      let newTeams = JSON.parse(teams);
      this.setState({ players: newTeams }); // it is this one
    });
  };

  sendRating = (rating, position) => {
    this.props.socket.emit("send_rating", rating, position, this.props.roomCode, this.props.isWhite);
  };

  changeTeam = () => {
      this.props.socket.emit("change_team", this.props.isWhite, this.props.roomCode, this.props.username);
      this.props.setisWhite(!this.props.isWhite);
    }

  onDrop = ({ sourceSquare, targetSquare }) => {
    if (!this.state.turn) return;
    const move = this.props.game.move({ from: sourceSquare, to: targetSquare })
    if (move === null) return; // illegal move  

    // grab player proposed position and show it
    this.setState({ fen: this.props.game.fen() })

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
        if (this.state.team === "black") score = score * -1;
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

    let status = (this.state.turn ? "Your" : "Not Your")

    const startGame = (isHost) => {
      if (isHost) return (<StartGame onClick={() => this.props.socket.emit("start_game")}>Start</StartGame>);
    }

    let team = this.props.isWhite ? "white" : "black"

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
          

          <section id="gameplay" style={{
            "display": "flex", "flex-flow": "column", "justify-content": "center", "align-items": "center", height: "70vh"
          }}>
            <div style={{ display: "flex", "flex-flow": "row wrap", "justify-content": "center", height: "25%", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", width: "50%", alignItems: "center" }}>
                <TeamName color="white">WHITE</TeamName>
                <Teams players={this.state.players} isWhite={true} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", width: "50%", alignItems: "center" }}>
                <TeamName>BLACK</TeamName>
                <Teams players={this.state.players} isWhite={false} />
              </div>
            </div>

            <div style ={{display:"flex",justifyContent:"space-evenly",width:"70%",height:"9%"}}>
            {startGame(this.props.host)}
            <ChangeTeam team="white" onClick={e => this.changeTeam(true)} >CHANGE TEAM</ChangeTeam>
            </div>
            
          </section>




          <section id="footer" style={{ display: "flex", width: "100%", margin: "0 0 34px 34px", 'justify-content': 'start' }}>
            <SettingButton style={{ height: "48px", width: "48px", }}></SettingButton>
            <RoomCode>ROOM: {this.props.roomCode}</RoomCode>
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
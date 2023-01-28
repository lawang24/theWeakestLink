import Chessboard from "chessboardjsx";
import { React, Component } from "react";
import { Wrapper } from "../StyledComponents";
import styled from "styled-components";
import { Logo, SettingButton, Button } from "../StyledComponents"


const STOCKFISH = window.STOCKFISH;


const GameWrapper = styled(Wrapper)`
flex-flow:row-reverse;
justify-content:space-evenly;
`;

const RoomCode = styled(Button)`
width:34%;
height:56px;
margin-left:10%;
background:#868BAC;
`;

const TeamButton = styled(Button)`
height:50%;
width: 50%;
border: 3px solid rgba(151, 154, 175, 0.93);
background:${props => props.team ? "#E6E6E6" : "#939393"};
color:${props => props.team ? "#979AAF" : "#FFFFFF"};
margin:0;
`;

const TeamName = styled.h2`
display:flex;
height:50%;
width:50%;
justify-content:center;
align-items:center;
margin:0;
font-family: 'Montserrat';
font-style: normal;
font-weight: 700;
font-size: 18px;
line-height: 40px;
color:${props => props.color ? "#E6E6E6" : "#939393"};
`;

const Teams = ({players,isWhite}) =>{
 
  console.log(players);
  const team = isWhite? 0:1;

  if (Object.keys(players).length === 0) return;
  else return(
    <ul>
      {players[team].map((player,i) => <li key = {i}> {player} </li>)}
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
      console.log(`I am receiving ${teams} as teams`)
      let newTeams = JSON.parse(teams);
      console.log(typeof newTeams);
      console.log( newTeams);
      this.setState({ players: newTeams }); // it is this one
      console.log(this.state.players);
    });
  };

  sendRating = (rating, position) => {
    this.props.socket.emit("send_rating", rating, position, this.props.roomCode, this.props.isWhite );
  };

  changeTeam = (desiredTeam) => {
    if (desiredTeam !== this.props.isWhite) {
      this.props.socket.emit("change_team", this.props.isWhite, this.props.roomCode, this.props.username);
      this.props.setisWhite(desiredTeam)
    }
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
      if (isHost) return (<button onClick={()=>this.props.socket.emit("start_game")}>Start</button>);
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
          calcWidth={(screen) => screen.screenHeight * .9}
        />

        <div style={{ display: "flex", "flex-direction": 'column', "justify-content": "space-between", height: "100vh", width: "33vw" }}>

          <Logo style={{ width: "50%", height: "auto" }}></Logo>


          <section id="gameplay" style={{
            "display": "flex", "flex-flow": "column", "justify-content": "center", "align-items": "center", height: "70vh"
          }}>
            <div style={{ display: "flex", "flex-flow": "row wrap", "justify-content": "center", width: "50%", height: "25%" }}>
              <TeamName color="white">WHITE</TeamName>
              <TeamName>BLACK</TeamName>
              <TeamButton team="white" onClick={e => this.changeTeam(true)} >JOIN</TeamButton>
              <TeamButton onClick={e => this.changeTeam(false)} >JOIN</TeamButton>
            </div>
            <div>{startGame(this.props.host)}</div>
            <h1>{this.props.isWhite ? "White" : "Black"} Player</h1>
            <h1>{status} Turn </h1>
            <Teams players = {this.state.players} isWhite = {true}/>
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
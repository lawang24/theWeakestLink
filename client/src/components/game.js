import Chessboard from "chessboardjsx";
import { Component } from "react";

const STOCKFISH = window.STOCKFISH;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fen: "start",
      turn: false,
      team: "none",
    };
    this.sendRating = this.sendRating.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.joinTeam = this.joinTeam.bind(this);
  };


  componentDidMount() {
    this.props.socket.on("weakest_position", (weakest) => {
      this.setState({ fen: weakest });
      this.props.game.load(weakest);
    });
    this.props.socket.on("nextTurn", (whiteTurn) => {
      if (this.state.team === "white") this.setState({ turn: whiteTurn });
      if (this.state.team === "black") this.setState({ turn: !whiteTurn });
    });
  };

  sendRating = (rating, position) => {
    this.props.socket.emit("player_move", ({ rating: rating, position: position, roomCode: this.props.roomCode }));
  };

  joinTeam = (team) => {
    this.props.socket.emit("join_team", team);
    this.setState({ team: team });
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

    let team;
    switch (this.state.team) {
      case "white":
        team = "White"
        break;
      case "black":
        team = "Black"
        break;
      default:
        team = "Spectating"
    }
    
    const startGame = (isHost) => {
      if (isHost) return (<button onClick = {this.props.socket.emit("start_game")}>Start</button>);
    }

    return (
      <div style={boardsContainer} >
        <Chessboard
          id="board!"
          position={this.state.fen}
          width={320}
          onDrop={this.onDrop}
          boardStyle={boardStyle}
          orientation={this.state.team}
        />
        <button value="white" onClick={e => this.joinTeam(e.target.value, true)} >Join White Team</button>
        <button value="black" onClick={e => this.joinTeam(e.target.value, false)} >Join Black Team</button>
        <div>{startGame(this.props.host)}</div>
        <h1>{team} Player</h1>
        <h1>{status} Turn </h1>
        
      </div>
    );
  }
}

export default Game;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center"
};
const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
};
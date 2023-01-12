import io from 'socket.io-client';
import { useState, Component } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";

const STOCKFISH = window.STOCKFISH;
const socket = io.connect("http://localhost:3001");
const game = new Chess();

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fen: "start",
      turn: true,
      team: "none"
    };
    this.sendRating = this.sendRating.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.joinTeam = this.joinTeam.bind(this);
  };

  componentDidMount() {
    socket.on("weakest_position", (weakest) => {
      this.setState({ fen: weakest });
      game.load(weakest);
    });
    socket.on("play", () => {
      this.setState({ turn: true });
    });
  };

  sendRating = (rating, position) => {
    socket.emit("player_move", ({ rating: rating, position: position }));
    this.setState({ turn: false });
  };

  joinTeam = (team) => {
    socket.emit("join_team", team);
    this.setState({ team: team });
  }


  onDrop = ({ sourceSquare, targetSquare }) => {
    if (!this.state.turn) return;
    const move = game.move({ from: sourceSquare, to: targetSquare })
    if (move === null) return; // illegal move  

    // grab player proposed position and show it
    this.setState({ fen: game.fen() })

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

    return (
      <div style={boardsContainer} >
        <Chessboard
          id="board!"
          position={this.state.fen}
          width={320}
          onDrop={this.onDrop}
          boardStyle={boardStyle}
          orientation="white"
        />
        <button value="white" onClick={e => this.joinTeam(e.target.value, true)} >Join White Team</button>
        <button value="black" onClick={e => this.joinTeam(e.target.value, false)} >Join Black Team</button>
        <h1>{team} Player</h1>
        <h1>{status} Turn </h1>
      </div>
    );
  }
}

function JoinRoom({ joinRoom, roomCode, setRoomCode, newRoom }) {

  return (
    <div>
      <form onSubmit={joinRoom}>
        <h1>Join Current Lobby</h1>
        <input
          type="text"
          placeholder="Enter Code Here"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <form onSubmit={newRoom}>
        <h1>Create New Lobby</h1>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const joinRoom = () => {
    socket.emit("join_room", roomCode);
    setInRoom(true);
  }

  const newRoom = () => {
    socket.emit("new_room");
    setInRoom(true);
  }


  return (
    <div style={{ display: 'block', justifyContent: "center", alignItems: 'center', height: "100vh" }}>
      <h1>The Weakest Link</h1>
      {!isInRoom &&
        <JoinRoom joinRoom={joinRoom}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          newRoom={newRoom} />}
      {isInRoom && <Game />}
    </div>
  );
}
export default App;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center"
};
const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
};
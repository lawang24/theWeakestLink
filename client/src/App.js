import {useState} from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor
import io from 'socket.io-client';



// const [message, setMessage] = useState("");
// const [messageReceived, setMessageReceived] = useState([]);

// const sendMessage = () => {
//   socket.emit("send_message", { message });
//   setMessage("");
// };

// useEffect(() => {
//   socket.on("receive_message", (data) => {
//     setMessageReceived(data);
//   });
// }, [socket])

const game = new Chess();
const socket = io.connect("http://localhost:3001");

function App() {

  const [position, setPosition] = useState("start");

  const handleMove = ({ sourceSquare, targetSquare }) => {
    const move = game.move({ from: sourceSquare, to: targetSquare });
    // illegal move
    console.log(move);
    if (move === null) return;
    setPosition(game.fen())
  }


  return (
    <div style={boardsContainer}>
      <Chessboard
        id="board!"
        position={position}
        width={320}
        onDrop={handleMove}
        boardStyle={boardStyle}
        orientation="white"
      />
    </div>
  );
}

export default App;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center"
};
const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
};

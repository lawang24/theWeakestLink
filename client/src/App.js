import { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
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

const socket = io.connect("http://localhost:3001");

function App() {

  const [position, setPosition] = useState("start");

  const sendMove = (onDrop) => {
    socket.emit("move", onDrop)
    console.log(onDrop);
  }

  useEffect(() => {
    socket.on("receive_move", (move) => {
      if (move === null) return;
      setPosition(move);
    });
  }, [socket])

  return (
    <div style={boardsContainer}>
      <Chessboard
        id="board!"
        position={position}
        width={320}
        onDrop={sendMove}
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

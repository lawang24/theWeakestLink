import io from 'socket.io-client';
import { useState, useEffect, } from "react";
import { Chess } from "chess.js";
import Game from "./components/game"
import JoinRoom from "./components/JoinRoom"

const socket = io("http://localhost:3001");
const game = new Chess();

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [host, setHost] = useState(false);

  const joinRoom = (event) => {
    event.preventDefault();
    socket.emit("join_room", roomCode);
  };

  const newRoom = (event) => {
    event.preventDefault();
    socket.emit("create_room");
    setHost(true);
    setInRoom(true);
  };

  useEffect(() => {
    socket.on("room_joined", (data) => {
      setRoomCode(data);
      setInRoom(true);
    })
    socket.on("room_code", (data) => {
      setRoomCode(data);
    })
    socket.on("no_room", () => {
      alert("Game Not Found");
    })
  }, []);

  return (
    <div style={{ display: 'block', justifyContent: "center", alignItems: 'center', height: "100vh" }}>
      <h1>The Weakest Link</h1>
      {!isInRoom &&
        <JoinRoom
          joinRoom={joinRoom}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          newRoom={newRoom} />}
      {isInRoom && <Game
        socket={socket}
        game={game}
        roomCode={roomCode}
        host={host}
         />}
      <h1>Roomcode: {roomCode}</h1>
    </div>
  );
}
export default App;


  

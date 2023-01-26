import io from 'socket.io-client';
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import Game from "./components/game"
import JoinRoom from "./components/JoinRoom"
import './App.css'
import { Wrapper } from './StyledComponents';

const socket = io("http://localhost:3001");
const game = new Chess();

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [host, setHost] = useState(false);
  const [username, setUsername] = useState("");
  const [isHomescreen, setisHomescreen] = useState(true);
  const [isWhite, setisWhite] = useState(true);

  const isRoomValid = (event) => {
    event.preventDefault();
    socket.emit("is_room_valid?", roomCode);
  }

  const joinRoom = (event) => {
    event.preventDefault();
    socket.emit("join_room", roomCode, username);
  };

  const newRoom = (event) => {
    event.preventDefault();
    socket.emit("create_room", username);
    setHost(true);
    setInRoom(true);
  };

  useEffect(() => {
    socket.on("room_joined", (roomCode,isWhite) => {
      setRoomCode(roomCode);
      setInRoom(true);
      setisWhite(isWhite);
    })
    socket.on("room_code", (roomCode) => {
      setRoomCode(roomCode);
    })
    socket.on("no_room", () => alert("Game Not Found"));
    socket.on("yes_room", () => setisHomescreen(false));
  }, []);

  return (
    <Wrapper>
      {!isInRoom &&
        <JoinRoom
          joinRoom={joinRoom}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          newRoom={newRoom}
          username={username}
          setUsername={setUsername}
          isHomescreen={isHomescreen}
          setisHomescreen={setisHomescreen}
          isRoomValid={isRoomValid}
        />}
      {isInRoom && <Game
        socket={socket}
        game={game}
        roomCode={roomCode}
        host={host}
        isWhite={isWhite}
        setisWhite={setisWhite}
        username={username}
      />}
    </Wrapper>
  );
}
export default App;




import io from 'socket.io-client';
import { useState, useEffect } from "react";
import Game from "./pages/game"
import JoinRoom from "./pages/JoinRoom"
import './App.css'
import { Wrapper } from './StyledComponents';

const socket = io();

console.log(window.location);

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [host, setHost] = useState(false);
  const [username, setUsername] = useState("");
  const [isWhite, setisWhite] = useState(true);

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
    
  }, []);

  return (
    <Wrapper>
      {!isInRoom &&
        <JoinRoom
          socket={socket}
          joinRoom={joinRoom}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          newRoom={newRoom}
          username={username}
          setUsername={setUsername}
          host ={host}
          setHost={setHost}
        />}
      {isInRoom && <Game
        socket={socket}
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




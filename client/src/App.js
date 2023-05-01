import io from 'socket.io-client';
import { useState, useEffect } from "react";
import Game from "./pages/game"
import JoinRoom from "./pages/JoinRoom"
import './App.css'
import { Wrapper } from './StyledComponents';

const socket = io('http://localhost:3001');

function useSocketHandlers(socket, setInRoom, setRoomCode, setIsWhite) {
  useEffect(() => {
    socket.on("room_joined", (roomCode, isWhite) => {
      setRoomCode(roomCode);
      setInRoom(true);
      setIsWhite(isWhite);
    });

    socket.on("room_code", (roomCode) => {
      setRoomCode(roomCode);
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off("room_joined");
      socket.off("room_code");
    };
  }, [socket, setInRoom, setRoomCode, setIsWhite]);
}

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

  // Use the custom hook for handling socket events
  useSocketHandlers(socket, setInRoom, setRoomCode, setisWhite);

  return (
    <Wrapper>
      {isInRoom ? (
        <Game
          socket={socket}
          roomCode={roomCode}
          host={host}
          isWhite={isWhite}
          setisWhite={setisWhite}
          username={username}
        />
      ) : (
        <JoinRoom
          socket={socket}
          joinRoom={joinRoom}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          newRoom={newRoom}
          username={username}
          setUsername={setUsername}
          host={host}
          setHost={setHost}
        />
      )}

    </Wrapper>
  );
}
export default App;




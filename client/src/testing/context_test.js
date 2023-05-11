// PlayerContext.js

import { createContext, useContext, useState } from 'react';

export const PlayerContext = createContext();

export function usePlayerContext() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children , socket }) {
  const [isInRoom, setInRoom] = useState(true);
  const [roomCode, setRoomCode] = useState("TESTING");
  const [host, setHost] = useState(true);
  const [username, setUsername] = useState("DUMMY");
  const [isWhite, setIsWhite] = useState(true);

  const value = {
    socket,
    isInRoom,
    setInRoom,
    roomCode,
    setRoomCode,
    host,
    setHost,
    username,
    setUsername,
    isWhite,
    setIsWhite,
  };
  
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
  
}

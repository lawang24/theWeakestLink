// PlayerContext.js

import { createContext, useContext, useState } from 'react';

export const PlayerContext = createContext();

export function usePlayerContext() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children , socket }) {
  const [isInRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [host, setHost] = useState(false);
  const [username, setUsername] = useState("");
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

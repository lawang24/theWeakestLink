// send the client's rating to the server
export const sendRating = (socket, rating, position, roomCode, isWhite, username, target, source) => {
  socket.emit("send_rating", rating, position, roomCode, isWhite, username, target, source);
};

export const changeTeam = (socket, isWhite, roomCode, username, setIsWhite) => {
  socket.emit("change_team", isWhite, roomCode, username);
  setIsWhite((isWhite) => !isWhite);
}

export const squareStyling = ( sourceSquare, targetSquare, kingSquare ) => {
  const styling = {
    [sourceSquare]: {
      backgroundColor: "rgba(255, 255, 0, 0.4)"
    },
    [targetSquare]: {
      backgroundColor: "rgba(255, 255, 0, 0.4)"
    }
  }

  if (kingSquare) styling[kingSquare.square] = { backgroundColor: "#ff3300"}

  return styling

};
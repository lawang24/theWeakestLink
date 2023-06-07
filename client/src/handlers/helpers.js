// send the client's rating to the server
export const sendRating = (socket, rating, position, roomCode, isWhite, username) => {
    socket.emit("send_rating", rating, position, roomCode, isWhite, username);
};

export const changeTeam = (socket, isWhite, roomCode, username, setIsWhite) => {
    socket.emit("change_team", isWhite, roomCode, username);
    setIsWhite((isWhite) => !isWhite);
}
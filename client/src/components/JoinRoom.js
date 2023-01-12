import { useState } from "react";
// import {} from "socket.io-client";

function JoinRoom(socket, setInRoom) {

    const [roomCode, setRoomCode] = useState("")

    const joinRoom = () => {
        socket.emit("join_room", roomCode);
        setInRoom(false);
    }

    return (

        <form onSubmit={joinRoom}>
            <h1>Enter Room Code</h1>
            <input
                type="text"
                placeholder="Enter Code Here"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
    );
};
export default JoinRoom;
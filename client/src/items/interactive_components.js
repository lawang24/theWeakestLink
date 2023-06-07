import { StartGame, ChangeTeam } from "../styled_components/gameComponents"
import { changeTeam } from "../handlers/helpers";

const StartGameButton = ({ socket, roomCode }) => {
    return (
        <StartGame onClick={() => {
            socket.emit("start_game", roomCode)
        }}>START </StartGame>
    );
};


export const GameControls = ( {socket, roomCode, host, isWhite, username, setIsWhite} ) => {
    
    return (
        <div style={{ display: "flex", justifyContent: "space-evenly", width: "70%", height: "9%" }}>
            {host && <StartGameButton socket={socket} roomCode={roomCode} />}
            <ChangeTeam team="white" onClick={(e) => changeTeam(socket, isWhite, roomCode, username, setIsWhite )} >CHANGE TEAM</ChangeTeam>
        </div>
    )
};

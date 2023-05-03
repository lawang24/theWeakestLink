import styled from 'styled-components';
import { Logo, Wrapper } from "../StyledComponents";
import { useState, useEffect } from 'react';
import { MainLobbyPortal } from "../items/mainLobbyPortal";
import { UsernamePortal } from "../items/usernamePortal";
import { usePlayerContext } from '../contexts/PlayerContext';

function roomListeners(socket, setisHomescreen) {

  socket.on("yes_room", () => {
    setisHomescreen(false);
  });

  socket.on("no_room", () => {
    alert("Game Not Found");
    console.log("alert!");
  });

};

function JoinRoom() {
  const [isHomescreen, setisHomescreen] = useState(true);

  const { socket,
    setInRoom,
    roomCode,
    setRoomCode,
    setIsWhite,
  } = usePlayerContext();

  // sets up listeners for room handling
  useEffect(() => {
    roomListeners(socket, setisHomescreen);
    // Clean up event listeners on unmount
    return () => {
      socket.removeAllListeners();
    };
  }, [socket, setInRoom, setRoomCode, setIsWhite, setisHomescreen]);

  const isRoomValid = (event) => {
    event.preventDefault();
    socket.emit("is_room_valid?", roomCode);
  }

  return (
    <Wrapper>
      <Logo style={{ height: "20%", width: "auto" }}></Logo>
      <Description>A TEAM-BASED CHESS GAME</Description>
      {isHomescreen ?
        <MainLobbyPortal isRoomValid={isRoomValid} setisHomescreen={setisHomescreen} /> :
        <UsernamePortal setisHomescreen={setisHomescreen} />
      }
    </Wrapper>
  );
};

export default JoinRoom;

const Description = styled.h2`
font-family: 'Montserrat';
font-style: normal;
font-weight:700;
font-size: 22px;
line-height: 40px;
color:#FFFFFF;
margin-bottom:30px;
margin-top:-10px;
`;


// const HR = styled.hr`
// width:35%;
// height:0;
// transform: rotate(90deg);
// border: 2px solid #565656;
// align-self:center;
// margin:0 -17%;
// `;
import styled from 'styled-components';
import { Logo, Wrapper} from "../StyledComponents";
import { useState, useEffect } from 'react';
import {MainLobbyPortal} from "../items/mainLobbyPortal";
import {UsernamePortal} from "../items/usernamePortal";

function JoinRoom({ socket, joinRoom, roomCode, setRoomCode, newRoom, username, setUsername, host, setHost }) {
  const [isHomescreen, setisHomescreen] = useState(true);
  
  const isRoomValid = (event) => {
    event.preventDefault();
    socket.emit("is_room_valid?", roomCode);
  }
  
  useEffect(() => {
    socket.on("yes_room", () => setisHomescreen(false));
    socket.on("no_room", () => {
      alert("Game Not Found") 
      console.log("alert!")
    });
  }, [socket])

  return (
    <Wrapper>
      <Logo style={{ height: "20%", width: "auto" }}></Logo>
      <Description>A TEAM-BASED CHESS GAME</Description>
      {isHomescreen ?
        <MainLobbyPortal roomCode={roomCode} setRoomCode={setRoomCode} setHost={setHost}
          setisHomescreen={setisHomescreen} isRoomValid={isRoomValid} /> :
        <UsernamePortal joinRoom={joinRoom} newRoom={newRoom} host={host}
          setHost={setHost} setisHomescreen={setisHomescreen}
          username={username} setUsername={setUsername} />
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
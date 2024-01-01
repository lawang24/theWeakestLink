import styled from 'styled-components';
import { Logo, Wrapper } from "../styled_components";
import { useState, useEffect } from 'react';
import { MainLobbyPortal } from "../sub_pages/mainLobbyPortal";
import { UsernamePortal } from "../sub_pages/usernamePortal";
import { usePlayerContext } from '../contexts/PlayerContext';
import { roomListeners } from '../handlers/socket_handlers';
import { InstructionButton } from '../items/interactive_components';

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
    <JoinRoomWrapper>
      <Logo style={{ height: "20%", width: "auto" }}></Logo>
      <Description>A TEAM-BASED CHESS GAME</Description>
      {isHomescreen ?
        <MainLobbyPortal isRoomValid={isRoomValid} setisHomescreen={setisHomescreen} /> :
        <UsernamePortal setisHomescreen={setisHomescreen} />
      }
      <InstructionButton />
    </JoinRoomWrapper>
  );
};

export default JoinRoom;

const JoinRoomWrapper = styled(Wrapper)`
  justify-content:center;
`;

const Description = styled.h2`
font-family: 'Montserrat';
font-style: normal;
font-weight:700;
font-size: 22px;
line-height: 40px;
color:#FFFFFF;
margin-bottom:30px;
margin-top:-10px;
text-align: center;
`;


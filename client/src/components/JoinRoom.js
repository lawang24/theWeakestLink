import styled from 'styled-components';
import { Logo, Wrapper, Button, Arrow } from "../StyledComponents"
import { useState } from 'react';

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

const ControlPanelStyle = styled.div`
display:flex;
flex-direction:row;
justify-content:space-evenly;
background-color: #868BAC;
height:28vh;
width:35vw;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 15px;
position:relative;
`;

const Form = styled.form`
display:flex;
flex-direction:column;
width:32%;
justify-content:center;
align-items:center;
`;

const RoomCode = styled.input`
background:#E5E5E5;
height:20%;
width:100%;
padding: 0;
margin-bottom:5%;
border-width: 0;
font-family: 'Montserrat';
font-style: normal;
font-weight:700;
font-size:18px;
text-align:center;
`;
const JoinButton = styled(Button)`
height:20%;
`;
const HR = styled.hr`
width:35%;
height:0;
transform: rotate(90deg);
border: 2px solid #565656;
align-self:center;
margin:0 -17%;
`;

const NewRoom = styled(Button)`
height:42%;
`;

const BackButton = styled.form`
display:flex;
justify-content: center;
position: absolute;
top: 7%;
left: 0;
height:20%;
width:20%;.
`;


const UsernamePortal = ({ isCreatingRoom, username, setUsername, joinRoom, newRoom,setisCreatingRoom,setisHomescreen }) => {
  const handleSubmit = isCreatingRoom ? newRoom : joinRoom;
  return (
    <ControlPanelStyle>
      <BackButton onSubmit={()=>{
        setisCreatingRoom(false); setisHomescreen(true)}
      }>
        <Arrow style={{ transform: "rotate(180deg)" }} />
      </BackButton>
      <Form onSubmit={handleSubmit}>
        <RoomCode
          type="text"
          placeholder="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <JoinButton type="submit">ENTER</JoinButton>
      </Form>
    </ControlPanelStyle>
  )
};

const MainLobbyPortal = ({ roomCode, setRoomCode, setisCreatingRoom, setisHomescreen, isRoomValid }) => {

  return (
    <ControlPanelStyle>
      <Form onSubmit={isRoomValid}>
        <RoomCode
          type="text"
          placeholder="ROOM CODE"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <JoinButton type="submit">JOIN ROOM</JoinButton>
      </Form>
      <HR></HR>
      <Form onSubmit={() => {
        setisCreatingRoom(true); setisHomescreen(false);
      }}>
        <NewRoom type="submit">NEW ROOM</NewRoom>
      </Form>
    </ControlPanelStyle>

  )
}

function JoinRoom({ joinRoom, roomCode, setRoomCode, newRoom, username, setUsername, isHomescreen, setisHomescreen, isRoomValid }) {
  const [isCreatingRoom, setisCreatingRoom] = useState(false);
  return (
    <Wrapper>
      <Logo style={{ height: "20%", width: "auto" }}></Logo>
      <Description>A TEAM-BASED CHESS GAME</Description>
      {isHomescreen ?
        <MainLobbyPortal roomCode={roomCode} setRoomCode={setRoomCode} setisCreatingRoom={setisCreatingRoom}
         setisHomescreen={setisHomescreen} isRoomValid={isRoomValid} /> :
        <UsernamePortal joinRoom={joinRoom} newRoom={newRoom} isCreatingRoom={isCreatingRoom} 
        setisCreatingRoom={setisCreatingRoom} setisHomescreen={setisHomescreen}
        username={username} setUsername={setUsername} />
      }
    </Wrapper>
  );
};

export default JoinRoom;
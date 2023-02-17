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

const ControlPanelWrapper = styled.div`
display:flex;
flex-direction:row;
justify-content:space-between;
height:25vh;
width:39vw;
border-radius: 15px;
position:relative;
`;

const Form = styled.form`
display:flex;
flex-direction:column;
width:68%;
height:100%;
justify-content:center;
align-items:center;
`;

const RoomCode = styled.input`
background:#E5E5E5;
height:26%;
width:100%;
padding: 0;
margin-bottom:10%;
border-width: 0;
font-family: 'Montserrat';
font-style: normal;
font-weight:700;
font-size:18px;
text-align:center;
`;
const JoinButton = styled(Button)`
height:26%;
border-radius:0;
`;
// const HR = styled.hr`
// width:35%;
// height:0;
// transform: rotate(90deg);
// border: 2px solid #565656;
// align-self:center;
// margin:0 -17%;
// `;

const NewRoom = styled(Button)`
height:47%;
border-radius:0;
`;


const ControlPanelButton = styled.div`
display:flex;
background-color: #868BAC;
width:46%;
justify-content:center;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 15px;
`;

const UsernamePanel = styled(ControlPanelButton)`
position:relative;
width:24vw;
height:25vh;
justify-content:space-between;
flex-direction:row;
align-items:center;
`
const BackButton = styled.form`
position:absolute;
left:-20%;
display:flex;
justify-content: center;
height:15%;
width:auto.
`;

const UsernameForm = styled(Form)`
width:56%;
margin:0 auto;
`

const UsernameCode = styled(RoomCode)`

`


const UsernamePortal = ({ isCreatingRoom, username, setUsername, joinRoom, newRoom, setisCreatingRoom, setisHomescreen }) => {
  const handleSubmit = isCreatingRoom ? newRoom : joinRoom;
  return (
    <UsernamePanel>
      <BackButton onSubmit={() => {
        setisCreatingRoom(false); setisHomescreen(true)
      }
      }>
        <Arrow style={{}} />
      </BackButton>
      <UsernameForm onSubmit={handleSubmit}>
        <UsernameCode
          type="text"
          placeholder="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <JoinButton type="submit">ENTER</JoinButton>
      </UsernameForm>
    </UsernamePanel>
  )
};

const MainLobbyPortal = ({ roomCode, setRoomCode, setisCreatingRoom, setisHomescreen, isRoomValid }) => {

  return (
    <ControlPanelWrapper>
      <ControlPanelButton>
        <Form onSubmit={isRoomValid}>
          <RoomCode
            type="text"
            placeholder="ROOM CODE"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <JoinButton type="submit">JOIN ROOM</JoinButton>
        </Form>
      </ControlPanelButton>
      {/* <HR></HR> */}
      <ControlPanelButton>
        <Form onSubmit={() => {
          setisCreatingRoom(true); setisHomescreen(false);
        }}>
          <NewRoom type="submit">NEW ROOM</NewRoom>
        </Form>
      </ControlPanelButton>
    </ControlPanelWrapper>
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
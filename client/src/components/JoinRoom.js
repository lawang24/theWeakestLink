import styled from 'styled-components';
import logo from '../logo.png';
import {Wrapper, Button} from "../StyledComponents"


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
 

const ControlPanel = styled.div`
display:flex;
flex-direction:row;
justify-content:space-evenly;
background-color: #868BAC;
height:28vh;
width:35vw;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 15px;
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
const HR= styled.hr`
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



const Logo = () => <img src={logo} alt="logo" />

function JoinRoom({ joinRoom, roomCode, setRoomCode, newRoom }) {

  return (
    <Wrapper>
      <div>
        <Logo></Logo>
        <Description>A TEAM-BASED CHESS GAME</Description>
      </div>
      <ControlPanel>
        <Form onSubmit={joinRoom}>
          <RoomCode
            type="text"
            placeholder="Enter Code Here"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <JoinButton type="submit">JOIN ROOM</JoinButton>
        </Form>
        <HR></HR>
        <Form onSubmit={newRoom}>
          <NewRoom type="submit">NEW ROOM</NewRoom>
        </Form>
      </ControlPanel>
    </Wrapper>
  );
};

export default JoinRoom;
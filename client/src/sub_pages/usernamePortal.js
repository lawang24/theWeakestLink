import styled from "styled-components";
import { Arrow, Button } from "../styled_components";
import { usePlayerContext } from '../contexts/PlayerContext';

export const UsernamePortal = ({ setisHomescreen }) => {

  const { socket,
    setInRoom,
    roomCode,
    host,
    setHost,
    username,
    setUsername,
  } = usePlayerContext();

  const joinRoom = () => {
    socket.emit("join_room", roomCode, username);
    setInRoom(true);
  }

  const newRoom = () => {
    socket.emit("create_room", username);
    setHost(true);
    setInRoom(true);
  }

  // decides whether the SUBMIT button creates or joins a room
  function handleSubmit(event) {
    event.preventDefault();
    host ? newRoom(event) : joinRoom(event);
  }

  return (
    <UsernamePanel>
      <BackButton onClick={() => {
        setHost(false); setisHomescreen(true)
      }
      }>
        <Arrow />
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

export default UsernamePortal;

const UsernamePanel = styled.div`
display:flex;
background-color: #868BAC;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 15px;
position:relative;
width:24vw;
height:25vh;
justify-content:space-between;
flex-direction:row;
align-items:center;

@media screen and (width<600px){
  flex-direction:column;
  width: 90%;
  height: 30%;
}
`;

const BackButton = styled.form`
position:absolute;
left:-20%;
display:flex;
justify-content: center;
height:15%;
width:auto;

@media screen and (width<600px){
  left: 5%;
  top: 42.5%;
}
`;

const UsernameForm = styled.form`
display:flex;
flex-direction:column;
height:100%;
justify-content:center;
align-items:center;
width:56%;
margin:0 auto;
`

const UsernameCode = styled.input`
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
`

const JoinButton = styled(Button)`
height:26%;
border-radius:0;
`;
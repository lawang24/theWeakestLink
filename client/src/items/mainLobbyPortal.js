import styled from "styled-components";
import { Button } from "../StyledComponents";

export const MainLobbyPortal = ({ roomCode, setRoomCode, setHost, setisHomescreen, isRoomValid }) => {

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
            setHost(true); setisHomescreen(false);
          }}>
            <NewRoom type="submit">NEW ROOM</NewRoom>
          </Form>
        </ControlPanelButton>
      </ControlPanelWrapper>
    )
  }

  export default MainLobbyPortal;

const ControlPanelWrapper = styled.div`
display:flex;
flex-direction:row;
justify-content:space-between;
height:25vh;
width:39vw;
border-radius: 15px;
position:relative;
`;

const ControlPanelButton = styled.div`
display:flex;
background-color: #868BAC;
width:46%;
justify-content:center;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 15px;
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

const NewRoom = styled(Button)`
height:47%;
border-radius:0;
`;


import styled from "styled-components";
import {Arrow,Button} from "../StyledComponents";

export const UsernamePortal = ({ host, username, setUsername, joinRoom, newRoom, setHost, setisHomescreen }) => {
  const handleSubmit = host ? newRoom : joinRoom;
  return (
    <UsernamePanel>
      <BackButton onSubmit={() => {
        setHost(false); setisHomescreen(true)
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
`;

const BackButton = styled.form`
position:absolute;
left:-20%;
display:flex;
justify-content: center;
height:15%;
width:auto.
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
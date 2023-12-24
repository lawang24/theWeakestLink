import styled from 'styled-components';
import { Wrapper, Button } from "./index.js";

export const GameWrapper = styled(Wrapper)`
flex-flow:row-reverse;
justify-content:space-evenly;
max-width: 1800px;
width: 100vw;
`;

export const GameplaySection = styled.section`
display: flex;
flex-flow: column;
justify-content: start;
align-items: center;
height: 70vh;
`;

export const RoomCode = styled(Button)`
width:34%;
height:56px;
background:#868BAC;
pointer-events:none;
`;

export const ChangeTeam = styled(Button)`
height:100%;
width: 30%;
border: 3px solid rgba(151, 154, 175, 0.93);
background:${props => props.team ? "#E6E6E6" : "#939393"};
color:${props => props.team ? "#979AAF" : "#FFFFFF"};
margin:0;
font-size:1vw;
`;

export const TeamName = styled.h2`
display:flex;
height:fit-content;
width:50%;
justify-content:center;
align-items:center;
margin-bottom:5%;
font-family: 'Montserrat';
font-style: normal;
font-weight: 700;
font-size: 18px;
line-height: 40px;
color:${props => props.color ? "#E6E6E6" : "#939393"};
`;

export const TeamSection = styled.section`
display: flex;
flex-direction: column;
width: 50%; 
align-items: center;
justify-content: start;
height: fit-content;
`;

export const StartGame = styled(Button)`
width: 30%;
background:#868BAC;
`;

export const NonChessboard = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-between;
height: 100vh;
width: 33vw;
`;





// you hve the style the list items, not the actual custom component
// listStyleImage: url(${tower});
// listStyleType:"square";
// listStylePosition:"inside";
import styled from 'styled-components';
import {Wrapper,Button} from "./index.js";

export const GameWrapper = styled(Wrapper)`
flex-flow:row-reverse;
justify-content:space-evenly;
`;

export const RoomCode = styled(Button)`
width:34%;
height:56px;
margin-left:10%;
background:#868BAC;
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
height:50%;
width:50%;
justify-content:center;
align-items:center;
margin:0;
font-family: 'Montserrat';
font-style: normal;
font-weight: 700;
font-size: 18px;
line-height: 40px;
color:${props => props.color ? "#E6E6E6" : "#939393"};
`;

export const StartGame= styled(Button)`
width: 30%;
background:#868BAC;
`;



// you hve the style the list items, not the actual custom component
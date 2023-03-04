import styled from "styled-components";
import { Tower } from "../StyledComponents/gameComponents"

export const Teams = ({ players, isWhite }) => {
  const team = isWhite ? 0 : 1;

  if (Object.keys(players).length === 0) return;
  else return (
    <Members>
      {players[team].map((player, i) => {
        return (
          <div style={{ display: "flex", width: "100%", justifyContent: "start", height: "fit-content", marginBottom: "10px" }}>
            <Tower isWhite={isWhite} style={{ height: "22px", paddingRight: "8px" }} />
            <li style={{ color: "#FFFFFF", height: "fit-content" }} key={player}> {player} </li>
          </div>
        )
      })}
    </Members>
  )
}

export const Ratings = ({ ratings }) => {
  if (ratings.length === 0) return;
  else return (
    <RatingList>
      {ratings.map((x, i) => {
        return (
            <RatingNumber> {x} </RatingNumber>
        )
      })}
    </RatingList>
  )
}

const Members = styled.ul`
display: flex;
flex-flow: column;
height: fit-content;
width: fit-content;
list-style-type:none;
padding:0;
margin:0;
margin-bottom:15px;
font-family: 'Montserrat';
font-style: normal;
font-weight: 600;
font-size: 18px;
`;

const RatingList = styled(Members)`
flex-direction: row;
justify-content: center;
width:100%;
`;

const RatingNumber = styled.li`
color: #FFFFFF;
height: fit-content;
margin: 0 7px;

`
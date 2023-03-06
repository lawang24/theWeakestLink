import styled from "styled-components";
import { Tower } from "../StyledComponents/gameComponents"
import { useEffect } from "react";

export const Teams = ({ players, isWhite, scorecard, gameStarted }) => {
  const team = isWhite ? 0 : 1;

  const Icon = ({index}) => {
    if (!gameStarted) return <Tower isWhite={isWhite} style={{ height: "22px", paddingRight: "8px" }} />
    else return <ScoreNumber>{scorecard[team][index]}</ScoreNumber>
  }

  if (Object.keys(players).length === 0) return;
  else return (
    <Members>
      {players[team].map((player, index) => {
        return (
          <div style={{ display: "flex", width: "100%", justifyContent: "start", height: "fit-content", marginBottom: "10px" }}>
            <Icon index= {index} />
            <li style={{ color: "#FFFFFF", height: "fit-content" }} key={player}> {player} </li>
          </div> 
        )
      })}
    </Members>
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
const ScoreNumber = styled.li`
color: #FFFFFF;
height: fit-content;
margin-right: 10px;
`

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

export function CountdownTimer({ totalSeconds, increment, isRunning }) {

  useEffect(() => {

      let interval = null;

      if (isRunning && totalSeconds > 0) {
          interval = setInterval(() => {
              increment();
          }, 1000);
      }

      return () => clearInterval(interval);

  }, [isRunning, totalSeconds, increment]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
      <Digits>
          <span>{minutes}</span>:<span>{seconds}</span>
      </Digits>
  )
}

const Digits = styled.div`
display:flex;
justify-content:center;
align-items: center;
font-family: 'Montserrat';
font-style: normal;
font-weight:700;
font-size:18px;
text-align:center;
height:100%;
width:50%;
fontSize: 50px;
background:#FFFFFF
`



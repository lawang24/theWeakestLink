import styled from "styled-components";
import { useState, useEffect } from "react";
import whiteTower from "../images/tower_white.png"
import blackTower from "../images/tower_black.png"

const Tower = (props) => {
  if (props.isWhite) return <img style={props.style} src={whiteTower} alt="logo" />
  else return <img style={props.style} src={blackTower} alt="logo" />
}

export const Teams = ({ team, isWhite, gameStarted }) => {

  if (!team) return;

  const Icon = ({ player }) => {
    if (!gameStarted) return <Tower isWhite={isWhite} style={{ height: "22px", paddingRight: "8px" }} />
    return <ScoreNumber> {player._scorecard} </ScoreNumber>
  }

  return (
    <Members>
      {Array.from(team, ([username, information]) => (
        <div style={{ display: "flex", width: "100%", justifyContent: "start", height: "fit-content", marginBottom: "10px" }} key={username}>
          <Icon player={information} />
          <li style={{ color: "#FFFFFF", height: "fit-content" }}> {username} </li>
        </div>
      ))}
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

export const Ratings = ({ team, gameStarted }) => {
  if (!gameStarted) return;
  else return (
    <RatingList>
      StockFish Evals:
      {Array.from(team, ([username, information]) => {
        return (
          <RatingNumber> {information._move_rating} </RatingNumber>
        )
      })}
    </RatingList>
  )
}

const RatingList = styled(Members)`
color: #FFFFFF;
flex-direction: row;
justify-content: center;
width:100%;
`;

const RatingNumber = styled.li`
height: fit-content;
margin: 0 7px;
`

export function CountdownTimer({ totalSeconds, isRunning }) {

  const [remainingTime, setRemainingTime] = useState(totalSeconds);

  useEffect(() => {
    let interval = null;

    if (isRunning && totalSeconds > 0) {
      let end_time = new Date().getTime() + totalSeconds * 1000;

      interval = setInterval(() => {
        const timeLeft = Math.floor((end_time - new Date().getTime()) / 1000);
        setRemainingTime(timeLeft > 0 ? timeLeft : 0);
      }, 1000);
    }

    return () => clearInterval(interval);

  }, [isRunning, totalSeconds]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Digits>
      <span>{minutes}</span>:<span>{seconds < 10 ? `0${seconds}` : seconds}</span>
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



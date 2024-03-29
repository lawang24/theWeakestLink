import { useState, useEffect } from "react";
import styled from "styled-components";

export function MatchClock({ whiteTime, blackTime, whiteTurn, gameStarted }) {

  return (<MatchClockWrapper>
    <CountdownTimer totalSeconds={whiteTime} isRunning={(whiteTurn && gameStarted)} />
    <CountdownTimer totalSeconds={blackTime} isRunning={(!whiteTurn && gameStarted)} />
  </MatchClockWrapper >
  )
}

export function CountdownTimer({ totalSeconds, isRunning }) {

  const [remainingTime, setRemainingTime] = useState(totalSeconds);

  useEffect(() => {
    let interval = null;

    setRemainingTime(totalSeconds);

    if (isRunning) {
      let end_time = new Date().getTime() + totalSeconds * 1000;

      interval = setInterval(() => {
        const timeLeft = Math.ceil((end_time - new Date().getTime()) / 1000);
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
  background:#FFFFFF;
  `

const MatchClockWrapper = styled.div`
  display:flex;
  height: 56px;
  width: 130px;
  justify-content: "center";
  align-items: "center";
`

// div style={{ display: "flex", height: "8%", width: "30%", justifyContent: "center", alignItems: "center" }}
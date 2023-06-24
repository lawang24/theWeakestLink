import { useState, useEffect } from "react";
import styled from "styled-components";

export function CountdownTimer({ totalSeconds, isRunning }) {

    // console.log("totalseconds:" + totalSeconds);
    const [remainingTime, setRemainingTime] = useState(totalSeconds);
  
    useEffect(() => {
      let interval = null;
  
      setRemainingTime(totalSeconds);
  
      if (isRunning) {
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
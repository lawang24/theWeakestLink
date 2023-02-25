import styled from 'styled-components';
import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';


export function Timer({ sec, turn }) {
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + sec); // 10 minutes timer

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, autoStart: false, onExpire: () => console.warn('onExpire called') });

  useEffect(() => {
    turn ? start() : pause();
  }, [turn, pause, start]);

  return (
    <Digits>
      <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
    </Digits>
  );
}

/* <button onClick={() => {
        // Restarts to 5 minutes timer
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        restart(time,false)
      }}>Restart</button> */

export default Timer;

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


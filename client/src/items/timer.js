import styled from 'styled-components';
import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

export function Timer({ sec , turn }) 
{
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
  } = useTimer({ expiryTimestamp, autoStart:false, onExpire: () => console.warn('onExpire called') });

  useEffect(()=> {
    console.log(turn)
    turn ? start() : pause();
  },[turn,pause,start]);
  
  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '100px'}}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      {/* <button onClick={() => {
        // Restarts to 5 minutes timer
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        restart(time,false)
      }}>Restart</button> */}
    </div>
  );
}

export default Timer;
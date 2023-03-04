import { useEffect } from 'react';
import styled from "styled-components";

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

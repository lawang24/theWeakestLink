import { usePlayerContext } from "../contexts/PlayerContext";
import { useState } from "react";
import styled from "styled-components";

export const TimeFormat = () => {
    const [timeFormat, setTimeFormat] = useState(0);

    const { socket, roomCode } = usePlayerContext();

    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit("set_time_format", roomCode, timeFormat * 60);
    }

    return (
        <form onSubmit={handleSubmit}>
            <TimeFormatWrapper>
                <h2>Duration (Minutes)</h2>
                <TimeFormatInput onChange={e => setTimeFormat(e.target.value)} />
            </TimeFormatWrapper>
            <SettingsSubmitButton type="submit">Change Time Format</SettingsSubmitButton>
        </form>
    )
}

export default TimeFormat


const TimeFormatWrapper = styled.div`
    display:flex;
    gap: 15px;
    align-items: center;
    font-family: 'Montserrat';
`

const SettingsSubmitButton = styled.button`
    font-size: 1rem;
    padding: 10px 15px;
    cursor: pointer;
`

const TimeFormatInput = styled.input`
    background:#E5E5E5;
    width:100px;
    padding: 5px 0;
    border-width: 1px;
    border-radius: 5px;
    font-size: 1.5rem;
    font-weight:700;
    text-align:center;
`;
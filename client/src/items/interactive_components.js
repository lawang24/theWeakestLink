import { StartGame, ChangeTeam } from "../styled_components/gameComponents"
import { changeTeam } from "../handlers/helpers";
import { useState } from "react";
import styled, {keyframes, css} from "styled-components";
import Popup from 'reactjs-popup';

const StartGameButton = ({ socket, roomCode }) => {
    return (
        <StartGame onClick={() => {
            socket.emit("start_game", roomCode)
        }}>START </StartGame>
    );
};


export const GameControls = ({ socket, roomCode, host, isWhite, username, setIsWhite }) => {

    return (
        <div style={{ display: "flex", justifyContent: "space-evenly", width: "70%", height: "9%" }}>
            {host && <StartGameButton socket={socket} roomCode={roomCode} />}
            <ChangeTeam team="white" onClick={(e) => changeTeam(socket, isWhite, roomCode, username, setIsWhite)} >CHANGE TEAM</ChangeTeam>
        </div>
    )
};

export const InstructionButton = () => {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
        <>
            <Button onClick={() => setOpen(o => !o)}> How To Play </Button>
            <StyledPopup open={open} modal onClose={closeModal}>
                <Modal>
                    <ExitInstruction className="close" onClick={closeModal}>&times;</ExitInstruction>
                    <p>The rules are simple and similar to chess except for a few rules: </p>
                    <p>1. Split into two teams.</p>
                    <p>2. On your turn, every player on the team will vote for a move.</p>
                    <p>3. The worst move &#40;~Stockfish&#41; is brought forth to represent the team. </p>
                    <p> Have fun! </p>
                </Modal>
            </StyledPopup>
        </>
    )
}
const openAnimation = keyframes` {
    0% {
      transform: scale(1) translateY(0px);
      opacity: 0;
      box-shadow: 0 0 0 rgba(241, 241, 241, 0);
    }
    1% {
      transform: scale(0.96) translateY(10px);
      opacity: 0;
      box-shadow: 0 0 0 rgba(241, 241, 241, 0);
    }
    100% {
      transform: scale(1) translateY(0px);
      opacity: 1;
      box-shadow: 0 0 500px rgba(241, 241, 241, 0);
    }
  }
  ` 
const StyledPopup = styled(Popup)`
    &-overlay{
        background: rgba(0, 0, 0, 0.5);
    }
    &-content{
        display:flex;
        justify-content:center;
        align-items:center;
        margin: 0;
        border-radius: 10px;
        background: #E5E5E5;
        height: 50%;  
        width: 50%;
        padding: 5px;
        text-align: center;
        font-family: 'Montserrat';
        font-style: normal;
        font-weight:700;
        font-size: 18px;
        white-space: pre-line;
        animation: ${openAnimation} 0.3s cubic-bezier(0.38, 0.1, 0.36, 0.9) forwards;
    }
`;

const Button = styled.button`
height: 'fit-content';
font-family: 'Montserrat';
font-style: normal;
font-weight:700;
font-size: 20px;
color:#FFFFFF;
background-color: rgb(38,40,56,0.93);
border: rgb(38,40,56,0.93);
text-decoration-line: underline;
text-decoration-thickness: 1.5px;
text-decoration-skip-ink: none;
text-underline-offset: .2em;
cursor: pointer;
margin-top: 1%;
`
const ExitInstruction = styled.a`
    position: absolute;
    top: 0px;
    right: 0px;
`
const Modal = styled.div`
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
    height:100%
`
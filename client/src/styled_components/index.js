import styled, {keyframes, css} from "styled-components";
import logo from '../images/logo.png';
import gear from '../images/settingGear.png';
// import arrow from '../images/arrow.png';
import backArrow from '../images/backArrow.png';
import Popup from 'reactjs-popup';
import { useState } from "react";

export const Wrapper = styled.div`
display:flex;
flex-direction: column;
align-items:center;
justify-content:center;
margin:0;
padding:0;
background-color: rgb(38,40,56,0.93);
height:100vh;
width:100vw;
`;

export const Button = styled.button`
background:#565656;
color:#FFFFFF;
font-family: 'Montserrat';
border:none;
width:100%;
font-size:18px;
border-radius: 3px;
cursor: pointer;
&:hover{
    background-color: #ACACAC;
    transition-duration: 0.3s;
}
`;

export const Logo = (props) => <img style={props.style} src={logo} alt="logo" />
 
const SettingButtonImage = (props) => <img style = {props.style} src={gear} alt="settings" />

export const SettingButton = () => {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
        <>
            <Button onClick={() => setOpen(o => !o)}> 
            <SettingButtonImage/>
            </Button>
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


export const Arrow = (props) => <input type="image" style={props.style} src={backArrow} alt="backarrow" />

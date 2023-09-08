import styled, { keyframes } from "styled-components";
import { useState } from "react";
import Popup from 'reactjs-popup';
import gear from '../images/settingGear.png';


const SettingButtonImage = (props) => <img style={props.style} src={gear} alt="settings" />

export const SettingButton = ({setWhiteTime, setBlackTime}) => {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
        <>
            <form onClick={() => setOpen(o => !o)}>
                <SettingButtonImage style={{ width: "100%", height: "100%" ,cursor: "pointer"}} />
            </form>
            <StyledPopup open={open} modal onClose={closeModal}>
                <Modal>
                    <ExitInstruction className="close" onClick={closeModal}>&times;</ExitInstruction>
                    <TimeFormat setWhiteTime = {setWhiteTime} setBlackTime = {setBlackTime}/>
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



const TimeFormat = ({setWhiteTime, setBlackTime, whiteTime}) =>{
    const [timeFormat, setTimeFormat] = useState(whiteTime);

    const handleSubmit = (event) => {
        event.preventDefault();
        setWhiteTime(timeFormat)
        setBlackTime(timeFormat)
    }

    return(
        <form onSubmit={handleSubmit}>
        <TimeFormatInput value = {whiteTime} onChange={e => setTimeFormat(e.target.value)} />
        <button type = "submit">Change Time Format</button>
        </form>
    )

}

const TimeFormatInput = styled.input`
background:#E5E5E5;
height:26%;
width:100%;
padding: 0;
margin-bottom:10%;
border-width: 0;
font-family: 'Montserrat';
font-style: normal;
font-weight:700;
font-size:18px;
text-align:center;
`;
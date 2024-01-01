import logo from '../images/logo.png';
// import arrow from '../images/arrow.png';
import backArrow from '../images/backArrow.png';
import styled from "styled-components";

export const Wrapper = styled.div`
display:flex;
flex-direction: column;
align-items:center;
justify-content:start;
margin:0;
padding:0;
background-color: rgb(38,40,56,0.93);
height:100dvh;
width:100dvw;
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
export const Logo = (props) => <LogoWrapper src={logo} alt="logo" />

const LogoWrapper = styled.img`
 grid-area: logo;
 height: auto;
 width: 100%;
 max-width: 200px;
`

export const Arrow = (props) => <input type="image" style={props.style} src={backArrow} alt="backarrow" />

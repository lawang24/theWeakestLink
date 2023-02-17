import styled from 'styled-components';
import logo from '../images/logo.png';
import gear from '../images/settingGear.png';
// import arrow from '../images/arrow.png';
import backArrow from '../images/backArrow.png';

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
`;

export const Logo = (props) => <img style = {props.style} src={logo} alt="logo" />
export const SettingButton = (props) => <img style = {props.style} src={gear} alt="settings" />
export const Arrow =(props) =><input type="image" style={props.style} src={backArrow} alt="backarrow"/>

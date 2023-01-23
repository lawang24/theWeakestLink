import styled from 'styled-components';
import logo from '../logo.png';
import gear from '../settingGear.png';


export const Wrapper = styled.div`
display:flex;
background-color: rgb(38,40,56,0.93);
height:100vh;
flex-direction: column;
align-items:center;
justify-content:center;
`;

export const Button = styled.button`
background:#565656;
color:#FFFFFF;
font-family: 'Montserrat';
border:none;
width:100%;
font-size:18px;
border-radius: 3px;
`;

export const Logo = (props) => <img style = {props.style} src={logo} alt="logo" />
export const SettingButton = (props) => <img style = {props.style} src={gear} alt="settings" />

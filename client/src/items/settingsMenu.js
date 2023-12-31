import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TimeFormat from './timeFormatter';
import GearImage from '../images/settingGear.png'

const DropdownContainer = styled.div`
    display: inline-block;
    position: relative;
`;

const DropdownButton = styled.button`
    background: url(${GearImage}) no-repeat center/cover transparent;
    height: 56px;
    width: 56px;  
    border: 0;
    cursor: pointer;
`;

const DropdownContent = styled.div`
    display: ${props => props.isVisible ? 'block' : 'none'};
    position: absolute;
    bottom: 110%; /* Positions the dropdown above the button */
    left: 0;
    background-color: #f9f9f9;
    min-width: 160px;
    z-index: 1000;
    border-radius: 10px;
    padding: 20px;

    @media screen and (width<=600px){
        top: 110%;
        bottom: auto;
    }
    
    /* Additional styling as needed */
`;

const Settings = () => {
    const [isVisible, setIsVisible] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsVisible(prevIsVisible => !prevIsVisible);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <DropdownContainer ref={dropdownRef}>
            <DropdownButton onClick={toggleDropdown}/>
            <DropdownContent isVisible={isVisible}>
                <TimeFormat/>
            </DropdownContent>
        </DropdownContainer>
    );
};

export default Settings;

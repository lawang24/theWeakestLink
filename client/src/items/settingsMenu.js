import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TimeFormat from './timeFormatter';

const DropdownContainer = styled.div`
    position: relative;
    display: inline-block;
`;

const DropdownButton = styled.button`
    /* Style your button */
`;

const DropdownContent = styled.div`
    display: ${props => props.isVisible ? 'block' : 'none'};
    position: absolute;
    bottom: 100%; /* Positions the dropdown above the button */
    left: 0;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
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
            <DropdownButton onClick={toggleDropdown}>Settings</DropdownButton>
            <DropdownContent isVisible={isVisible}>
                <TimeFormat/>
            </DropdownContent>
        </DropdownContainer>
    );
};

export default Settings;

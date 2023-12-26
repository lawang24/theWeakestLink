import { TeamSection } from "../styled_components/gameComponents"
import { Teams } from "./display_components"
import { TeamName } from "../styled_components/gameComponents"
import styled from "styled-components"

const TeamRoster = ({ whiteTeam, blackTeam, gameStarted }) => {
    return (
        <TeamRosterWrapper>
            <TeamSection>
                <TeamName color="white">WHITE</TeamName>
                <Teams team={whiteTeam} isWhite={true} gameStarted={gameStarted} />
            </TeamSection>
            <TeamSection>
                <TeamName>BLACK</TeamName>
                <Teams team={blackTeam} isWhite={false} gameStarted={gameStarted} />
            </TeamSection>
        </TeamRosterWrapper>
    );
}

const TeamRosterWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    grid-area: roster;
    height: 100%;
    width: 100%;
    `


export default TeamRoster

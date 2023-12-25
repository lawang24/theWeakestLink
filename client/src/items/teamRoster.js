import { TeamSection } from "../styled_components/gameComponents"
import { Teams } from "./display_components"
import { TeamName } from "../styled_components/gameComponents"

const TeamRoster = ({ whiteTeam, blackTeam, gameStarted}) => {
    return (
    <div style={{ display: "flex", "flexFlow": "row wrap", "justifyContent": "center", height: "fit-content", width: "100%", "marginTop": "17%" }}>
        <TeamSection>
            <TeamName color="white">WHITE</TeamName>
            <Teams team={whiteTeam} isWhite={true} gameStarted={gameStarted} />
        </TeamSection>
        <TeamSection>
            <TeamName>BLACK</TeamName>
            <Teams team={blackTeam} isWhite={false} gameStarted={gameStarted} />
        </TeamSection>
    </div>
    );
}

export default TeamRoster

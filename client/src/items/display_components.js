import styled from "styled-components";
import whiteTower from "../images/tower_white.png"
import blackTower from "../images/tower_black.png"

const Tower = (props) => {
  if (props.isWhite) return <img style={props.style} src={whiteTower} alt="logo" />
  else return <img style={props.style} src={blackTower} alt="logo" />
}

export const Teams = ({ team, isWhite, gameStarted }) => {

  if (!team) return;

  const Icon = ({ player }) => {
    if (!gameStarted) return <Tower isWhite={isWhite} style={{ height: "22px", paddingRight: "8px" }} />
    return <ScoreNumber> {player._scorecard} </ScoreNumber>
  }

  return (
    <Members>
      {Array.from(team, ([username, information]) => (
        <div style={{ display: "flex", width: "100%", justifyContent: "start", height: "fit-content", marginBottom: "10px" }} key={username}>
          <Icon player={information} />
          <li style={{ color: "#FFFFFF", height: "fit-content" }}> {username} </li>
        </div>
      ))}
    </Members>
  )
}

const Members = styled.ul`
display: flex;
flex-flow: column;
height: fit-content;
width: fit-content;
list-style-type:none;
padding:0;
margin:0;
margin-bottom:15px;
font-family: 'Montserrat';
font-style: normal;
font-weight: 600;
font-size: 18px;
`;
const ScoreNumber = styled.li`
color: #FFFFFF;
height: fit-content;
margin-right: 10px;
`

export const Ratings = ({ team, gameStarted }) => {
  if (!gameStarted) return;
  else return (
    <RatingList>
      StockFish Evals:
      {Array.from(team, ([username, information]) => {
        return (
          <RatingNumber> {information._move_rating} </RatingNumber>
        )
      })}
    </RatingList>
  )
}

const RatingList = styled(Members)`
color: #FFFFFF;
flex-direction: row;
justify-content: center;
width:100%;
`;

const RatingNumber = styled.li`
height: fit-content;
margin: 0 7px;
`

export const Gameover = ({isCheckmate, timeOut, whiteTurn}) => {
  if (isCheckmate) {
    return (<div>CHECKMATE BUCKO</div>);
  }
  if (timeOut) {
    return (<div>{whiteTurn ? "BLACK" : "WHITE"} WINS ON TIME</div>);
  }
}

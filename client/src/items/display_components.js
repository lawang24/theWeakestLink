import styled from "styled-components";
import whiteTower from "../images/tower_white.png"
import blackTower from "../images/tower_black.png"

const Tower = (props) => {
  if (props.isWhite) return <img style={props.style} src={whiteTower} alt="logo" />
  else return <img style={props.style} src={blackTower} alt="logo" />
}

// team is a Map of username, Player pairs
export const Teams = ({ team, isWhite, gameStarted }) => {

  if (!team) return;

  const Icon = ({ player }) => {
    if (!gameStarted) return <Tower isWhite={isWhite} style={{ height: "22px", paddingRight: "8px" }} />
    return <ScoreNumber> {player._scorecard} </ScoreNumber>
  }

  return (
    <Members>
      {Array.from(team, ([username, information]) => (
        <PlayerWrapper key = {username} is_highlighted = {information.is_highlighted}>
          <Icon player={information} />
          <Username >{username}</Username>
        </PlayerWrapper>
      ))}
    </Members>
  )
}

const PlayerWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: start;
  height: fit-content;
  margin-bottom: 10px;
  color: ${props => props.is_highlighted ? 'red' : 'white'};
`;


const Username = styled.li`
  height: fit-content;
`

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

  if (!isCheckmate && !timeOut) return null;

  const winner = whiteTurn ? "BLACK" : "WHITE"

  const CheckMateMessage = `CHECKMATE! ${winner} WINS`;
  const TimeOutMessage =`${winner} WINS ON TIME`;

  return <EndingWrapper> {isCheckmate? CheckMateMessage : TimeOutMessage} </EndingWrapper> 
  
}

const EndingWrapper = styled.div`
  color: #FFFFFF;
  font-family: Montserrat;
  font-size: 1rem;
  text-align: center;
  margin-top: 10px;
`



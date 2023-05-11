import io from 'socket.io-client';
import Game from "./pages/gameFunctional.js"
import JoinRoom from "./pages/JoinRoom"
import './App.css'
import { Wrapper } from './StyledComponents';
import { PlayerProvider, usePlayerContext } from './contexts/PlayerContext';
import { heroku_server_url, port_3001_url } from './constants.js';

// const socket = io(heroku_server_url); 
const socket = io(port_3001_url);

const AppContent = () => {
  const {isInRoom } = usePlayerContext();
  return isInRoom ? <Game /> : <JoinRoom />;
}

const App = () => {
  return (
    <Wrapper>
      <PlayerProvider socket={socket}>
        <AppContent/>
      </PlayerProvider>
    </Wrapper>
  );
}

export default App;




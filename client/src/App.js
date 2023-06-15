import io from 'socket.io-client';
import Game from "./main_pages/gameFunctional.js"
import JoinRoom from "./main_pages/JoinRoom.js"
import './App.css'
import { Wrapper } from './styled_components/index.js';
import { PlayerProvider, usePlayerContext } from './contexts/PlayerContext.js';

const socket = io('https://weakestlinkserver.herokuapp.com'); 
// const socket = io('http://localhost:3001');

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




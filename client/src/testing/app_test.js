import io from 'socket.io-client';
import Game from "./pages/gameFunctional.js"
import JoinRoom from "./pages/JoinRoom.js"
import './App.css'
import { Wrapper } from './StyledComponents/index.js';
import { PlayerProvider, usePlayerContext } from './context_test.js';
import { port_3001_url } from './constants.js';

const socket = io(port_3001_url);

const AppContent = () => {
  const {isInRoom } = usePlayerContext();
  return isInRoom ? <Game /> : <JoinRoom />;
}

const Testing_App = () => {
  return (
    <Wrapper>
      <PlayerProvider socket={socket}>
        <AppContent/>
      </PlayerProvider>
    </Wrapper>
  );
}

export default Testing_App;




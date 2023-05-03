import io from 'socket.io-client';
import Game from "./pages/gameFunctional.js"
import JoinRoom from "./pages/JoinRoom"
import './App.css'
import { Wrapper } from './StyledComponents';
import { PlayerProvider, usePlayerContext } from './contexts/PlayerContext';

const socket = io('http://localhost:3001');

function AppContent() {
  const {isInRoom } = usePlayerContext();
  return isInRoom ? <Game /> : <JoinRoom />;
}

function App() {
  return (
    <Wrapper>
      <PlayerProvider socket={socket}>
        <AppContent/>
      </PlayerProvider>
    </Wrapper>
  );
}

export default App;




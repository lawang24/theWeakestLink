function JoinRoom({ joinRoom, roomCode, setRoomCode, newRoom }) {

    return (
      <div>
        <form onSubmit={joinRoom}>
          <h1>Join Current Lobby</h1>
          <input
            type="text"
            placeholder="Enter Code Here"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
  
        <form onSubmit={newRoom}>
          <h1>Create New Lobby</h1>
          <button type="submit">Create</button>
        </form>
      </div>
    );
  };

export default JoinRoom;
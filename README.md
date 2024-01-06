# The Weakest Link: a Multiplayer Chess Game

## Overview
TheWeakestLink is an multiplayer chess game to uncover who's the worst player in the friend group. In this game, two teams compete against each other, with each team collectively deciding their moves. Unlike traditional chess, players will propose moves, but only the worst move out of all the options is played onto the board.

## Gameplay
- **Team Formation:** Players divide themselves into two teams.
- **Turn-Based Play:** Each team takes turns to make a move. During a team's turn, every player on the team votes for what they believe is the best move.
- **Voting Phase:** Moves are rated in real-time by Stockfish to determine the weakest move. Instead of the best move, the move rated as the worst by Stockfish (a powerful chess engine) is the one that's actually played. 
- **Winning the Game:** Standard chess rules apply for checkmate to determine the winning team.

## Features
- **Real-Time Communication:** WebSockets (socket.io) used for simultaneous two-way communication between clients and main server.
- **Stockfish 8 Integration:** Objective move analysis provided by the notable open-source chess engine.
- **Leaderboards:** Tracks and displays individual player performances over the course of the game.
- **Multiplatform Responsiveness:** Accessible on desktop, mobile and various devices for a wide audience.
---
Let me know what you think!


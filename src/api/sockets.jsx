// src/socket.js
import { io } from 'socket.io-client';

// Establish connection to the server (replace 'http://localhost:3000' with your server URL)
const socket = io('http://localhost:3000', { withCredentials: true });

socket.on('connect', () => {
  console.log('Connected to the server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Handle user presence update
socket.on('userPresenceUpdate', ({ userId, isOnline }) => {
  console.log(`User ${userId} is ${isOnline ? 'online' : 'offline'}`);
});

// Handle incoming messages
socket.on('message', (messageData) => {
  console.log('New message:', messageData);
});

// Handle typing events
socket.on('userTyping', ({ userId, isTyping }) => {
  console.log(`User ${userId} is ${isTyping ? 'typing...' : 'stopped typing'}`);
});

export default socket;

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const connectedClients = new Map();

wss.on('connection', function connection(ws) {
  let userName;
  let nameSet = false; // Flag to track whether the user's name has been set

  ws.on('message', function incoming(data) {
    if (!nameSet) {
      userName = data;
      connectedClients.set(ws, userName);
      broadcast(`${userName} connected. Total users: ${connectedClients.size}`);
      nameSet = true; // Set the flag to true after the user's name is set
    } else if (!data.includes('connected')) {
      broadcast(`${userName}: ${data}`);
    }
  });

  ws.on('close', function() {
    if (userName) {
      const disconnectedUsername = connectedClients.get(ws);
      connectedClients.delete(ws);
      broadcast(`${disconnectedUsername} disconnected. Total users: ${connectedClients.size}`);
    }
  });
});

function broadcast(message) {
  connectedClients.forEach(function(username, client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`);
});

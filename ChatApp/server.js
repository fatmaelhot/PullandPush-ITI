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

  ws.on('message', function incoming(data) {
    const message_content = JSON.parse(data);
    if (!userName) {
      userName = message_content.sender;
      connectedClients.set(ws, userName);
      broadcast(`${userName} connected. Total users: ${connectedClients.size}`);
    } else {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    }
  });

  ws.on('close', function() {
    const disconnectedUsername = connectedClients.get(ws);
    connectedClients.delete(ws);
    broadcast(`${disconnectedUsername} disconnected. Total users: ${connectedClients.size}`);
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

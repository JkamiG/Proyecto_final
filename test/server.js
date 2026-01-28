const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*", // Permite conexiones desde cualquier IP de tu red
    methods: ["GET", "POST"]
  }
});
const mongoose = require('mongoose');

app.get('/', (req, res) => {
  res.send('<h1>Servidor de Chat Corriendo</h1>');
});

// --- Lógica de Socket.io ---
io.on('connection', (socket) => {
  console.log('✅ Usuario conectado:', socket.id);

  // Escuchar mensaje del cliente
  socket.on('chat message', (msg) => {
    console.log('Mensaje recibido:', msg);
    // Reenviar mensaje a TODOS los usuarios conectados
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado');
  });
});

const PORT = 3000;
http.listen(PORT, '0.0.0.0', () => { 
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
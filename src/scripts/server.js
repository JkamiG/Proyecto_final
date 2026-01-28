const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

// ESTO ES LO QUE TE FALTA: Enviar el archivo HTML en lugar de solo texto
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/front.html');
});

io.on('connection', (socket) => {
  console.log('✅ Usuario conectado id:', socket.id);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado');
  });
});

// El '0.0.0.0' permite que otros te vean en la red
http.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
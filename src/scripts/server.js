import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

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

httpServer.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
const express = require('express');
const router = express.Router();
const MessageService = require('../../services/messagesService');

// Configuración de Socket.IO
const { Server } = require('socket.io');
const io = new Server();

router.get('/chat', (req, res) => {
  res.render('chat');
});

// Middleware para manejar mensajes del chat
io.on('connection', (socket) => {
  console.log('Cliente conectado al chat');

  socket.on('chatMessage', async (data) => {
    // Guardar el mensaje en MongoDB
    const messageService = new MessageService();
    await messageService.saveMessage(data.user, data.message);

    // Emitir el mensaje a todos los clientes conectados
    io.emit('chatMessage', data);
  });
});

module.exports = { router, io };

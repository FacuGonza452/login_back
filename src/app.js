const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const ProductService = require('../services/productService');
const MessageService = require('../services/messagesService');
const MessageModel = require('../dao/models/messageModel');
const ProductModel = require('../dao/models/productModel');
const productRouter = require('./routes');
const cartRouter = require('./cartRoutes');
const { router: routesRouter, io: routesIo } = require('./messagesRoutes'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;

// Conexión a MongoDB
const mongoURI = 'mongodb://localhost:27017/Ecommerce';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión a MongoDB:', error);
});

db.once('open', () => {
  console.log('Conexión exitosa a MongoDB local');
});

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
const hbs = exphbs.create({ extname: '.handlebars', layoutsDir: '', defaultLayout: null });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para el manejo de JSON
app.use(express.json());

// Rutas para productos y carritos
app.use('/products', productRouter);
app.use('/carts', cartRouter);
app.use('/chat', routesRouter); // Usa el router de routes.js

// Configuración de WebSockets
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Enviar lista de productos a través de WebSocket
  socket.emit('products', []);

  // Manejar mensajes del chat
  socket.on('chatMessage', async (data) => {
    // Guardar el mensaje en MongoDB
    const messageService = new MessageService();
    await messageService.saveMessage(data.user, data.message);

    // Utilizar el modelo para encontrar mensajes
    const messages = await MessageModel.find();
    console.log('Mensajes encontrados:', messages);

    // Emitir el mensaje a todos los clientes conectados
    routesIo.emit('chatMessage', data); // Usa el io de routes.js
  });
});

// Ruta para listar todos los productos
productRouter.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para la vista home.handlebars
app.get('/', (req, res) => {
  res.render('home'); // Renderiza la vista home.handlebars
});
app.get('/chat', (req, res) => {
  res.render('chat');
});
app.get('/carts', (req, res) => {
  res.render('carts');
});
app.get('/products', (req, res) => {
  res.render('products');
});
// Escuchar en el puerto
server.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});

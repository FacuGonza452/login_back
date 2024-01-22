const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport'); // Agregado: Importar Passport
const ProductService = require('../services/productService');
const MessageService = require('../services/messagesService');
const CartService = require('../services/cartService');
const UserService = require('../services/userService');
const MessageModel = require('../src/models/messageModel');
const ProductModel = require('../src/models/productModel');
const CartModel = require('../src/models/cartModel');
const UserModel = require('../src/models/userModel');
const productRouter = require('./routes/routes');
const cartRouter = require('./routes/cartRoutes');
const userRouter = require('./routes/userRoutes');
const { router: routesRouter, io: routesIo } = require('./routes/messagesRoutes');

// Configuración de Passport
require('../config/passport')(passport);

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

// Middleware de sesiones
app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas para productos, carritos y usuarios
app.use('/products', productRouter);
app.use('/carts', cartRouter);
app.use('/user', userRouter);
app.use('/chat', routesRouter);

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
    routesIo.emit('chatMessage', data);
  });
});

// Ruta para listar todos los productos
productRouter.get('/', async (req, res) => {
  try {
    const productService = new ProductService();
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para la vista home.handlebars
app.get('/', (req, res) => {
  res.render('home');
});

// Ruta para la vista de productos paginados
app.get('/products', async (req, res) => {
  try {
    const productService = new ProductService();
    const { page = 1, limit = 10, sort, query } = req.query;
    const products = await productService.getPaginatedAndFilteredProducts(page, limit, sort, query);
    res.render('products', { products });
  } catch (error) {
    console.error('Error al obtener productos paginados y filtrados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para la vista de detalles de un producto
app.get('/products/:pid', async (req, res) => {
  try {
    const productService = new ProductService();
    const productId = req.params.pid;
    const product = await productService.getProductById(productId);
    res.render('productDetails', { product });
  } catch (error) {
    console.error('Error al obtener detalles del producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para la vista de carritos
app.get('/carts', async (req, res) => {
  try {
    const cartService = new CartService();
    const carts = await cartService.getAllCarts();
    res.render('carts', { carts });
  } catch (error) {
    console.error('Error al obtener carritos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para la vista de detalles de un carrito
app.get('/carts/:cid', async (req, res) => {
  try {
    const cartService = new CartService();
    const cartId = req.params.cid;
    const cart = await cartService.getCartById(cartId);
    res.render('cartDetails', { cart });
  } catch (error) {
    console.error('Error al obtener detalles del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para logout
app.get('/logout', (req, res) => {
  // Destruir la sesión
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      // Redirigir a la vista de login
      res.redirect('/user/login');
    }
  });
});

// Escuchar en el puerto
server.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});

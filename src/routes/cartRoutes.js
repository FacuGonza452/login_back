const express = require('express');
const router = express.Router();
const CartService = require('../../services/cartService');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const cartService = new CartService();
    const newCart = await cartService.createCart(req.body);
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const cartService = new CartService();
    const carts = await cartService.getAllCarts();
    res.json(carts);
  } catch (error) {
    console.error('Error al obtener carritos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener detalles de un carrito por ID
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cartService = new CartService();
    const cart = await cartService.getCartById(cartId);

    // Renderizar la vista con los detalles del carrito (ajusta según tus necesidades)
    res.render('cartDetails', { cart });
  } catch (error) {
    console.error('Error al obtener detalles del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Agregar un producto a un carrito por ID de carrito
router.post('/:cid/products', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cartService = new CartService();
    const productId = req.body.productId; // Asume que el productId se envía en el cuerpo de la solicitud
    const quantity = req.body.quantity || 1; // Asume que la cantidad es opcional y por defecto es 1
    const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar la cantidad de un producto en un carrito por ID de carrito y ID de producto
router.put('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cartService = new CartService();
    const quantity = req.body.quantity;
    const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar un producto de un carrito por ID de carrito y ID de producto
router.delete('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cartService = new CartService();
    const updatedCart = await cartService.removeProductFromCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar todos los productos de un carrito por ID de carrito
router.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cartService = new CartService();
    await cartService.removeAllProductsFromCart(cartId);
    res.json({ message: 'Productos eliminados exitosamente del carrito' });
  } catch (error) {
    console.error('Error al eliminar todos los productos del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;

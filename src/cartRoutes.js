const express = require('express');
const router = express.Router();
const CartService = require('../services/cartService');

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

// Obtener productos en un carrito por ID de carrito
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cartService = new CartService();
    const cartProducts = await cartService.getCartProducts(cartId);
    res.json(cartProducts);
  } catch (error) {
    console.error('Error al obtener productos del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Agregar un producto a un carrito por ID de carrito y ID de producto
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cartService = new CartService();
    const updatedCart = await cartService.addProductToCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;

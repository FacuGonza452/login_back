const CartModel = require('../src/models/cartModel');

class CartService {
  async createCart(cartData) {
    try {
      return await CartModel.create(cartData);
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw error; 
    }
  }

  async getAllCarts() {
    try {
      return await CartModel.find();
    } catch (error) {
      console.error('Error al obtener todos los carritos:', error);
      throw error;
    }
  }
}

module.exports = CartService;

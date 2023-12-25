const ProductModel = require('../dao/models/productModel');

class ProductService {
  async createProduct(productData) {
    try {
      return await ProductModel.create(productData);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      return await ProductModel.find();
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
      throw error;
    }
  }
}

module.exports = ProductService;

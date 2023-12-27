const ProductModel = require('../src/models/productModel');

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

  async getPaginatedProducts(page = 1, limit = 10) {
    // Implementar la lógica para obtener productos paginados desde MongoDB
    // Puedes utilizar el método skip() y limit() de Mongoose
    const products = await ProductModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return products;
  }
}

module.exports = ProductService;

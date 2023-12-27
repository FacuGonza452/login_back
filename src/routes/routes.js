const express = require('express');
const router = express.Router();
const ProductService = require('../../services/productService');

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    // Extrae los campos del cuerpo de la solicitud
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    // Valida que los campos obligatorios estén presentes
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes' });
    }

    // Crea un nuevo producto con los campos proporcionados
    const productService = new ProductService();
    const newProduct = await productService.createProduct({
      title,
      description,
      code,
      price,
      status: status || true, // true por defecto
      stock,
      category,
      thumbnails: thumbnails || [], // vacío por defecto
    });

    // Responde con el nuevo producto creado
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productService = new ProductService();
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const productService = new ProductService();
    const updatedProduct = await productService.updateProduct(productId, req.body);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const productService = new ProductService();
    await productService.deleteProduct(productId);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const ProductService = require('../../services/productService');

// Ruta para obtener productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
  try {
    const productService = new ProductService();

    // Extraer parámetros de consulta
    const { limit = 10, page = 1, sort, query } = req.query;

    // Convertir limit y page a valores numéricos
    const limitNumber = parseInt(limit);
    const pageNumber = parseInt(page);

    // Construir objeto de opciones para la consulta
    const options = {
      limit: isNaN(limitNumber) ? 10 : limitNumber,
      page: isNaN(pageNumber) ? 1 : pageNumber,
      sort: sort === 'desc' ? -1 : 1,
    };

    // Aplicar filtros y ordenamientos según los parámetros de consulta
    const result = await productService.getProducts(options, query);

    // Construir la respuesta con el formato solicitado
    const response = {
      status: 'success',
      payload: result.docs, // "docs" contiene los productos
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query || ''}` : null,
      nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query || ''}` : null,
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

module.exports = router;
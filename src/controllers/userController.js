const express = require('express');
const router = express.Router();

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  const redirect = req.query.redirect || '/';
  res.render('login', { redirect });
});

// Ruta para manejar el inicio de sesión
router.post('/login', (req, res) => {
  // Lógica de autenticación (verificar el correo electrónico y la contraseña)
  const { email, password } = req.body;

  // Verifica las credenciales (aquí debes implementar tu lógica de autenticación)
  if (email === 'usuario@example.com' && password === 'contraseña') {
    // Inicia sesión correctamente
    req.session.user = { email }; // Almacena el usuario en la sesión

    // Redirige a la URL proporcionada o al home por defecto
    const redirect = req.body.redirect || '/';
    res.redirect(redirect);
  } else {
    // Autenticación fallida
    res.render('login', { error: 'Credenciales incorrectas' });
  }
});
// Manejar inicio de sesión
router.handleLogin = (req, res) => {
    const { email, password } = req.body;
  
    // Verifica las credenciales utilizando el servicio de usuario
    if (userService.isValidUser(email, password)) {
      req.session.user = { email }; // Almacena el usuario en la sesión
      const redirect = req.body.redirect || '/';
      res.redirect(redirect);
    } else {
      res.render('login', { error: 'Credenciales incorrectas' });
    }
  };
  
  // Obtener nombre de usuario
  router.getUsername = (req) => {
    return req.session.user ? req.session.user.email : null;
  };
  
  module.exports = router;

module.exports = router;

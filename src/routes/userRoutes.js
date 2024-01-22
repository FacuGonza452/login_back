const express = require('express');
const passport = require('passport');
const router = express.Router();
const UserService = require('../../services/userService');

// Ruta para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register'); // Crea tu vista de registro (register.handlebars)
});

// Ruta para manejar el formulario de registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userService = new UserService();
    const newUser = await userService.registerUser({ username, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para el formulario de login
router.get('/login', (req, res) => {
  res.render('login'); // Crea tu vista de login (login.handlebars)
});

// Ruta para manejar el formulario de login con Passport
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true,
  })
);

// Ruta para el login con GitHub
router.get('/login/github',
  passport.authenticate('github'));

router.get('/login/github/callback',
  passport.authenticate('github', { failureRedirect: '/user/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Ruta para obtener el nombre del usuario (implementar en tu vista)
router.get('/username', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ username: req.user.username });
  } else {
    res.json({ username: null });
  }
});

// Ruta para logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/user/login');
});

module.exports = router;
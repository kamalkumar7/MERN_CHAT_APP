const express = require('express');

const login = require('../controllers/login.controllers');
const register = require('../controllers/register.controllers')
const logout = require('../controllers/logout.controllers')
const profile = require ('../controllers/profile.controllers')

const router = express();

router.post('/login', login);
router.post('/register',register);
router.post('/logout',logout);
router.get('/profile',profile);

module.exports = router;
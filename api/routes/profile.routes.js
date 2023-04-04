const express = require('express')
const getProfile = require('../controllers/profile.controllers.js');
const router = express();

router.get('',getProfile);
module.exports = router;
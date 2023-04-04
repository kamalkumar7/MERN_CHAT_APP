const express = require('express')
const getpeople = require('../controllers/getpeopele.js');
const router = express();

router.get('',getpeople);
module.exports = router;
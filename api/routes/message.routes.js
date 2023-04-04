const express = require('express')
const getMessage = require('../controllers/getMessage.js');
const router = express();

router.get('/:userId',getMessage);
module.exports = router;
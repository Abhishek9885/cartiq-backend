const express = require('express');
const router = express.Router();
const { generateCart } = require('../controllers/cartController');

router.post('/generate', generateCart);

module.exports = router;

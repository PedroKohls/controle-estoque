const express = require('express');
const router = express.Router();
const instrumentoController = require('../controllers/instrumentoController');

router.get('/', instrumentoController.index); 

module.exports = router;

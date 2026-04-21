var express = require('express');
var router = express.Router();
const instrumentoController = require('../controllers/instrumentoController');


/* GET home page. */
router.get('/', instrumentoController.update); 

module.exports = router;

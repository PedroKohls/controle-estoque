var express = require('express');
var router = express.Router();
const instrumentoController = require('../controllers/instrumentoController');


/* GET home page. */
router.get('/', instrumentoController.destroy); 

module.exports = router;
